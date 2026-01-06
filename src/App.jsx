import { useState, useEffect } from "react";
import { rooms as initialRooms } from "./data/rooms";
import RoomCard from "./components/RoomCard";
import Filters from "./components/Filters";
import RoomModal from "./components/RoomModal";
import { clientes as initialClientes } from "./data/clientes";

import {
  fetchRoomsFromFirebase,
  fetchClientsFromFirebase,
  saveRoomToFirebase,
  saveClientToFirebase
} from "./firebaseService";

export default function App() {
  const [clientes, setClientes] = useState(() => {
    const stored = localStorage.getItem("clientes");
    return stored ? JSON.parse(stored) : initialClientes;
  });

  const [rooms, setRooms] = useState(() => {
    const stored = localStorage.getItem("rooms");
    return stored ? JSON.parse(stored) : initialRooms;
  });

  const [filters, setFilters] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Persistencia LocalStorage
  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  // Cargar datos de Firebase y fusionar
  useEffect(() => {
    const syncFirebase = async () => {
      try {
        const fbRooms = await fetchRoomsFromFirebase();
        const fbClients = await fetchClientsFromFirebase();

        const mergedRooms = initialRooms.map(r => {
          const fbRoom = fbRooms.find(fr => fr.id === r.id);
          return fbRoom ? fbRoom : r;
        });
        setRooms(mergedRooms);

        const mergedClients = [...clientes];
        fbClients.forEach(fc => {
          if (!mergedClients.find(c => c.cedula === fc.cedula)) {
            mergedClients.push(fc);
          }
        });
        setClientes(mergedClients);
      } catch (err) {
        console.log("Sin conexión, usando LocalStorage:", err);
      }
    };
    syncFirebase();
  }, []);

  // Filtrado
  const filteredRooms = rooms.filter(room => {
    return (
      (!filters.tipo || room.tipo === filters.tipo) &&
      (!filters.tipoCama || room.tipoCama === filters.tipoCama) &&
      (!filters.estado || room.estado === filters.estado) &&
      (!filters.aire || room.aireAcondicionado.toString() === filters.aire)
    );
  });

  // Funciones de negocio
  const handleCheckIn = (clienteData) => {
    if (!clienteData || !clienteData.cliente || !clienteData.cliente.cedula) {
      console.log("❌ Datos incompletos para check-in", clienteData);
      return;
    }

    const cliente = clienteData.cliente;
    let clienteExistente = clientes.find(c => c.cedula === cliente.cedula);

    if (!clienteExistente) {
      setClientes(prev => {
        const nuevo = [...prev, cliente];
        saveClientToFirebase(cliente);
        return nuevo;
      });
      clienteExistente = cliente;
    }

    setRooms(prev => {
      const updated = prev.map(r =>
        r.id === selectedRoom.id
          ? { ...r, estado: "OCUPADA", cliente: clienteExistente }
          : r
      );
      const roomUpdated = updated.find(r => r.id === selectedRoom.id);
      if (roomUpdated) saveRoomToFirebase(roomUpdated);
      return updated;
    });

    setSelectedRoom(null);
  };

  const handleCheckOut = (id) => {
    setRooms(prev => {
      const updated = prev.map(r =>
        r.id === id ? { ...r, estado: "LIMPIEZA", cliente: null, reserva: null } : r
      );
      const roomUpdated = updated.find(r => r.id === id);
      if (roomUpdated) saveRoomToFirebase(roomUpdated);
      return updated;
    });
    setSelectedRoom(null);
  };

  const handleAvailable = (id) => {
    setRooms(prev => {
      const updated = prev.map(r =>
        r.id === id ? { ...r, estado: "DISPONIBLE" } : r
      );
      const roomUpdated = updated.find(r => r.id === id);
      if (roomUpdated) saveRoomToFirebase(roomUpdated);
      return updated;
    });
    setSelectedRoom(null);
  };

  const handleProblem = (id) => {
    setRooms(prev => {
      const updated = prev.map(r =>
        r.id === id ? { ...r, estado: "PROBLEMA" } : r
      );
      const roomUpdated = updated.find(r => r.id === id);
      if (roomUpdated) saveRoomToFirebase(roomUpdated);
      return updated;
    });
    setSelectedRoom(null);
  };

  const handleReserve = (reservaData) => {
    const { roomId, nombre, apellido, cedula, fechaEntrada, fechaSalida } = reservaData;

    let clienteExistente = clientes.find(c => c.cedula === cedula);
    if (!clienteExistente) {
      clienteExistente = { nombre, apellido, cedula, telefono: "", metodoPago: "efectivo", transaccion: "" };
      setClientes(prev => {
        const nuevo = [...prev, clienteExistente];
        saveClientToFirebase(clienteExistente);
        return nuevo;
      });
    }

    setRooms(prev => {
      const updated = prev.map(r =>
        r.id === roomId
          ? { ...r, estado: "RESERVADA", cliente: clienteExistente, reserva: { fechaEntrada, fechaSalida } }
          : r
      );
      const roomUpdated = updated.find(r => r.id === roomId);
      if (roomUpdated) saveRoomToFirebase(roomUpdated);
      return updated;
    });
  };

  // Render
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">ImpulsHotel</h1>

      <Filters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredRooms.map(room => (
          <div key={room.id} onClick={() => setSelectedRoom(room)}>
            <RoomCard room={rooms.find(r => r.id === room.id)} />
          </div>
        ))}
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onCheckIn={handleCheckIn}
          onCheckOut={() => handleCheckOut(selectedRoom.id)}
          onAvailable={() => handleAvailable(selectedRoom.id)}
          onProblem={() => handleProblem(selectedRoom.id)}
          onReserve={handleReserve}
        />
      )}
    </div>
  );
}

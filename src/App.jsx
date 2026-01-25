import { useState, useCallback, useEffect } from "react";
import RoomCard from "./components/RoomCard";
import Filters from "./components/Filters";
import RoomModal from "./components/RoomModal";
import AddRoomForm from "./components/AddRoomForm";
import AddClientForm from "./components/AddClientForm";

import {
  getRooms,
  getClients,
  updateRoom,
  createClient,
  createRoom,
} from "./firebaseService";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [popup, setPopup] = useState(null);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [showAddClientForm, setShowAddClientForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [fbRooms, fbClients] = await Promise.all([
        getRooms(),
        getClients(),
      ]);
      setRooms(fbRooms);
      setClientes(fbClients);
    } catch (err) {
      console.error("Error fetching data from Firebase:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);





  // Filtrado robusto para evitar errores de renderizado
  const filteredRooms = rooms.filter((room) => {
    if (!room) {
      return false;
    }
    if (filters.tipo && room.tipo !== filters.tipo) {
      return false;
    }
    if (filters.tipoCama && room.tipoCama !== filters.tipoCama) {
      return false;
    }
    if (filters.estado && room.estado !== filters.estado) {
      return false;
    }
    if (filters.aire) {
      if (
        !Object.prototype.hasOwnProperty.call(room, "aireAcondicionado") ||
        room.aireAcondicionado.toString() !== filters.aire
      ) {
        return false;
      }
    }
    return true;
  });

  const handleAddRoom = () => {
    setShowAddRoomForm(true);
  };

  const handleCreateRoom = async (newRoomData) => {
    try {
      const roomToAdd = {
        ...newRoomData,
        cliente: null,
        reserva: null,
      };
      await createRoom(roomToAdd);
      await fetchData();
      setPopup({ message: "Habitación creada con éxito", color: "green" });
    } catch (error) {
      console.log(error);
      setPopup({ message: "Error al crear la habitación", color: "red" });
    } finally {
      setShowAddRoomForm(false);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  const handleAddClient = () => {
    setShowAddClientForm(true);
  };

  const handleCreateClient = async (newClientData) => {
    try {
      await createClient(newClientData);
      await fetchData();
      setPopup({ message: "Cliente creado con éxito", color: "green" });
    } catch (error) {
      console.log(error);
      setPopup({ message: "Error al crear el cliente", color: "red" });
    } finally {
      setShowAddClientForm(false);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  const handleCheckIn = async (clienteData) => {
    if (
      !clienteData ||
      !clienteData.cliente ||
      !clienteData.cliente.cedula ||
      !selectedRoom
    ) {
      console.log("❌ Datos incompletos para check-in", clienteData);
      return;
    }

    const cliente = clienteData.cliente;
    const clienteExistente = clientes.find((c) => c.id === cliente.cedula);

    try {
      if (!clienteExistente) {
        await createClient(cliente);
      }

      const roomUpdate = { estado: "OCUPADA", cliente: cliente };
      await updateRoom(selectedRoom.id, roomUpdate);

      await fetchData();
    } catch (error) {
      console.error("Error during check-in:", error);
    }

    setSelectedRoom(null);
  };

  const handleCheckOut = async (id) => {
    try {
      const roomUpdate = { estado: "LIMPIEZA", cliente: null, reserva: null };
      await updateRoom(id, roomUpdate);
      await fetchData();
    } catch (error) {
      console.error("Error during check-out:", error);
    }
    setSelectedRoom(null);
  };

  const handleAvailable = async (id) => {
    try {
      await updateRoom(id, { estado: "DISPONIBLE" });
      await fetchData();
    } catch (error) {
      console.error("Error setting room to available:", error);
    }
    setSelectedRoom(null);
  };

  const handleProblem = async (id) => {
    try {
      await updateRoom(id, { estado: "PROBLEMA" });
      await fetchData();
    } catch (error) {
      console.error("Error setting room to problem:", error);
    }
    setSelectedRoom(null);
  };

  const handleReserve = async (reservaData) => {
    const { roomId, nombre, apellido, cedula, fechaEntrada, fechaSalida } =
      reservaData;

    try {
      let clienteExistente = clientes.find((c) => c.id === cedula);
      if (!clienteExistente) {
        const newClient = {
          nombre,
          apellido,
          cedula,
          telefono: "",
          metodoPago: "efectivo",
          transaccion: "",
        };
        await createClient(newClient);
        clienteExistente = { id: cedula, ...newClient };
      }

      const roomUpdate = {
        estado: "RESERVADA",
        cliente: clienteExistente,
        reserva: { fechaEntrada, fechaSalida },
      };
      await updateRoom(roomId, roomUpdate);

      await fetchData();
    } catch (error) {
      console.error("Error during reservation:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          ImpulsHotel
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleAddRoom}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Agregar Habitación
          </button>
          <button
            onClick={handleAddClient}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
          >
            Agregar Cliente
          </button>
        </div>
      </div>

      <Filters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {filteredRooms.map((room) => (
          <div key={room.id} onClick={() => setSelectedRoom(room)}>
            <RoomCard room={room} />
          </div>
        ))}
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          clientes={clientes}
          onClose={() => setSelectedRoom(null)}
          onCheckIn={handleCheckIn}
          onCheckOut={() => handleCheckOut(selectedRoom.id)}
          onAvailable={() => handleAvailable(selectedRoom.id)}
          onProblem={() => handleProblem(selectedRoom.id)}
          onReserve={handleReserve}
        />
      )}

      {showAddRoomForm && (
        <AddRoomForm
          onSave={handleCreateRoom}
          onCancel={() => setShowAddRoomForm(false)}
        />
      )}

      {showAddClientForm && (
        <AddClientForm
          onSave={handleCreateClient}
          onCancel={() => setShowAddClientForm(false)}
        />
      )}

      {popup && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${
            popup.color === "green" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
}

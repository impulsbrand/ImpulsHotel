import { useState } from "react";

export default function ReserveForm({ room, onCancel, onSave }) {
  const [reserva, setReserva] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    fechaEntrada: "",
    fechaSalida: ""
  });

  const validar = () => {
    if (!reserva.nombre || !reserva.apellido || !reserva.cedula || !reserva.fechaEntrada || !reserva.fechaSalida) {
      alert("Todos los campos son obligatorios");
      return false;
    }
    if (reserva.fechaSalida < reserva.fechaEntrada) {
      alert("La fecha de salida no puede ser anterior a la entrada");
      return false;
    }
    return true;
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-bold mb-3">Reservar Habitación {room.numero}</h3>

      <input placeholder="Nombre" className="w-full border p-2 rounded mb-2" value={reserva.nombre} onChange={e => setReserva({ ...reserva, nombre: e.target.value })} />
      <input placeholder="Apellido" className="w-full border p-2 rounded mb-2" value={reserva.apellido} onChange={e => setReserva({ ...reserva, apellido: e.target.value })} />
      <input placeholder="Cédula" className="w-full border p-2 rounded mb-2" value={reserva.cedula} onChange={e => setReserva({ ...reserva, cedula: e.target.value })} />
      <input type="date" className="w-full border p-2 rounded mb-2" value={reserva.fechaEntrada} onChange={e => setReserva({ ...reserva, fechaEntrada: e.target.value })} />
      <input type="date" className="w-full border p-2 rounded mb-2" value={reserva.fechaSalida} onChange={e => setReserva({ ...reserva, fechaSalida: e.target.value })} />

      <div className="flex justify-end gap-2">
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancelar</button>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded" onClick={() => { if(!validar()) return; onSave({ ...reserva, roomId: room.id }); }}>
          Guardar Reserva
        </button>
      </div>
    </div>
  );
}

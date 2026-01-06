import { useState } from "react";
import CheckInForm from "./CheckInForm";
import ReserveForm from "./ReserveForm";

export default function RoomModal({
  room,
  onClose,
  onCheckIn,
  onCheckOut,
  onAvailable,
  onProblem,
  onReserve
}) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showReserve, setShowReserve] = useState(false);

  const puedeCheckIn = room.estado === "DISPONIBLE" || room.estado === "RESERVADA";
  const puedeCheckOut = room.estado === "OCUPADA";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-1">
          Habitación {room.numero}
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          {room.tipo} · {room.tipoCama} · {room.aireAcondicionado ? "A/C" : "Sin A/C"}
        </p>

        <p className="text-sm font-semibold mb-3">
          Estado actual: <span className="uppercase">{room.estado}</span>
        </p>

        {room.cliente && (
          <div className="bg-gray-100 rounded p-3 text-sm mb-4">
            <p className="font-semibold">{room.cliente.nombre} {room.cliente.apellido}</p>
            <p>Cédula: {room.cliente.cedula}</p>
          </div>
        )}

        {room.estado === "RESERVADA" && room.reserva && (
          <div className="bg-yellow-100 rounded p-3 text-sm mb-4">
            <p className="font-semibold">Reserva</p>
            <p>Entrada: {room.reserva.fechaEntrada}</p>
            <p>Salida: {room.reserva.fechaSalida}</p>
          </div>
        )}

        {!showCheckIn && !showReserve && (
          <div className="flex flex-wrap gap-2 mt-4">
            {puedeCheckIn && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => setShowCheckIn(true)}
              >
                Check-in
              </button>
            )}

            {puedeCheckOut && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => { onCheckOut(); onClose(); }}
              >
                Check-out
              </button>
            )}

            {room.estado !== "DISPONIBLE" && room.estado !== "RESERVADA" && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => { onAvailable(); onClose(); }}
              >
                Disponible
              </button>
            )}

            <button
              className="bg-orange-500 text-white px-4 py-2 rounded"
              onClick={() => { onProblem(); onClose(); }}
            >
              Problema
            </button>

            {room.estado === "DISPONIBLE" && (
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => setShowReserve(true)}
              >
                Reservar
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded ml-auto"
            >
              Cerrar
            </button>
          </div>
        )}

        {showCheckIn && (
          <CheckInForm
            room={room}
            onCancel={() => setShowCheckIn(false)}
            onSave={(clienteData) => { onCheckIn(clienteData); setShowCheckIn(false); onClose(); }}
          />
        )}

        {showReserve && (
          <ReserveForm
            room={room}
            onCancel={() => setShowReserve(false)}
            onSave={(reservaData) => { onReserve(reservaData); setShowReserve(false); onClose(); }}
          />
        )}

      </div>
    </div>
  );
}

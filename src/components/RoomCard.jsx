export default function RoomCard({ room }) {
    const estadoColors = {
      DISPONIBLE: "bg-green-500",
      OCUPADA: "bg-red-500",
      RESERVADA: "bg-yellow-400",
      LIMPIEZA: "bg-blue-400",
      PROBLEMA: "bg-orange-500",
    };
  
    return (
      <div
        className={`rounded-xl p-4 text-white cursor-pointer shadow-md hover:scale-105 transition ${
          estadoColors[room.estado] || "bg-gray-400"
        }`}
      >
        {/* Número de habitación */}
        <h2 className="text-xl font-bold">Habitación {room.numero}</h2>
  
        {/* Tipo */}
        <p className="text-sm opacity-90">{room.tipo}</p>
  
        {/* Características */}
        <p className="text-xs mt-1">
          {room.tipoCama} · {room.aireAcondicionado ? "A/C" : "Sin A/C"}
        </p>
  
        {/* Estado */}
        <p className="mt-2 text-xs font-semibold">
          Estado: {room.estado}
        </p>
  
        {/* Cliente (SIEMPRE propiedades, NUNCA el objeto) */}
        {room.cliente && (
          <div className="mt-2 text-xs bg-white/20 rounded p-2">
            <p className="font-semibold">
              {room.cliente.nombre} {room.cliente.apellido}
            </p>
            <p>Cédula: {room.cliente.cedula}</p>
          </div>
        )}
      </div>
    );
  }
  
import { useState } from "react";

export default function AddRoomForm({ onCancel, onSave }) {
  const [room, setRoom] = useState({
    numero: "",
    tipo: "SIMPLE",
    tipoCama: "INDIVIDUAL",
    capacidad: 1,
    precio: "",
    estado: "DISPONIBLE",
    aireAcondicionado: false,
  });

  const validate = () => {
    if (!room.numero || !room.precio || !room.capacidad) {
      alert("Número, precio y capacidad son obligatorios");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const isNumber = name === "capacidad" || name === "precio";
    setRoom((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : isNumber ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(room);
    setRoom({
      numero: "",
      tipo: "SIMPLE",
      tipoCama: "INDIVIDUAL",
      capacidad: 1,
      precio: "",
      estado: "DISPONIBLE",
      aireAcondicionado: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold mb-3 text-xl">Agregar Nueva Habitación</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="w-full border p-2 rounded mb-2 col-span-2"
            placeholder="Número de Habitación"
            name="numero"
            value={room.numero}
            onChange={handleChange}
          />

          <select
            className="w-full border p-2 rounded mb-2"
            name="tipo"
            value={room.tipo}
            onChange={handleChange}
          >
            <option value="SIMPLE">Simple</option>
            <option value="DOBLE">Doble</option>
            <option value="SUITE">Suite</option>
          </select>

          <select
            className="w-full border p-2 rounded mb-2"
            name="tipoCama"
            value={room.tipoCama}
            onChange={handleChange}
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="QUEEN">Queen</option>
            <option value="KING">King</option>
          </select>

          <input
            type="number"
            className="w-full border p-2 rounded mb-2"
            placeholder="Capacidad"
            name="capacidad"
            value={room.capacidad}
            onChange={handleChange}
          />

          <input
            type="number"
            className="w-full border p-2 rounded mb-2"
            placeholder="Precio"
            name="precio"
            value={room.precio}
            onChange={handleChange}
          />
          <select
            className="w-full border p-2 rounded mb-2"
            name="estado"
            value={room.estado}
            onChange={handleChange}
          >
            <option value="DISPONIBLE">Disponible</option>
            <option value="OCUPADA">Ocupada</option>
            <option value="LIMPIEZA">Limpieza</option>
            <option value="PROBLEMA">Problema</option>
          </select>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="aireAcondicionado"
              name="aireAcondicionado"
              checked={room.aireAcondicionado}
              onChange={handleChange}
            />
            <label htmlFor="aireAcondicionado">Aire Acondicionado</label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Crear Habitación
          </button>
        </div>
      </div>
    </div>
  );
}

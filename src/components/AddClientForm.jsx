import { useState } from "react";

export default function AddClientForm({ onCancel, onSave }) {
  const [client, setClient] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const validate = () => {
    if (!client.cedula || !client.nombre || !client.apellido) {
      alert("Cédula, nombre y apellido son obligatorios");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(client);
    setClient({
      cedula: "",
      nombre: "",
      apellido: "",
      telefono: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="font-bold mb-3 text-xl">Agregar Nuevo Cliente</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="w-full border p-2 rounded mb-2 col-span-2"
            placeholder="Cédula"
            name="cedula"
            value={client.cedula}
            onChange={handleChange}
          />
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Nombre"
            name="nombre"
            value={client.nombre}
            onChange={handleChange}
          />
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Apellido"
            name="apellido"
            value={client.apellido}
            onChange={handleChange}
          />
          <input
            className="w-full border p-2 rounded mb-2 col-span-2"
            placeholder="Teléfono"
            name="telefono"
            value={client.telefono}
            onChange={handleChange}
          />
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
            Crear Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

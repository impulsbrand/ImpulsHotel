import { useState } from "react";
import { clientes } from "../data/clientes";

export default function CheckInForm({ room, onCancel, onSave }) {
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    metodoPago: "efectivo",
    transaccion: ""
  });

  const handleCedulaChange = (value) => {
    const encontrado = clientes.find(c => c.cedula === value);
    if (encontrado) setCliente(encontrado);
    else setCliente(prev => ({ ...prev, cedula: value }));
  };

  const validar = () => {
    if (!cliente.nombre || !cliente.apellido || !cliente.cedula) {
      alert("Nombre, apellido y cédula son obligatorios");
      return false;
    }
    if (cliente.metodoPago !== "efectivo" && !cliente.transaccion) {
      alert("Debes ingresar el número de transacción");
      return false;
    }
    return true;
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-bold mb-3">Registro del Cliente (Check-in)</h3>

      <input className="w-full border p-2 rounded mb-2" placeholder="Nombre" value={cliente.nombre} onChange={e => setCliente({ ...cliente, nombre: e.target.value })} />
      <input className="w-full border p-2 rounded mb-2" placeholder="Apellido" value={cliente.apellido} onChange={e => setCliente({ ...cliente, apellido: e.target.value })} />
      <input className="w-full border p-2 rounded mb-2" placeholder="Cédula" value={cliente.cedula} onChange={e => handleCedulaChange(e.target.value)} />
      <input className="w-full border p-2 rounded mb-2" placeholder="Teléfono" value={cliente.telefono} onChange={e => setCliente({ ...cliente, telefono: e.target.value })} />

      <select className="w-full border p-2 rounded mb-2" value={cliente.metodoPago} onChange={e => setCliente({ ...cliente, metodoPago: e.target.value })}>
        <option value="efectivo">Efectivo</option>
        <option value="nequi">Nequi</option>
        <option value="transferencia">Transferencia</option>
      </select>

      {cliente.metodoPago !== "efectivo" && (
        <input className="w-full border p-2 rounded mb-2" placeholder="Número de transacción" value={cliente.transaccion} onChange={e => setCliente({ ...cliente, transaccion: e.target.value })} />
      )}

      <div className="flex justify-end gap-2">
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancelar</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => { if(!validar()) return; onSave({ cliente }); }}>
          Guardar Check-in
        </button>
      </div>
    </div>
  );
}

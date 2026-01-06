export default function Filters({ filters, setFilters }) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select className="p-2 border rounded" onChange={e => setFilters({ ...filters, tipo: e.target.value })}>
          <option value="">Tipo</option>
          <option>Doble</option>
          <option>Sencilla</option>
          <option>King</option>
        </select>
  
        <select className="p-2 border rounded" onChange={e => setFilters({ ...filters, tipoCama: e.target.value })}>
          <option value="">Cama</option>
          <option>Dos camas</option>
          <option>Doble</option>
          <option>King</option>
          <option>Individual</option>
        </select>
  
        <select className="p-2 border rounded" onChange={e => setFilters({ ...filters, aire: e.target.value })}>
          <option value="">A/C</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
  
        <select className="p-2 border rounded" onChange={e => setFilters({ ...filters, estado: e.target.value })}>
          <option value="">Estado</option>
          <option>DISPONIBLE</option>
          <option>OCUPADA</option>
          <option>RESERVADA</option>
          <option>LIMPIEZA</option>
          <option>PROBLEMA</option>
        </select>
      </div>
    );
  }
  
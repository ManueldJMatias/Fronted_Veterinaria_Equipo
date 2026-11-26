import { Plus, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { mascotas } from "../../data/demoData.js";
import { PageHeader, Panel, PetAvatar, StatusBadge } from "../../components/InterfazUI.jsx";
import "./mascotas.css";

export default function MisMascotas() {
  return (
    <div className="interface-page">
      <PageHeader
        title="Mis mascotas"
        description="Perfiles, información y accesos rápidos a sus expedientes."
        action={<Link className="primary-button" to="/cliente/mascotas/nueva"><Plus size={16} /> Registrar mascota</Link>}
      />
      <div className="filter-toolbar">
        <div className="filter-label-group"><strong>Todas las mascotas <span>2</span></strong><span>Activas <span>2</span></span></div>
        <label className="filter-select">Estado<select aria-label="Filtrar mascotas"><option>Todas</option><option>Activas</option><option>Inactivas</option></select></label>
      </div>
      <div className="pets-page-grid">
        {mascotas.map((pet) => (
          <Panel className="pet-profile-card" key={pet.id}>
            <div className="pet-profile-heading"><PetAvatar pet={pet} /><div><h2>{pet.nombre}</h2><p>{pet.especie} · {pet.edad}</p><StatusBadge status="ACTIVA" /></div></div>
            <dl className="pet-attributes">
              <div><dt>Raza</dt><dd>{pet.raza}</dd></div><div><dt>Peso actual</dt><dd><Scale size={13} /> {pet.peso}</dd></div>
              <div><dt>Sexo</dt><dd>{pet.sexo}</dd></div><div><dt>Esterilización</dt><dd>{pet.esterilizacion}</dd></div>
            </dl>
            <div className="pet-card-actions"><Link to={`/cliente/mascotas/${pet.id}`}>Ver expediente</Link><Link to={`/cliente/mascotas/${pet.id}/carnet`}>Carnet digital</Link></div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { AnimalAvatar, VeterinarioPageHeader } from "../../../components/VeterinarioUI.jsx";

const recordTabs = [
  { label: "Resumen y antecedentes", path: "" },
  { label: "Historial SOAP", path: "historial" },
  { label: "Recetas", path: "recetas" },
  { label: "Carnet digital", path: "carnet" },
];

export default function ExpedienteVeterinario() {
  const { mascotaId } = useParams();
  const { appointments, getPatient } = useVeterinarioData();
  const patient = getPatient(mascotaId);
  const nextConsultation = appointments
    .filter((appointment) => appointment.mascotaId === mascotaId && !["CANCELADA", "COMPLETADA"].includes(appointment.estado))
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))[0];

  if (!patient) {
    return <div className="vet-page"><VeterinarioPageHeader title="Paciente no encontrado" description="No encontramos esta mascota en los datos de demostración." /><Link className="secondary-button" to="/veterinario/pacientes">Regresar al directorio</Link></div>;
  }

  return (
    <div className="vet-page">
      <VeterinarioPageHeader eyebrow={<Link to="/veterinario/pacientes">Pacientes (EHR)</Link>} title="Expediente clínico" description="Ficha médica con acceso a consultas, prescripciones y vacunación." />
      <section className="vet-record-header">
        <AnimalAvatar patient={patient} />
        <span><strong>{patient.nombre}</strong><small>{patient.especie} · {patient.raza} · {patient.sexo} · {patient.edad} · {patient.peso} · Responsable: {patient.propietario}</small></span>
        {nextConsultation && <Link className="primary-button" to={`/veterinario/consultas/${nextConsultation.id}`}>Abrir consulta activa</Link>}
      </section>
      <nav className="vet-record-tabs" aria-label="Secciones del expediente clínico">
        {recordTabs.map((tab) => <NavLink className={({ isActive }) => isActive ? "active" : ""} end key={tab.path || "resumen"} to={`/veterinario/pacientes/${patient.id}${tab.path ? `/${tab.path}` : ""}`}>{tab.label}</NavLink>)}
      </nav>
      <Outlet context={{ patient }} />
    </div>
  );
}

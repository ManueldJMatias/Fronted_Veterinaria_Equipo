import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { AnimalAvatar, EstadoVeterinario, VeterinarioPageHeader } from "../../../components/VeterinarioUI.jsx";

const consultationTabs = [
  { label: "Consulta SOAP", suffix: "" },
  { label: "Receta médica", suffix: "/receta" },
  { label: "Carnet de vacunación", suffix: "/carnet" },
  { label: "Servicios e insumos", suffix: "/servicios" },
];

export default function ConsultaLayout() {
  const { citaId } = useParams();
  const { getAppointment, getPatient } = useVeterinarioData();
  const appointment = getAppointment(citaId);
  const patient = appointment && getPatient(appointment.mascotaId);

  if (!appointment || !patient) {
    return <div className="vet-page"><VeterinarioPageHeader title="Consulta no encontrada" description="No existe esa cita en los datos de demostración." /><Link className="secondary-button" to="/veterinario/agenda">Regresar a la agenda</Link></div>;
  }

  return (
    <div className="vet-page">
      <VeterinarioPageHeader
        eyebrow={<Link to={`/veterinario/citas/${appointment.id}`}>{appointment.id}</Link>}
        title={`Atención clínica · ${patient.nombre}`}
        description={`${patient.especie} · ${appointment.servicio} · Responsable: ${appointment.propietario}`}
        action={<EstadoVeterinario status={appointment.estado} />}
      />
      <div className="vet-consultation-patient">
        <AnimalAvatar patient={patient} size="small" />
        <span><strong>{patient.nombre}</strong><small>{patient.especie} · {patient.raza} · {patient.edad} · {patient.peso}</small></span>
        <span className="vet-consultation-meta">{appointment.hora} · {appointment.consultorio}</span>
        <Link className="vet-link" to={`/veterinario/pacientes/${patient.id}`}>Abrir EHR →</Link>
      </div>
      {appointment.estado === "COMPLETADA" && <div className="demo-notice">Esta consulta ya se finalizó en la demostración. Consulta el EHR para revisar sus datos.</div>}
      <nav className="vet-workflow-tabs" aria-label="Secciones de la atención">
        {consultationTabs.map((tab) => <NavLink end={tab.suffix === ""} key={tab.label} to={`/veterinario/consultas/${appointment.id}${tab.suffix}`}>{tab.label}</NavLink>)}
      </nav>
      <Outlet context={{ appointment, patient, isReadOnly: appointment.estado === "COMPLETADA" }} />
    </div>
  );
}

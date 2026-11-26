import { ArrowLeft, ClipboardList, Stethoscope } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { AnimalAvatar, AlertaClinica, EstadoVeterinario, VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function DetalleCitaVeterinario() {
  const { citaId } = useParams();
  const navigate = useNavigate();
  const { getAppointment, getPatient } = useVeterinarioData();
  const appointment = getAppointment(citaId);
  const patient = appointment && getPatient(appointment.mascotaId);

  if (!appointment || !patient) {
    return <div className="vet-page"><VeterinarioPageHeader title="Cita no encontrada" description="La cita solicitada no está disponible en estos datos de demostración." /><Link className="secondary-button" to="/veterinario/agenda"><ArrowLeft size={15} /> Regresar a mi agenda</Link></div>;
  }

  const allergy = patient.alergias.find((item) => !item.toLowerCase().includes("ninguna"));
  const consultationHref = `/veterinario/consultas/${appointment.id}`;

  return (
    <div className="vet-page">
      <VeterinarioPageHeader eyebrow={<Link to="/veterinario/agenda">Mi agenda</Link>} title="Detalle de la cita" description={`${appointment.id} · ${appointment.fecha} · ${appointment.hora}`} action={<EstadoVeterinario status={appointment.estado} />} />
      <div className="vet-appointment-card">
        <div className="vet-main-column">
          <VeterinarioPanel title="Paciente y reserva">
            <div className="vet-record-header">
              <AnimalAvatar patient={patient} />
              <span><strong>{patient.nombre}</strong><small>{patient.especie} · {patient.raza} · {patient.sexo} · {patient.edad} · {patient.peso}</small></span>
              <Link className="secondary-button" to={`/veterinario/pacientes/${patient.id}`}><ClipboardList size={14} /> Ver expediente</Link>
            </div>
            <div className="vet-appointment-info-grid">
              <Info label="Propietario" value={appointment.propietario} />
              <Info label="Teléfono de contacto" value={patient.telefono} />
              <Info label="Servicio" value={appointment.servicio} />
              <Info label="Horario y duración" value={`${appointment.hora} · ${appointment.duracionMinutos} min`} />
              <Info label="Consultorio" value={appointment.consultorio} />
              <Info label="Fecha" value={appointment.fecha} />
            </div>
            <h2 className="vet-section-heading">Notas del cliente</h2>
            <p className="vet-note-box">{appointment.notas || "No se agregaron notas a esta reserva."}</p>
          </VeterinarioPanel>
          {allergy && <AlertaClinica>Alerta del expediente: {allergy}</AlertaClinica>}
        </div>
        <div className="vet-aside-column">
          <VeterinarioPanel title="Acciones clínicas">
            <p className="muted-copy">Los cambios de llegada y estado operativo corresponden a recepción.</p>
            <Link className="primary-button full-button" to={consultationHref}><Stethoscope size={15} /> {appointment.estado === "EN_ATENCION" ? "Continuar consulta SOAP" : "Abrir consulta SOAP"}</Link>
            <Link className="secondary-button full-button" to={`/veterinario/pacientes/${patient.id}`}>Consultar expediente completo</Link>
            <Link className="secondary-button full-button" to="/veterinario/agenda"><ArrowLeft size={14} /> Regresar a la agenda</Link>
          </VeterinarioPanel>
          <VeterinarioPanel title="Estado operativo"><div className="vet-state-detail"><EstadoVeterinario status={appointment.estado} /><span>Asignada a Dra. Beatriz Jiménez</span></div></VeterinarioPanel>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return <div className="vet-data-point"><small>{label}</small><strong>{value}</strong></div>;
}

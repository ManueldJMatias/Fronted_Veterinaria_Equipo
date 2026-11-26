import { useMemo } from "react";
import { Activity, CalendarDays, Check, Clock3, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateLabel, dateOffset } from "../../../data/veterinarioDemoData.js";
import { AnimalAvatar, EstadoVeterinario, VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

const activeStatuses = new Set(["EN_SALA_ESPERA", "EN_ATENCION"]);

export default function InicioVeterinario() {
  const { appointments, blocks, getPatient } = useVeterinarioData();
  const today = dateOffset();
  const todayAppointments = useMemo(() => appointments.filter((appointment) => appointment.fecha === today), [appointments, today]);
  const waiting = todayAppointments.filter((appointment) => activeStatuses.has(appointment.estado));
  const waitingRoom = waiting.filter((appointment) => appointment.estado === "EN_SALA_ESPERA").length;
  const inConsultation = waiting.filter((appointment) => appointment.estado === "EN_ATENCION").length;
  const completed = todayAppointments.filter((appointment) => appointment.estado === "COMPLETADA").length;
  const nextAppointments = appointments.filter((appointment) => appointment.fecha >= today && !["COMPLETADA", "CANCELADA"].includes(appointment.estado)).slice(0, 4);
  const nextBlock = blocks.filter((block) => block.fechaInicio >= today).sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio))[0];

  return (
    <div className="vet-page">
      <VeterinarioPageHeader
        title="Mi jornada"
        description={`Resumen operativo de hoy · ${dateLabel(today, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
        action={<Link className="primary-button" to="/veterinario/agenda"><CalendarDays size={15} /> Ver mi agenda</Link>}
      />

      <section className="vet-stat-grid" aria-label="Resumen de la jornada">
        <Stat icon={<CalendarDays size={16} />} label="Citas de hoy" value={todayAppointments.length} detail="en tu agenda" tone="mint" />
        <Stat icon={<Clock3 size={16} />} label="En sala de espera" value={waitingRoom} detail="pacientes listos" tone="amber" />
        <Stat icon={<Stethoscope size={16} />} label="En consulta" value={inConsultation} detail="atención en curso" tone="lilac" />
        <Stat icon={<Check size={16} />} label="Completadas" value={completed} detail={`${todayAppointments.length ? Math.round((completed / todayAppointments.length) * 100) : 0}% de la jornada`} tone="mint" />
      </section>

      <div className="vet-page-grid">
        <VeterinarioPanel
          title="Pacientes listos para atención"
          action={<span className="vet-status-badge COMPLETADA">{waiting.length} pacientes</span>}
        >
          <p className="muted-copy">Recepción actualiza las llegadas y los estados de las citas.</p>
          {waiting.length ? waiting.map((appointment) => {
            const patient = getPatient(appointment.mascotaId);
            return (
              <article className="vet-queue-row" key={appointment.id}>
                <Link className="vet-patient-summary" to={`/veterinario/pacientes/${patient.id}`}>
                  <AnimalAvatar patient={patient} size="small" />
                  <span><strong>{patient.nombre}</strong><small>{patient.especie} · {patient.raza} · {patient.edad}</small></span>
                </Link>
                <Link className="vet-appointment-link" to={`/veterinario/citas/${appointment.id}`}><strong>{appointment.hora}</strong><small>{appointment.servicio}</small></Link>
                <span className="vet-cell-muted">{appointment.propietario}</span>
                <EstadoVeterinario status={appointment.estado} />
                <Link className={`vet-queue-action ${appointment.estado === "EN_SALA_ESPERA" ? "primary" : ""}`} to={`/veterinario/consultas/${appointment.id}`}>
                  {appointment.estado === "EN_ATENCION" ? "Continuar consulta" : "Iniciar atención"}
                </Link>
              </article>
            );
          }) : <p className="empty-state">No hay pacientes listos para atención en este momento.</p>}
          <div className="vet-clinical-alert info"><Activity size={15} /><span>El registro de llegada y los cambios de estado son responsabilidad de recepción. Aquí abres la atención clínica.</span></div>
        </VeterinarioPanel>

        <div className="vet-aside-column">
          <VeterinarioPanel title="Próximas citas" action={<Link className="vet-link" to="/veterinario/agenda">Ver agenda →</Link>}>
            {nextAppointments.map((appointment) => {
              const patient = getPatient(appointment.mascotaId);
              return (
                <Link className="vet-upcoming-row" key={appointment.id} to={`/veterinario/citas/${appointment.id}`}>
                  <span className="vet-time-card">{appointment.hora}<small>{appointment.fecha === today ? "HOY" : dateLabel(appointment.fecha, { day: "numeric", month: "short" }).toUpperCase()}</small></span>
                  <span><strong>{patient?.nombre} · {appointment.servicio}</strong><small>{appointment.propietario} · {appointment.consultorio}</small></span>
                  <EstadoVeterinario status={appointment.estado} />
                </Link>
              );
            })}
            {!nextAppointments.length && <p className="empty-state">No hay citas próximas.</p>}
          </VeterinarioPanel>

          <VeterinarioPanel title="Bloqueos próximos" action={<Link className="vet-link" to="/veterinario/disponibilidad">Administrar →</Link>}>
            {nextBlock ? (
              <Link className="vet-block-row" to="/veterinario/disponibilidad">
                <span className="vet-block-icon"><Clock3 size={16} /></span>
                <span><strong>{formatBlockReason(nextBlock.motivo)}</strong><small>{dateLabel(nextBlock.fechaInicio)} · {nextBlock.horaInicio}–{nextBlock.horaFin}</small></span>
              </Link>
            ) : <p className="muted-copy">No tienes bloqueos próximos.</p>}
          </VeterinarioPanel>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, detail, tone }) {
  return (
    <article className="vet-stat-card">
      <div className="vet-stat-top"><span className={`vet-stat-icon ${tone}`}>{icon}</span><span>{label}</span></div>
      <div className="vet-stat-value"><strong>{value}</strong><span>{detail}</span></div>
    </article>
  );
}

function formatBlockReason(reason) {
  return { CIRUGIA: "Cirugía programada", PERSONAL: "Asunto personal", DIA_LIBRE: "Día libre" }[reason] ?? reason;
}

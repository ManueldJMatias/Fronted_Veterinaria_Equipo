import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateLabel, dateOffset } from "../../../data/veterinarioDemoData.js";
import { VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

const hours = Array.from({ length: 10 }, (_, index) => 8 + index);
const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfWeek(date) {
  const monday = new Date(date);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

function dateAfter(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export default function MiAgenda() {
  const [view, setView] = useState("SEMANA");
  const [selectedDate, setSelectedDate] = useState(() => new Date(`${dateOffset()}T12:00:00`));
  const [statusFilter, setStatusFilter] = useState("TODAS");
  const { appointments, blocks, getPatient } = useVeterinarioData();
  const dates = useMemo(() => view === "DIA"
    ? [selectedDate]
    : Array.from({ length: 7 }, (_, index) => dateAfter(startOfWeek(selectedDate), index)), [view, selectedDate]);
  const dateKeys = dates.map(localDateKey);
  const visibleAppointments = appointments.filter((appointment) => dateKeys.includes(appointment.fecha) && (statusFilter === "TODAS" || appointment.estado === statusFilter));
  const weekLabel = view === "DIA"
    ? dateLabel(dateKeys[0], { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : `${dateLabel(dateKeys[0], { day: "numeric", month: "short" })} – ${dateLabel(dateKeys[dateKeys.length - 1], { day: "numeric", month: "short", year: "numeric" })}`;

  function changePeriod(direction) {
    setSelectedDate((current) => dateAfter(current, direction * (view === "DIA" ? 1 : 7)));
  }

  return (
    <div className="vet-page">
      <VeterinarioPageHeader title="Mi agenda clínica" description="Consulta tus citas asignadas, su estado y el consultorio de cada paciente." />
      <div className="vet-filter-row">
        <label className="vet-filter-field">Filtrar por estado
          <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
            <option value="TODAS">Todos los estados</option>
            {["PENDIENTE", "CONFIRMADA", "EN_SALA_ESPERA", "EN_ATENCION", "COMPLETADA", "CANCELADA"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
          </select>
        </label>
        <div className="vet-day-controls">
          <button className="secondary-button vet-icon-button" aria-label="Periodo anterior" onClick={() => changePeriod(-1)} type="button"><ChevronLeft size={15} /></button>
          <strong>{weekLabel}</strong>
          <button className="secondary-button vet-icon-button" aria-label="Periodo siguiente" onClick={() => changePeriod(1)} type="button"><ChevronRight size={15} /></button>
          <button className="secondary-button" onClick={() => setSelectedDate(new Date(`${dateOffset()}T12:00:00`))} type="button">Hoy</button>
        </div>
        <div className="vet-choice-row" role="group" aria-label="Vista de agenda">
          {["DIA", "SEMANA"].map((option) => <button className={`vet-choice-chip ${view === option ? "active" : ""}`} key={option} onClick={() => setView(option)} type="button">{option === "DIA" ? "Día" : "Semana"}</button>)}
        </div>
        <Link className="primary-button" to="/veterinario/disponibilidad/bloqueos/nuevo"><Plus size={14} /> Agregar bloqueo</Link>
      </div>

      <VeterinarioPanel className="vet-calendar-panel">
        <div className="vet-calendar-scroll">
          <div className={`vet-calendar-grid ${view === "DIA" ? "day-view" : ""}`} style={{ "--vet-day-count": dates.length }}>
            <div className="vet-calendar-day" aria-hidden="true" />
            {dates.map((date, index) => {
              const dateKey = dateKeys[index];
              return <div className={`vet-calendar-day ${dateKey === dateOffset() ? "today" : ""}`} key={dateKey}>{weekdays[(date.getDay() + 6) % 7]} · {date.getDate()}</div>;
            })}
            {hours.flatMap((hour) => [
              <div className="vet-calendar-hour" key={`hour-${hour}`}>{String(hour).padStart(2, "0")}:00</div>,
              ...dates.map((date, dayIndex) => {
                const dateKey = dateKeys[dayIndex];
                const appointmentsInCell = visibleAppointments.filter((appointment) => appointment.fecha === dateKey && Number(appointment.hora.slice(0, 2)) === hour);
                const blocksInCell = blocks.filter((block) => block.fechaInicio <= dateKey && block.fechaFin >= dateKey && Number(block.horaInicio.slice(0, 2)) <= hour && Number(block.horaFin.slice(0, 2)) > hour);
                return (
                  <div className="vet-calendar-cell" key={`${dateKey}-${hour}`}>
                    {appointmentsInCell.map((appointment) => {
                      const patient = getPatient(appointment.mascotaId);
                      return <Link className={`vet-calendar-event ${appointment.estado}`} key={appointment.id} to={`/veterinario/citas/${appointment.id}`}><strong>{patient?.nombre} · {appointment.servicio}</strong><small>{appointment.hora} · {appointment.consultorio}</small></Link>;
                    })}
                    {blocksInCell.map((block) => <Link className="vet-calendar-event CANCELADA" key={block.id} to="/veterinario/disponibilidad">{block.motivo === "CIRUGIA" ? "Bloqueo · Cirugía" : "Bloqueo personal"}<small>{block.horaInicio}–{block.horaFin}</small></Link>)}
                  </div>
                );
              }),
            ])}
          </div>
        </div>
        <div className="vet-choice-row vet-agenda-legend">{["EN_SALA_ESPERA", "EN_ATENCION", "COMPLETADA", "CANCELADA"].map((status) => <span className={`vet-status-badge ${status}`} key={status}>{status.replaceAll("_", " ")}</span>)}</div>
      </VeterinarioPanel>
    </div>
  );
}

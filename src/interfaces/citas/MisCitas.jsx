import { useMemo, useState } from "react";
import { CalendarDays, List, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { citas } from "../../data/demoData.js";
import { PageHeader, StatusBadge } from "../../components/InterfazUI.jsx";
import "./citas.css";

export default function MisCitas() {
  const [filter, setFilter] = useState("TODAS");
  const [view, setView] = useState("lista");
  const filtered = useMemo(
    () => citas.filter((appointment) => filter === "TODAS" || appointment.estado === filter),
    [filter],
  );

  return (
    <div className="interface-page">
      <PageHeader
        title="Mis citas"
        description="Consulta tus próximas visitas e historial clínico."
        action={<Link className="primary-button" to="/cliente/citas/nueva"><Plus size={16} /> Nueva cita</Link>}
      />
      <div className="filter-toolbar">
        <label className="filter-select">Mascota<select aria-label="Filtrar por mascota"><option>Todas las mascotas</option><option>Luna</option><option>Toby</option></select></label>
        <label className="filter-select">Estado<select aria-label="Filtrar por estado" onChange={(event) => setFilter(event.target.value)} value={filter}>
          <option value="TODAS">Todos los estados</option><option>PENDIENTE</option><option>EN_SALA_ESPERA</option><option>EN_ATENCION</option><option>COMPLETADA</option><option>CANCELADA</option><option>CONFIRMADA</option>
        </select></label>
        <div className="segmented-control" aria-label="Tipo de vista">
          <button className={view === "lista" ? "selected" : ""} type="button" onClick={() => setView("lista")}><List size={15} /> Lista</button>
          <button className={view === "calendario" ? "selected" : ""} type="button" onClick={() => setView("calendario")}><CalendarDays size={15} /> Calendario</button>
        </div>
      </div>
      {view === "lista" ? (
        <div className="appointment-list">
          {filtered.map((appointment) => (
            <article className="appointment-list-card" key={appointment.id}>
              <div className="appointment-date-block">
                <span>{new Date(`${appointment.fecha}T12:00:00`).toLocaleDateString("es-MX", { month: "short" }).replace(".", "").toUpperCase()}</span>
                <strong>{new Date(`${appointment.fecha}T12:00:00`).getDate()}</strong>
                <small>{appointment.hora}</small>
              </div>
              <div className="appointment-summary">
                <h2>{appointment.servicio}</h2>
                <p>{appointment.mascota} · {appointment.veterinario}</p>
                <p>{appointment.consultorio} · {appointment.costo} estimado</p>
              </div>
              <div className="appointment-list-actions">
                <StatusBadge status={appointment.estado} />
                <Link className="text-link" to={`/cliente/citas/${appointment.id}`}>Ver detalle <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <div className="empty-state">No hay citas con este estado.</div>}
        </div>
      ) : (
        <section className="calendar-panel">
          <div className="calendar-heading"><button type="button" aria-label="Mes anterior">‹</button><strong>Junio 2026</strong><button type="button" aria-label="Mes siguiente">›</button></div>
          <div className="calendar-grid calendar-weekdays">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">{Array.from({ length: 35 }, (_, i) => {
            const day = i - 0;
            const appointment = citas.find((item) => new Date(`${item.fecha}T12:00:00`).getDate() === day);
            return <div className={`calendar-cell ${day < 1 || day > 30 ? "muted-day" : ""}`} key={i}><span>{day <= 0 ? 31 + day : day > 30 ? day - 30 : day}</span>{appointment && <Link to={`/cliente/citas/${appointment.id}`}>{appointment.mascota} · {appointment.hora}</Link>}</div>;
          })}</div>
        </section>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { Bell, CalendarDays, CreditCard, Syringe } from "lucide-react";
import { Link } from "react-router-dom";
import { notificaciones } from "../../data/demoData.js";
import { PageHeader, Panel } from "../../components/InterfazUI.jsx";
import "./notificaciones.css";

const iconByType = {
  CONFIRMACION_CITA: CalendarDays,
  RECORDATORIO_24H: Bell,
  ALERTA_VACUNA: Syringe,
  RECIBO_PAGO: CreditCard,
};

export default function CentroNotificaciones() {
  const [filter, setFilter] = useState("TODAS");
  const filtered = useMemo(() => notificaciones.filter((item) => filter === "TODAS" || item.tipo === filter), [filter]);

  return (
    <div className="interface-page">
      <PageHeader title="Centro de notificaciones" description="Avisos relacionados con tus citas, mascotas y pagos." />
      <div className="notification-filters">
        {[["TODAS", "Todas"], ["CONFIRMACION_CITA", "Citas"], ["ALERTA_VACUNA", "Vacunas"], ["RECIBO_PAGO", "Pagos"]].map(([value, label]) => <button className={filter === value ? "notification-filter-active" : ""} key={value} onClick={() => setFilter(value)} type="button">{label}</button>)}
      </div>
      <Panel className="notification-list-panel">
        {filtered.map((item) => {
          const Icon = iconByType[item.tipo] ?? Bell;
          return (
            <article className="notification-row" key={item.id}>
              <span className={`notification-icon notification-${item.tipo.toLowerCase()}`}><Icon size={17} /></span>
              <div><h2>{item.titulo}</h2><p>{item.mensaje}</p><small>{item.fecha}</small></div>
              <Link to={item.destino}>Abrir <span aria-hidden="true">→</span></Link>
            </article>
          );
        })}
        {filtered.length === 0 && <p className="empty-state">No hay notificaciones en esta categoría.</p>}
      </Panel>
    </div>
  );
}

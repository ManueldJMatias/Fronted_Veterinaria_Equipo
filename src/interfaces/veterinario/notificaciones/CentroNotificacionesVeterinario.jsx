import { useMemo, useState } from "react";
import { Bell, CheckCheck, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

const categories = [
  { value: "TODAS", label: "Todas" },
  { value: "NUEVA_CITA", label: "Citas" },
  { value: "PACIENTE_EN_SALA", label: "Pacientes en sala" },
  { value: "CANCELACION", label: "Cancelaciones" },
  { value: "REPROGRAMACION", label: "Cambios" },
  { value: "BLOQUEO", label: "Disponibilidad" },
];

export default function CentroNotificacionesVeterinario() {
  const { notifications, markNotificationRead, markNotificationsRead } = useVeterinarioData();
  const [category, setCategory] = useState("TODAS");
  const filteredNotifications = useMemo(() => notifications.filter((item) => category === "TODAS" || item.tipo === category), [notifications, category]);
  const unreadCount = notifications.filter((item) => !item.leida).length;

  return (
    <div className="vet-page">
      <VeterinarioPageHeader title="Notificaciones" description="Avisos de citas, pacientes y cambios en tu agenda." action={<button className="secondary-button" disabled={!unreadCount} onClick={markNotificationsRead} type="button"><CheckCheck size={15} /> Marcar todas como leídas</button>} />
      <VeterinarioPanel title={`${unreadCount} sin leer`} action={<span className="vet-cell-muted">{notifications.length} notificaciones</span>}>
        <div className="vet-filter-row vet-notification-filters">
          <label className="vet-filter-field">Filtrar por tipo<select onChange={(event) => setCategory(event.target.value)} value={category}>{categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
        <div className="vet-notification-list">
          {filteredNotifications.map((notification) => (
            <article className={`vet-notification-card ${notification.leida ? "read" : "unread"}`} key={notification.id}>
              <span className="vet-notification-icon"><Bell size={16} /></span>
              <span className="vet-notification-copy"><strong>{notification.titulo}</strong><span>{notification.mensaje}</span><small><Clock3 size={12} /> {notification.fecha}</small></span>
              <div className="vet-notification-actions">
                {!notification.leida && <button className="vet-link-button" onClick={() => markNotificationRead(notification.id)} type="button">Marcar leída</button>}
                {notification.citaId && <Link className="vet-link" onClick={() => markNotificationRead(notification.id)} to={`/veterinario/citas/${notification.citaId}`}>Ver cita →</Link>}
              </div>
            </article>
          ))}
          {!filteredNotifications.length && <p className="empty-state">No hay notificaciones de este tipo.</p>}
        </div>
      </VeterinarioPanel>
    </div>
  );
}

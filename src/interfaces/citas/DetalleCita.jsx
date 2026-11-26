import { useParams, Link } from "react-router-dom";
import { CalendarDays, Clock3, FileText, MapPin, ReceiptText, Stethoscope } from "lucide-react";
import { citas } from "../../data/demoData.js";
import { PageHeader, Panel, StatusBadge } from "../../components/InterfazUI.jsx";
import "./citas.css";

export default function DetalleCita() {
  const { id } = useParams();
  const appointment = citas.find((item) => item.id === id) ?? citas[0];
  const completed = appointment.estado === "COMPLETADA";

  return (
    <div className="interface-page">
      <PageHeader title="Detalle de cita" description={`Folio ${appointment.id}`} action={<StatusBadge status={appointment.estado} />} />
      <div className="detail-layout">
        <Panel title={appointment.servicio} className="appointment-detail-panel">
          <p className="detail-lead"><CalendarDays size={17} /> {new Date(`${appointment.fecha}T12:00:00`).toLocaleDateString("es-MX", { dateStyle: "long" })} · <Clock3 size={16} /> {appointment.hora}</p>
          <dl className="detail-grid">
            <div><dt>Mascota</dt><dd>{appointment.mascota}</dd></div>
            <div><dt>Servicio</dt><dd>{appointment.servicio}</dd></div>
            <div><dt>Veterinario</dt><dd><Stethoscope size={14} /> {appointment.veterinario}</dd></div>
            <div><dt>Consultorio</dt><dd><MapPin size={14} /> {appointment.consultorio} · Veterinaria</dd></div>
            <div><dt>Costo estimado</dt><dd>{appointment.costo} MXN</dd></div>
            <div><dt>Notas</dt><dd>{appointment.notas}</dd></div>
          </dl>
          <div className="appointment-timeline"><strong>Seguimiento</strong><div><span className="timeline-dot" /><span>Solicitud creada</span><span className="timeline-line" /><span className="timeline-dot timeline-current" /><span>{appointment.estado.replaceAll("_", " ")}</span></div></div>
        </Panel>
        <div className="detail-aside">
          <Panel title="Documentos de la cita">
            {completed ? (
              <div className="document-actions">
                <Link to={`/cliente/mascotas/${appointment.mascotaId}/recetas`}><FileText size={17} /><span><strong>Receta médica</strong><small>Ver indicaciones</small></span><span>→</span></Link>
                <Link to="/cliente/pagos/ORD-240602"><ReceiptText size={17} /><span><strong>Recibo de pago</strong><small>Ver recibo</small></span><span>→</span></Link>
              </div>
            ) : <p className="muted-copy">La receta y el recibo estarán disponibles al completar la consulta.</p>}
          </Panel>
          <Panel title="Acciones">
            {completed ? <Link className="secondary-button full-button" to={`/cliente/mascotas/${appointment.mascotaId}`}>Abrir expediente</Link> : <button className="secondary-button full-button" type="button">Solicitar cancelación</button>}
            <p className="field-hint">Para cambios urgentes, comunícate directamente con la clínica.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

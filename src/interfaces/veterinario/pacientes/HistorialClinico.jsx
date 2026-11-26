import { useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateLabel } from "../../../data/veterinarioDemoData.js";
import { VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function HistorialClinico() {
  const { patient } = useOutletContext();
  const { appointments, consultations } = useVeterinarioData();
  const entries = appointments.filter((appointment) => appointment.mascotaId === patient.id && appointment.estado === "COMPLETADA").sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div className="vet-ehr-history">
      <VeterinarioPanel title="Historial de consultas SOAP" action={<span className="vet-cell-muted">{entries.length} registros</span>}>
        {entries.length ? <div className="vet-timeline">
          {entries.map((appointment) => {
            const consultation = consultations[appointment.id];
            return <article className="vet-timeline-row" key={appointment.id}>
              <time>{dateLabel(appointment.fecha).toUpperCase()}</time>
              <span><strong>{appointment.servicio} · {consultation?.peso ?? patient.peso}</strong><small><b>Motivo:</b> {consultation?.motivo ?? appointment.notas}</small><small><b>Subjetivo:</b> {consultation?.subjetivo ?? "Registro histórico de demostración."}</small><small><b>Objetivo:</b> {consultation?.objetivo ?? "Exploración registrada en el expediente."}</small><small><b>Diagnóstico:</b> {consultation?.diagnostico ?? "Valoración documentada por la veterinaria."}</small><small><b>Plan:</b> {consultation?.plan ?? "Continuidad de cuidados según indicaciones."}</small></span>
              <span className="vet-status-badge COMPLETADA">COMPLETADA</span>
            </article>;
          })}
        </div> : <p className="empty-state">Las consultas finalizadas aparecerán aquí.</p>}
      </VeterinarioPanel>
    </div>
  );
}

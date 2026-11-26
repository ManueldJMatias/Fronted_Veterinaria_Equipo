import { Activity, ClipboardList, Clock3, HeartPulse } from "lucide-react";
import { projectedHospitalPatients } from "../../../data/veterinarioDemoData.js";
import { AlertaClinica, VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function HospitalizacionVeterinario() {
  return (
    <div className="vet-page">
      <VeterinarioPageHeader title="Hospitalización" description="Vista proyectada para el seguimiento de pacientes internados." action={<span className="vet-status-badge">FASE 2</span>} />
      <div className="vet-projected-banner"><Clock3 size={18} /><span><strong>Módulo proyectado · Fase 2</strong><small>Los registros mostrados son datos de ejemplo. Aún no están conectados a hospitalización real.</small></span></div>
      <div className="vet-stat-grid">
        <Stat icon={HeartPulse} label="Pacientes internados" value={projectedHospitalPatients.length} />
        <Stat icon={Activity} label="Revisiones pendientes" value="3" tone="amber" />
        <Stat icon={ClipboardList} label="Indicaciones activas" value="8" tone="lilac" />
        <Stat icon={Clock3} label="Próxima revisión" value="10:30" tone="mint" />
      </div>
      <VeterinarioPanel title="Pacientes hospitalizados" action={<span className="vet-cell-muted">Datos ilustrativos</span>}>
        <div className="vet-table-wrap"><table><thead><tr><th>Paciente</th><th>Ingreso</th><th>Próxima revisión</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
          {projectedHospitalPatients.map((patient) => <tr key={patient.mascota}><td><strong>{patient.mascota}</strong><small className="vet-table-subtitle">{patient.especie} · {patient.edad}</small></td><td>{patient.ingreso}</td><td>{patient.revision}</td><td><span className={`vet-status-badge ${patient.estado === "ESTABLE" ? "COMPLETADA" : ""}`}>{patient.estado}</span></td><td><button className="vet-link-button" onClick={() => window.alert("El expediente de hospitalización estará disponible en la Fase 2.")} type="button">Ver seguimiento</button></td></tr>)}
        </tbody></table></div>
        <AlertaClinica tone="info">La interfaz no permite capturar signos vitales, tratamientos ni altas hasta que exista el módulo de hospitalización y sus servicios.</AlertaClinica>
      </VeterinarioPanel>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = "" }) {
  return <article className="vet-stat-card"><div className="vet-stat-top"><span className={`vet-stat-icon ${tone}`}><Icon size={16} /></span>{label}</div><div className="vet-stat-value"><strong>{value}</strong></div></article>;
}

import { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateLabel } from "../../../data/veterinarioDemoData.js";
import { VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function CarnetClinico() {
  const { patient } = useOutletContext();
  const { appointments, vaccines } = useVeterinarioData();
  const patientVaccines = useMemo(() => vaccines.filter((vaccine) => vaccine.mascotaId === patient.id), [vaccines, patient.id]);
  const nextDose = patientVaccines.filter((vaccine) => vaccine.estado === "PRÓXIMA").sort((a, b) => a.proxima.localeCompare(b.proxima))[0];
  const consultation = appointments
    .filter((appointment) => appointment.mascotaId === patient.id && !["CANCELADA", "COMPLETADA"].includes(appointment.estado))
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))[0];

  return (
    <div className="vet-ehr-carnet">
      {nextDose && <div className="vet-vaccine-banner"><span><strong>Próxima dosis recomendada</strong><b>{nextDose.nombre} · {dateLabel(nextDose.proxima)}</b></span><span className="vet-status-badge">PRÓXIMA</span></div>}
      <VeterinarioPanel title="Registro de vacunas y desparasitaciones" action={consultation && <Link className="primary-button" to={`/veterinario/consultas/${consultation.id}/carnet`}>＋ Registrar aplicación</Link>}>
        {patientVaccines.length ? <div className="vet-table-wrap"><table><thead><tr><th>Biológico</th><th>Lote</th><th>Fecha de aplicación</th><th>Próxima dosis</th><th>Estado</th></tr></thead><tbody>
          {patientVaccines.map((vaccine) => <tr key={vaccine.id}><td>{vaccine.nombre}</td><td>{vaccine.lote}</td><td>{dateLabel(vaccine.aplicada)}</td><td>{dateLabel(vaccine.proxima)}</td><td><span className={`vet-status-badge ${vaccine.estado === "AL DÍA" ? "COMPLETADA" : ""}`}>{vaccine.estado}</span></td></tr>)}
        </tbody></table></div> : <p className="empty-state">No hay vacunas o desparasitaciones registradas.</p>}
        <p className="muted-copy">El registro conserva biológico, lote, producto y próxima dosis para el seguimiento.</p>
      </VeterinarioPanel>
    </div>
  );
}

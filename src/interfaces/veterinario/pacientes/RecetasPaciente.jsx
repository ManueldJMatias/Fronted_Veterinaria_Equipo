import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateLabel } from "../../../data/veterinarioDemoData.js";
import { VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function RecetasPaciente() {
  const { patient } = useOutletContext();
  const { appointments, consultations } = useVeterinarioData();
  const [notice, setNotice] = useState("");
  const recipes = appointments
    .filter((appointment) => appointment.mascotaId === patient.id && appointment.estado === "COMPLETADA" && consultations[appointment.id]?.receta)
    .map((appointment) => ({ appointment, prescription: consultations[appointment.id].receta }));

  return (
    <VeterinarioPanel title="Recetas médicas" action={<span className="vet-cell-muted">{recipes.length} recetas en el expediente</span>}>
      {recipes.length ? recipes.map(({ appointment, prescription }) => (
        <article className="vet-prescription-card" key={appointment.id}>
          <span className="vet-prescription-icon"><FileText size={18} /></span>
          <span><strong>{prescription.medicamento}</strong><small>{dateLabel(appointment.fecha)} · {appointment.servicio}</small><small>{prescription.dosis} · {prescription.duracion} · vía {prescription.via}</small><small>{prescription.indicaciones}</small></span>
          <button className="secondary-button" onClick={() => setNotice("El PDF se podrá descargar al conectar el servicio de documentos.")} type="button"><Download size={14} /> Descargar PDF</button>
        </article>
      )) : <p className="empty-state">No hay recetas registradas para este paciente.</p>}
      {notice && <p className="demo-notice" role="status">{notice}</p>}
      <p className="muted-copy">Las recetas mostradas son datos de demostración. Los PDF requieren integrar el servicio de documentos.</p>
    </VeterinarioPanel>
  );
}

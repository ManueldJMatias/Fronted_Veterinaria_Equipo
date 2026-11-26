import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateLabel } from "../../../data/veterinarioDemoData.js";
import { AlertaClinica, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function ResumenClinico() {
  const { patient } = useOutletContext();
  const { appointments, consultations, setPatients } = useVeterinarioData();
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");
  const recordItems = [
    ...patient.alergias.filter(isRecordedHistory).map((descripcion) => ({ tipo: "ALERGIA", descripcion })),
    ...patient.enfermedades.filter(isRecordedHistory).map((descripcion) => ({ tipo: "ENFERMEDAD_CRONICA", descripcion })),
    ...patient.cirugias.map((descripcion) => ({ tipo: "CIRUGIA_PREVIA", descripcion })),
  ];
  const lastAppointment = appointments
    .filter((appointment) => appointment.mascotaId === patient.id && appointment.estado === "COMPLETADA")
    .sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  const lastConsultation = lastAppointment ? consultations[lastAppointment.id] : null;

  function addAntecedent(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const type = formData.get("tipo");
    const description = String(formData.get("descripcion")).trim();
    if (!description) return;
    setPatients((items) => items.map((item) => {
      if (item.id !== patient.id) return item;
      if (type === "ALERGIA") return { ...item, alergias: [...item.alergias.filter(isRecordedHistory), description] };
      if (type === "ENFERMEDAD_CRONICA") return { ...item, enfermedades: [...item.enfermedades.filter(isRecordedHistory), description] };
      return { ...item, cirugias: [...item.cirugias, description] };
    }));
    setAdding(false);
    setNotice("Antecedente agregado a los datos de demostración. No se guardó en un servidor.");
  }

  return (
    <div className="vet-ehr-summary">
      <div className="vet-main-column">
        <VeterinarioPanel title="Datos del paciente">
          <div className="vet-record-facts">
            {[["Especie", patient.especie], ["Raza", patient.raza], ["Sexo", patient.sexo], ["Edad", patient.edad], ["Peso actual", patient.peso], ["Responsable", patient.propietario], ["Teléfono", patient.telefono], ["Correo", patient.correo]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
          <div className="vet-emergency-card"><strong>Contactos de emergencia</strong><span>{patient.propietario} · {patient.telefono}</span><small>Responsable principal registrado.</small></div>
        </VeterinarioPanel>
        <VeterinarioPanel title="Antecedentes clínicos" action={<button className="secondary-button" onClick={() => setAdding((current) => !current)} type="button"><Plus size={14} /> Agregar antecedente</button>}>
          <div className="vet-antecedent-list">
            {recordItems.map((item, index) => <div className="vet-antecedent-row" key={`${item.tipo}-${index}`}><span>{antecedentLabel(item.tipo)}</span><strong>{item.descripcion}</strong></div>)}
            {recordItems.length === 0 && <p className="muted-copy">No hay antecedentes clínicos capturados.</p>}
          </div>
          {adding && <form className="vet-antecedent-form" onSubmit={addAntecedent}>
            <label className="vet-form-field">Tipo<select name="tipo"><option value="ALERGIA">Alergia</option><option value="ENFERMEDAD_CRONICA">Enfermedad crónica</option><option value="CIRUGIA_PREVIA">Cirugía previa</option></select></label>
            <label className="vet-form-field">Descripción<input name="descripcion" placeholder="Describe el antecedente" required /></label>
            <button className="primary-button" type="submit"><Save size={14} /> Guardar antecedente</button>
          </form>}
          {notice && <p className="demo-notice" role="status">{notice}</p>}
        </VeterinarioPanel>
      </div>
      <div className="vet-aside-column">
        {patient.alergias.filter(isRecordedHistory).map((allergy) => <AlertaClinica key={allergy}>Alergia importante: {allergy}</AlertaClinica>)}
        <VeterinarioPanel title="Última consulta SOAP" action={lastAppointment && <Link className="vet-link" to={`/veterinario/consultas/${lastAppointment.id}`}>Abrir consulta →</Link>}>
          {lastAppointment ? <>
            <div className="vet-ehr-date-pill">{dateLabel(lastAppointment.fecha)} · {lastAppointment.servicio}</div>
            <div className="vet-soap-preview"><small>Motivo</small><strong>{lastConsultation?.motivo ?? lastAppointment.notas}</strong><small>Diagnóstico</small><strong>{lastConsultation?.diagnostico ?? "Valoración pendiente en la consulta."}</strong><small>Plan</small><strong>{lastConsultation?.plan ?? "Revisar el registro SOAP."}</strong></div>
          </> : <p className="muted-copy">Sin consultas registradas.</p>}
        </VeterinarioPanel>
        <VeterinarioPanel title="Evolución del peso">
          <WeightChart values={patient.historialPeso} />
          <div className="vet-weight-current"><span>Último registro</span><strong>{patient.peso}</strong></div>
        </VeterinarioPanel>
      </div>
    </div>
  );
}

function isRecordedHistory(value) {
  const normalized = value.trim().toLocaleLowerCase("es-MX");
  return normalized.length > 0 && !normalized.includes("ninguna") && !normalized.startsWith("sin ");
}

function antecedentLabel(type) {
  return { ALERGIA: "ALERGIA", ENFERMEDAD_CRONICA: "ENFERMEDAD CRÓNICA", CIRUGIA_PREVIA: "CIRUGÍA PREVIA" }[type] ?? type;
}

function WeightChart({ values }) {
  const min = Math.min(...values) - 0.2;
  const max = Math.max(...values) + 0.2;
  const points = values.map((value, index) => `${20 + index * 75},${160 - ((value - min) / (max - min || 1)) * 120}`).join(" ");
  return <div className="vet-weight-chart"><svg viewBox="0 0 340 190" role="img" aria-label={`Curva de peso con ${values.length} registros`}>
    {[35, 75, 115, 155].map((y) => <line key={y} x1="10" x2="330" y1={y} y2={y} stroke="#edf1f2" />)}
    <polyline points={points} />
    {values.map((value, index) => <circle cx={20 + index * 75} cy={160 - ((value - min) / (max - min || 1)) * 120} key={`${index}-${value}`} r="5" />)}
  </svg><div className="vet-chart-labels">{["ENE", "MAR", "JUN", "SEP", "NOV"].slice(0, values.length).map((month) => <span key={month}>{month}</span>)}</div></div>;
}

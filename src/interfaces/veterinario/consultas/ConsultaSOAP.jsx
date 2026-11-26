import { useEffect, useState } from "react";
import { Save, ShieldAlert } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { AlertaClinica, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

const emptyConsultation = {
  motivo: "",
  subjetivo: "",
  objetivo: "",
  diagnostico: "",
  plan: "",
  peso: "",
  temperatura: "",
  frecuenciaCardiaca: "",
  frecuenciaRespiratoria: "",
};

export default function ConsultaSOAP() {
  const { appointment, patient, isReadOnly } = useOutletContext();
  const { consultations, saveConsultation } = useVeterinarioData();
  const [values, setValues] = useState(() => ({ ...emptyConsultation, motivo: appointment.notas ?? "", ...consultations[appointment.id] }));
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setValues({ ...emptyConsultation, motivo: appointment.notas ?? "", ...consultations[appointment.id] });
  }, [appointment.id, appointment.notas, consultations]);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    saveConsultation(appointment.id, { [name]: value });
  }

  function save(event) {
    event.preventDefault();
    saveConsultation(appointment.id, values);
    setNotice("Nota SOAP guardada en esta sesión de demostración; aún no se envió al expediente del servidor.");
  }

  const allergy = patient.alergias.find((item) => !item.includes("Ninguna"));
  const chronic = patient.enfermedades.find((item) => !item.toLocaleLowerCase("es-MX").includes("ninguna") && !item.toLocaleLowerCase("es-MX").startsWith("sin "));

  return (
    <div className="vet-soap-layout">
      <VeterinarioPanel title="Registro clínico · SOAP">
        <form className="vet-soap-section" onSubmit={save}>
          <label className="vet-form-field">Motivo de consulta<textarea disabled={isReadOnly} name="motivo" onChange={update} placeholder="Motivo expresado por el responsable" required value={values.motivo} /></label>
          <div className="vet-soap-group">
            <h3>Constantes vitales</h3>
            <div className="vet-form-grid four">
              <FormField label="Peso (kg)" name="peso" onChange={update} type="number" value={values.peso} disabled={isReadOnly} min="0" step="0.1" />
              <FormField label="Temperatura (°C)" name="temperatura" onChange={update} type="number" value={values.temperatura} disabled={isReadOnly} min="30" max="45" step="0.1" />
              <FormField label="Frecuencia cardiaca (lpm)" name="frecuenciaCardiaca" onChange={update} type="number" value={values.frecuenciaCardiaca} disabled={isReadOnly} min="1" />
              <FormField label="Frecuencia respiratoria (rpm)" name="frecuenciaRespiratoria" onChange={update} type="number" value={values.frecuenciaRespiratoria} disabled={isReadOnly} min="1" />
            </div>
          </div>
          <label className="vet-form-field">S · Subjetivo<textarea disabled={isReadOnly} name="subjetivo" onChange={update} placeholder="Lo que refiere la persona responsable" required value={values.subjetivo ?? ""} /></label>
          <label className="vet-form-field">O · Objetivo<textarea disabled={isReadOnly} name="objetivo" onChange={update} placeholder="Hallazgos de la exploración física" required value={values.objetivo ?? ""} /></label>
          <label className="vet-form-field">A · Análisis / diagnóstico<textarea disabled={isReadOnly} name="diagnostico" onChange={update} placeholder="Impresión clínica y diagnóstico" required value={values.diagnostico ?? ""} /></label>
          <label className="vet-form-field">P · Plan terapéutico<textarea disabled={isReadOnly} name="plan" onChange={update} placeholder="Tratamiento, cuidados y seguimiento" required value={values.plan ?? ""} /></label>
          {!isReadOnly && <div className="vet-soap-actions"><button className="secondary-button" type="submit"><Save size={14} /> Guardar borrador</button></div>}
        </form>
        {notice && <p className="demo-notice" role="status">{notice}</p>}
      </VeterinarioPanel>
      <aside className="vet-aside-column">
        <VeterinarioPanel title="Alertas del paciente">
          {allergy ? <AlertaClinica><strong>Alergia registrada:</strong> {allergy}</AlertaClinica> : <AlertaClinica tone="info">No hay alergias registradas en el expediente.</AlertaClinica>}
          {chronic && <AlertaClinica tone="info"><strong>Antecedente:</strong> {chronic}</AlertaClinica>}
          <div className="vet-last-weight"><span>Último peso registrado</span><strong>{patient.peso}</strong><small>Revisa el EHR para consultar las mediciones previas.</small></div>
        </VeterinarioPanel>
        <VeterinarioPanel title="Datos de la cita">
          <div className="vet-appointment-details"><span>Servicio<strong>{appointment.servicio}</strong></span><span>Responsable<strong>{appointment.propietario}</strong></span><span>Consultorio<strong>{appointment.consultorio}</strong></span><span>Hora<strong>{appointment.hora} · {appointment.duracionMinutos} min</strong></span></div>
        </VeterinarioPanel>
        <div className="vet-clinical-alert info"><ShieldAlert size={15} /><span>Revisa alergias y antecedentes antes de indicar tratamientos.</span></div>
      </aside>
    </div>
  );
}

function FormField({ label, ...props }) {
  return <label className="vet-form-field">{label}<input {...props} /></label>;
}

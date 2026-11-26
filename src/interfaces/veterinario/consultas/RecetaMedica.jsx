import { useEffect, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { AlertaClinica, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

const emptyMedicine = { productoId: "", presentacion: "", cantidad: "", dosis: "", duracion: "", via: "Oral" };

export default function RecetaMedica() {
  const { appointment, patient, isReadOnly } = useOutletContext();
  const { consultations, inventory, saveRecipe } = useVeterinarioData();
  const medications = inventory.filter((product) => product.tipo === "MEDICAMENTO");
  const currentRecipe = consultations[appointment.id]?.receta;
  const [medicine, setMedicine] = useState(() => recipeToForm(currentRecipe, medications));
  const [additionalNotes, setAdditionalNotes] = useState(currentRecipe?.indicaciones ?? "");
  const [notice, setNotice] = useState("");
  const allergy = patient.alergias.find((item) => !item.includes("Ninguna"));

  useEffect(() => {
    setMedicine(recipeToForm(consultations[appointment.id]?.receta, medications));
    setAdditionalNotes(consultations[appointment.id]?.receta?.indicaciones ?? "");
  }, [appointment.id, consultations, inventory]);

  function setField(event) {
    setMedicine((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function selectProduct(event) {
    const product = medications.find((item) => item.id === event.target.value);
    setMedicine((current) => ({ ...current, productoId: event.target.value, presentacion: product?.unidad ?? "" }));
  }

  function save(event) {
    event.preventDefault();
    if (!medicine.productoId || !medicine.dosis.trim() || !medicine.duracion.trim()) {
      setNotice("Selecciona el medicamento e indica dosis y duración.");
      return;
    }
    const product = medications.find((item) => item.id === medicine.productoId);
    if (!product) {
      setNotice("El medicamento seleccionado ya no está disponible en el inventario clínico.");
      return;
    }
    saveRecipe(appointment.id, {
      medicamento: product.nombre,
      productoId: product.id,
      presentacion: product.unidad,
      cantidad: medicine.cantidad || `1 ${product.unidad}`,
      dosis: medicine.dosis.trim(),
      duracion: medicine.duracion.trim(),
      via: medicine.via,
      indicaciones: additionalNotes.trim(),
    });
    setNotice("Receta guardada solo en esta sesión de demostración. La generación del PDF y el guardado real requieren backend.");
  }

  return (
    <div className="vet-soap-layout">
      <VeterinarioPanel title="Prescripción médica">
        <form className="vet-soap-section" onSubmit={save}>
          <div className="vet-recipe-row">
            <label className="vet-form-field">Medicamento
              <select disabled={isReadOnly || !medications.length} name="productoId" onChange={selectProduct} required value={medicine.productoId}>
                <option value="">Selecciona un medicamento clínico</option>
                {medications.map((product) => <option key={product.id} value={product.id}>{product.nombre} · stock {product.stock}</option>)}
              </select>
            </label>
            <label className="vet-form-field">Cantidad<input disabled={isReadOnly} name="cantidad" onChange={setField} placeholder="Ej. 5 sobres" value={medicine.cantidad} /></label>
          </div>
          <div className="vet-form-grid four">
            <label className="vet-form-field">Presentación<input disabled name="presentacion" value={medicine.presentacion} /></label>
            <label className="vet-form-field">Dosis<input disabled={isReadOnly} name="dosis" onChange={setField} placeholder="Dosis e intervalo" required value={medicine.dosis} /></label>
            <label className="vet-form-field">Duración<input disabled={isReadOnly} name="duracion" onChange={setField} placeholder="Ej. 5 días" required value={medicine.duracion} /></label>
            <label className="vet-form-field">Vía<select disabled={isReadOnly} name="via" onChange={setField} value={medicine.via}><option>Oral</option><option>Tópica</option><option>Subcutánea</option><option>Intramuscular</option></select></label>
          </div>
          <label className="vet-form-field">Indicaciones adicionales<textarea disabled={isReadOnly} onChange={(event) => setAdditionalNotes(event.target.value)} placeholder="Administración, conservación u observaciones" value={additionalNotes} /></label>
          {allergy && <AlertaClinica>Antes de prescribir, verifica esta alergia del paciente: {allergy}</AlertaClinica>}
          {notice && <p className="demo-notice" role="status">{notice}</p>}
          {!isReadOnly && <div className="vet-soap-actions">
            <button className="secondary-button" onClick={() => setNotice("El PDF de receta estará disponible al integrar el servicio de documentos.")} type="button"><Download size={14} /> Vista previa PDF</button>
            <button className="primary-button" type="submit"><Plus size={14} /> Guardar receta</button>
          </div>}
        </form>
      </VeterinarioPanel>
      <VeterinarioPanel title="Paciente y prescriptor">
        <div className="vet-patient-card-head"><span className="vet-animal-avatar vet-animal-avatar-small peach">{patient.emoji}</span><span><strong>{patient.nombre} · {patient.edad}</strong><small>{patient.propietario} · {patient.telefono}</small></span></div>
        <div className="vet-prescriber-facts"><span>Profesional<strong>Dra. Beatriz Jiménez</strong></span><span>Cédula<strong>8821045</strong></span><span>Fecha<strong>{new Date().toLocaleDateString("es-MX")}</strong></span></div>
        <p className="muted-copy">La vista previa PDF es demostrativa. No se generará ni descargará un documento hasta conectar el servicio de archivos.</p>
        <button className="secondary-button full-button" onClick={() => setNotice("La descarga PDF requiere conectar el servicio de documentos.")} type="button"><Download size={14} /> Descargar PDF</button>
      </VeterinarioPanel>
    </div>
  );
}

function recipeToForm(recipe, medications) {
  if (!recipe) return { ...emptyMedicine, productoId: medications[0]?.id ?? "" };
  const matched = medications.find((product) => product.id === recipe.productoId || product.nombre === recipe.medicamento);
  return {
    productoId: matched?.id ?? medications[0]?.id ?? "",
    presentacion: recipe.presentacion ?? matched?.unidad ?? "",
    cantidad: recipe.cantidad ?? "",
    dosis: recipe.dosis ?? "",
    duracion: recipe.duracion ?? "",
    via: recipe.via ?? "Oral",
  };
}

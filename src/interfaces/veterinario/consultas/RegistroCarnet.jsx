import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateOffset } from "../../../data/veterinarioDemoData.js";
import { AlertaClinica, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

const emptyForm = {
  tipo: "VACUNA",
  nombre: "",
  productoId: "",
  lote: "",
  aplicada: dateOffset(),
  proxima: "",
  observaciones: "",
};

export default function RegistroCarnet() {
  const { appointment, patient, isReadOnly } = useOutletContext();
  const { inventory, vaccines, addVaccine } = useVeterinarioData();
  const clinicalProducts = inventory.filter((product) => ["MEDICAMENTO", "INSUMO_CLINICO"].includes(product.tipo));
  const history = vaccines.filter((vaccine) => vaccine.mascotaId === patient.id);
  const [values, setValues] = useState(() => ({ ...emptyForm, productoId: defaultProduct("VACUNA", clinicalProducts) }));
  const [notice, setNotice] = useState("");

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function defaultProduct(kind, products) {
    const preferredId = kind === "VACUNA" ? "MED-03" : "MED-04";
    return products.find((product) => product.id === preferredId && product.stock > 0)?.id
      ?? products.find((product) => product.tipo === "MEDICAMENTO" && product.stock > 0)?.id
      ?? products.find((product) => product.stock > 0)?.id
      ?? "";
  }

  function submit(event) {
    event.preventDefault();
    if (values.proxima < values.aplicada) {
      setNotice("La próxima dosis no puede ser anterior a la fecha de aplicación.");
      return;
    }
    const product = clinicalProducts.find((item) => item.id === values.productoId);
    if (!product) {
      setNotice("Selecciona un medicamento o insumo clínico disponible.");
      return;
    }
    if (product.stock < 1) {
      setNotice(`${product.nombre} no tiene existencias. No se registró la aplicación.`);
      return;
    }
    try {
      addVaccine({
        mascotaId: patient.id,
        tipo: values.tipo,
        nombre: values.nombre.trim(),
        productoId: product.id,
        lote: values.lote.trim(),
        aplicada: values.aplicada,
        proxima: values.proxima,
        observaciones: values.observaciones.trim(),
        estado: values.proxima <= dateOffset(30) ? "PRÓXIMA" : "AL DÍA",
      });
      setNotice("Registro agregado al carnet y existencia reducida solo en esta sesión de demostración; aún no se sincroniza con el servidor.");
      setValues({ ...emptyForm, tipo: values.tipo, productoId: defaultProduct(values.tipo, clinicalProducts), aplicada: dateOffset() });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo registrar la aplicación.");
    }
  }

  return (
    <div className="vet-soap-layout">
      <VeterinarioPanel title="Registrar vacuna o desparasitación">
        <form className="vet-soap-section" onSubmit={submit}>
          <div className="vet-choice-row" role="group" aria-label="Tipo de registro">
            {["VACUNA", "DESPARASITACION"].map((kind) => <button className={`vet-choice-chip ${values.tipo === kind ? "active" : ""}`} key={kind} onClick={() => setValues((current) => ({ ...current, tipo: kind, productoId: defaultProduct(kind, clinicalProducts) }))} type="button">{kind === "VACUNA" ? "Vacuna" : "Desparasitación"}</button>)}
          </div>
          <div className="vet-form-grid">
            <label className="vet-form-field">Biológico<input disabled={isReadOnly} name="nombre" onChange={update} placeholder={values.tipo === "VACUNA" ? "Nombre de la vacuna" : "Producto desparasitante"} required value={values.nombre} /></label>
            <label className="vet-form-field">Producto de inventario
              <select disabled={isReadOnly} name="productoId" onChange={update} value={values.productoId}>
                {clinicalProducts.map((product) => <option disabled={product.stock < 1} key={product.id} value={product.id}>{product.nombre} · stock {product.stock}</option>)}
              </select>
            </label>
            <label className="vet-form-field">Número de lote<input disabled={isReadOnly} name="lote" onChange={update} placeholder="Lote del biológico" required value={values.lote} /></label>
            <label className="vet-form-field">Fecha de aplicación<input disabled={isReadOnly} max={dateOffset()} name="aplicada" onChange={update} required type="date" value={values.aplicada} /></label>
            <label className="vet-form-field">Próxima dosis<input disabled={isReadOnly} min={values.aplicada} name="proxima" onChange={update} required type="date" value={values.proxima} /></label>
          </div>
          <label className="vet-form-field">Observaciones<textarea disabled={isReadOnly} name="observaciones" onChange={update} placeholder="Vía de aplicación, reacciones u otras notas" value={values.observaciones} /></label>
          {notice && <p className="demo-notice" role="status">{notice}</p>}
          {!isReadOnly && <div className="vet-soap-actions"><button className="primary-button" type="submit">Registrar en carnet</button></div>}
        </form>
      </VeterinarioPanel>
      <div className="vet-aside-column">
        <VeterinarioPanel title="Paciente"><div className="vet-patient-card-head"><span className={`vet-animal-avatar vet-animal-avatar-small ${patient.color}`}>{patient.emoji}</span><span><strong>{patient.nombre} · {patient.peso}</strong><small>{patient.especie} · {patient.propietario}</small></span></div></VeterinarioPanel>
        <AlertaClinica tone="info">El producto se selecciona exclusivamente de MEDICAMENTO e INSUMO_CLINICO; los artículos de TIENDA no aparecen en esta lista.</AlertaClinica>
        <VeterinarioPanel title="Vacunas anteriores">
          {history.length ? history.slice(0, 4).map((vaccine) => <div className="vet-history-compact" key={vaccine.id}><strong>{vaccine.nombre}</strong><small>{vaccine.aplicada} · Lote {vaccine.lote}</small></div>) : <p className="muted-copy">Sin vacunas anteriores registradas.</p>}
        </VeterinarioPanel>
      </div>
    </div>
  );
}

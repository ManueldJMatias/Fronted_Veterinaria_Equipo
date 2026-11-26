import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { mascotas } from "../../data/demoData.js";
import { DemoNotice, PageHeader, PetAvatar } from "../../components/InterfazUI.jsx";
import "./mascotas.css";

export default function FormularioMascota() {
  const { id } = useParams();
  const pet = mascotas.find((item) => item.id === id);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="interface-page">
      <PageHeader
        eyebrow="MIS MASCOTAS"
        title={pet ? `Editar a ${pet.nombre}` : "Registrar mascota"}
        description="Completa la ficha con información que ayude a cuidar mejor de tu mascota."
        action={<Link className="secondary-button" to="/cliente/mascotas"><ArrowLeft size={15} /> Volver</Link>}
      />
      <form className="ui-panel pet-form" onSubmit={handleSubmit}>
        <div className="pet-form-intro">
          {pet ? <PetAvatar pet={pet} /> : <div className="upload-placeholder"><Upload size={21} /></div>}
          <div><h2>Información de la mascota</h2><p>Los campos con * son obligatorios.</p></div>
          <label className="upload-control"><Upload size={15} /> Subir fotografía<input accept="image/*" type="file" /></label>
        </div>
        <div className="form-grid">
          <label className="form-field">Nombre *<input defaultValue={pet?.nombre} placeholder="Nombre de la mascota" required /></label>
          <label className="form-field">Especie *<select defaultValue={pet?.especie ?? ""} required><option disabled value="">Selecciona especie</option><option>Perro</option><option>Gato</option><option>Otra</option></select></label>
          <label className="form-field">Raza<input defaultValue={pet?.raza} placeholder="Raza o mestizo" /></label>
          <label className="form-field">Fecha de nacimiento<input type="date" /></label>
          <label className="form-field">Peso actual<input defaultValue={pet?.peso.replace(" kg", "")} min="0" placeholder="kg" step="0.1" type="number" /></label>
          <label className="form-field">Sexo<select defaultValue={pet?.sexo ?? ""}><option value="">Selecciona</option><option>Hembra</option><option>Macho</option></select></label>
          <label className="form-field">Color y señas particulares<input placeholder="Descripción opcional" /></label>
          <label className="form-field">Microchip<input placeholder="Opcional" /></label>
        </div>
        <fieldset className="form-fieldset"><legend>Estado de esterilización</legend><label><input defaultChecked={pet?.esterilizacion !== "No esterilizada"} name="esterilizacion" type="radio" /> Esterilizada</label><label><input name="esterilizacion" type="radio" /> No esterilizada</label></fieldset>
        <label className="switch-label"><input defaultChecked type="checkbox" /> Perfil activo</label>
        <div className="form-actions"><Link className="secondary-button" to="/cliente/mascotas">Cancelar</Link><button className="primary-button" type="submit">Guardar mascota</button></div>
        {submitted && <DemoNotice>Formulario validado. Para guardar los cambios, conecta la API de mascotas.</DemoNotice>}
      </form>
    </div>
  );
}

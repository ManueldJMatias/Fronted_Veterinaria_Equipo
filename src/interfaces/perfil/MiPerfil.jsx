import { useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoNotice, PageHeader, Panel } from "../../components/InterfazUI.jsx";
import "./perfil.css";

export default function MiPerfil() {
  const [tab, setTab] = useState("datos");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (tab === "seguridad") {
      const formData = new FormData(event.currentTarget);
      if (formData.get("password") !== formData.get("confirmPassword")) {
        setMessage("La nueva contraseña y su confirmación no coinciden.");
        return;
      }
    }
    setMessage(tab === "seguridad" ? "La solicitud para cambiar la contraseña requiere conectar el servicio de cuentas." : "El perfil está en modo demostración; los cambios no se guardaron.");
  }

  return (
    <div className="interface-page">
      <PageHeader title="Mi perfil y seguridad" description="Actualiza tus datos y administra la seguridad de tu cuenta." />
      <nav className="module-tabs">
        <button className={tab === "datos" ? "module-tab-active" : ""} onClick={() => setTab("datos")} type="button"><UserRound size={14} /> Datos personales</button>
        <button className={tab === "seguridad" ? "module-tab-active" : ""} onClick={() => setTab("seguridad")} type="button"><ShieldCheck size={14} /> Seguridad</button>
        <Link to="/cliente/perfil/responsables">Responsables extra</Link>
      </nav>
      {tab === "datos" ? (
        <Panel className="profile-form-panel">
          <div className="profile-avatar-row"><span className="avatar">MG</span><div><strong>Mariana García</strong><small>JPG o PNG · Máximo 5 MB</small></div><label className="secondary-button profile-upload">Cambiar fotografía<input accept="image/*" type="file" /></label></div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid"><label className="form-field">Nombre<input defaultValue="Mariana" required /></label><label className="form-field">Apellidos<input defaultValue="García Morales" required /></label><label className="form-field">Correo electrónico<input defaultValue="mariana@correo.com" type="email" required /></label><label className="form-field">Teléfono<input defaultValue="55 1234 5678" type="tel" /></label><label className="form-field form-full-width">Dirección<input defaultValue="Av. de las Mascotas 123, Centro" /></label></div>
            <div className="responsiva-card"><FileBadge /><span><strong>Carta responsiva</strong><small>Documento firmado · PDF · Actualizado el 12/03/2026</small></span><button type="button" onClick={() => setMessage("No hay un archivo de carta responsiva conectado para descargar.")}>Ver documento</button></div>
            <div className="form-actions"><button className="primary-button" type="submit">Guardar cambios</button></div>
          </form>
        </Panel>
      ) : (
        <Panel className="security-panel" title="Cambiar contraseña">
          <p className="muted-copy">Usa una contraseña segura y evita reutilizar claves anteriores.</p>
          <form className="security-form" onSubmit={handleSubmit}>
            <label className="form-field">Contraseña actual<input autoComplete="current-password" required type="password" /></label>
            <label className="form-field">Nueva contraseña<input autoComplete="new-password" minLength={8} name="password" required type="password" /></label>
            <label className="form-field">Confirmar nueva contraseña<input autoComplete="new-password" minLength={8} name="confirmPassword" required type="password" /></label>
            <div className="form-actions"><button className="primary-button" type="submit">Actualizar contraseña</button></div>
          </form>
        </Panel>
      )}
      {message && <DemoNotice>{message}</DemoNotice>}
    </div>
  );
}

function FileBadge() {
  return <span className="file-badge">PDF</span>;
}

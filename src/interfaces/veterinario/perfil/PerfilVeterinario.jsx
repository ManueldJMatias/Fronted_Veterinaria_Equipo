import { useState } from "react";
import { BadgeCheck, LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { professionalSchedule } from "../../../data/veterinarioDemoData.js";
import { VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

export default function PerfilVeterinario() {
  const { profile, updateProfile } = useVeterinarioData();
  const [values, setValues] = useState(profile);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function saveProfile(event) {
    event.preventDefault();
    const nameParts = values.nombre.trim().split(/\s+/);
    updateProfile({ ...values, displayName: `Dra. ${nameParts[nameParts.length - 1]}`, iniciales: nameParts.slice(-2).map((part) => part[0].toUpperCase()).join("") });
    setNotice("Perfil actualizado en esta sesión de demostración. La información no se ha sincronizado con un servidor.");
  }

  function updatePassword(event) {
    event.preventDefault();
    if (passwords.next.length < 8) {
      setError("La nueva contraseña debe contener al menos 8 caracteres.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }
    setError("");
    setNotice("La pantalla de seguridad es demostrativa: no se modificó ninguna contraseña.");
    setPasswords({ current: "", next: "", confirm: "" });
  }

  return (
    <div className="vet-page">
      <VeterinarioPageHeader title="Perfil profesional" description="Administra tus datos, credenciales y horario de consulta." action={<span className="vet-profile-pill"><ShieldCheck size={15} /> Cuenta veterinaria</span>} />
      <div className="vet-page-grid">
        <div className="vet-main-column">
          <VeterinarioPanel title="Información profesional" action={<BadgeCheck size={17} color="#168f8a" />}>
            <form className="vet-soap-section" onSubmit={saveProfile}>
              <label className="vet-form-field">Nombre profesional<input autoComplete="name" name="nombre" onChange={update} required value={values.nombre} /></label>
              <div className="vet-form-grid">
                <label className="vet-form-field">Especialidad<input name="especialidad" onChange={update} required value={values.especialidad} /></label>
                <label className="vet-form-field">Cédula profesional<input inputMode="numeric" name="cedula" onChange={update} required value={values.cedula} /></label>
                <label className="vet-form-field">Correo electrónico<input autoComplete="email" name="correo" onChange={update} required type="email" value={values.correo} /></label>
                <label className="vet-form-field">Teléfono<input autoComplete="tel" name="telefono" onChange={update} required type="tel" value={values.telefono} /></label>
              </div>
              <label className="vet-form-field">Especies de atención<input name="especies" onChange={update} value={values.especies} /></label>
              {notice && <p className="demo-notice" role="status">{notice}</p>}
              <div className="vet-soap-actions"><button className="primary-button" type="submit"><Save size={14} /> Guardar perfil</button></div>
            </form>
          </VeterinarioPanel>
          <VeterinarioPanel title="Seguridad de la cuenta">
            <form className="vet-soap-section" onSubmit={updatePassword}>
              <label className="vet-form-field">Contraseña actual<input autoComplete="current-password" onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))} required type="password" value={passwords.current} /></label>
              <div className="vet-form-grid">
                <label className="vet-form-field">Nueva contraseña<input autoComplete="new-password" minLength="8" onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))} required type="password" value={passwords.next} /></label>
                <label className="vet-form-field">Confirmar nueva contraseña<input autoComplete="new-password" minLength="8" onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))} required type="password" value={passwords.confirm} /></label>
              </div>
              {error && <p className="vet-form-error" role="alert">{error}</p>}
              <div className="vet-soap-actions"><button className="secondary-button" type="submit"><LockKeyhole size={14} /> Cambiar contraseña</button></div>
            </form>
          </VeterinarioPanel>
        </div>
        <div className="vet-aside-column">
          <VeterinarioPanel title="Vista de perfil">
            <div className="vet-profile-card"><span className="vet-profile-avatar"><UserRound size={25} /></span><strong>{profile.nombre}</strong><span>{profile.especialidad}</span><small>Cédula {profile.cedula}</small><small>{profile.correo}</small></div>
          </VeterinarioPanel>
          <VeterinarioPanel title="Horario semanal">
            <div className="vet-profile-schedule">{professionalSchedule.slice(0, 6).map((day) => <div key={day.dia}><span>{day.dia}</span><strong>{day.horario}</strong></div>)}</div>
            <p className="muted-copy">El horario se muestra como referencia y es administrado por la clínica.</p>
          </VeterinarioPanel>
          <div className="vet-clinical-alert info"><ShieldCheck size={15} /><span>El acceso a perfil y seguridad aún no tiene autenticación de backend.</span></div>
        </div>
      </div>
    </div>
  );
}

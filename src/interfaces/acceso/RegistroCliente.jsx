import { useState } from "react";
import { Heart, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoNotice } from "../../components/InterfazUI.jsx";
import "./acceso.css";

export default function RegistroCliente() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("El formulario está listo, pero el registro requiere conectar el servicio de cuentas.");
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link className="auth-brand" to="/login"><span><PawPrint size={21} /></span>Veterinaria</Link>
        <div className="auth-story-copy">
          <p>EL CUIDADO QUE MERECEN</p>
          <h1>Un lugar especial para cada historia.</h1>
          <span>Tu familia y tus mascotas, siempre cerca de su clínica.</span>
        </div>
        <Heart className="auth-heart" size={86} />
      </section>
      <section className="auth-content">
        <form className="auth-card auth-card-register" onSubmit={handleSubmit}>
          <p className="section-kicker">CREA TU CUENTA</p>
          <h2>Registro de cliente</h2>
          <p className="auth-description">Registra tus datos para comenzar.</p>
          <div className="auth-two-columns">
            <label>Nombre<input autoComplete="given-name" name="nombre" placeholder="Nombre" required /></label>
            <label>Apellidos<input autoComplete="family-name" name="apellidos" placeholder="Apellidos" required /></label>
          </div>
          <label>Correo electrónico<input autoComplete="email" name="email" placeholder="nombre@correo.com" required type="email" /></label>
          <label>Teléfono<input autoComplete="tel" name="telefono" placeholder="55 1234 5678" required type="tel" /></label>
          <label>Dirección<input autoComplete="street-address" name="direccion" placeholder="Calle, número y colonia" required /></label>
          <label>Contraseña<input autoComplete="new-password" name="password" placeholder="Mínimo 8 caracteres" required minLength={8} type="password" /></label>
          <button className="primary-button auth-submit" type="submit">Crear cuenta</button>
          {message && <DemoNotice>{message}</DemoNotice>}
          <p className="auth-switch">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </form>
        <p className="auth-security">Acceso seguro · Veterinaria</p>
      </section>
    </main>
  );
}

import { useState } from "react";
import { Heart, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoNotice } from "../../components/InterfazUI.jsx";
import "./acceso.css";

export default function InicioSesion() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("La autenticación aún no está conectada a un servidor. Esta pantalla es una vista de demostración.");
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link className="auth-brand" to="/cliente/inicio"><span><PawPrint size={21} /></span>Veterinaria</Link>
        <div className="auth-story-copy">
          <p>EL CUIDADO QUE MERECEN</p>
          <h1>Cuidamos de quienes hacen tu vida mejor.</h1>
          <span>Atención, salud y cariño para cada mascota.</span>
        </div>
        <Heart className="auth-heart" size={86} />
      </section>
      <section className="auth-content">
        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="section-kicker">PORTAL DE VETERINARIA</p>
          <h2>Bienvenido</h2>
          <p className="auth-description">Accede al espacio de cuidado de tus mascotas.</p>
          <label>Correo electrónico<input autoComplete="email" name="email" placeholder="nombre@correo.com" required type="email" /></label>
          <label>Contraseña<input autoComplete="current-password" name="password" placeholder="Ingresa tu contraseña" required type="password" /></label>
          <Link className="auth-forgot" to="/login?recuperar=1">¿Olvidaste tu contraseña?</Link>
          <button className="primary-button auth-submit" type="submit">Iniciar sesión</button>
          {message && <DemoNotice>{message}</DemoNotice>}
          <p className="auth-switch">¿Aún no tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
        </form>
        <p className="auth-security">Acceso seguro · Veterinaria</p>
      </section>
    </main>
  );
}

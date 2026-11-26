import { Activity, CalendarDays, CreditCard, MapPin, PawPrint, Syringe } from "lucide-react";
import { Link } from "react-router-dom";
import { citas, mascotas, vacunas } from "../../data/demoData.js";
import { PageHeader, PetAvatar, StatusBadge } from "../../components/InterfazUI.jsx";

export default function InicioCliente() {
  const upcomingAppointments = citas.filter((appointment) => appointment.estado === "CONFIRMADA" || appointment.estado === "PENDIENTE");
  const nextVaccine = vacunas.find((vaccine) => vaccine.estado === "PRÓXIMA");
  const nextAppointment = upcomingAppointments[0];

  return (
    <>
      <PageHeader
        title="¡Hola, Mariana! ✦"
        description="Aquí tienes un resumen de la salud y próximas actividades de tus mascotas."
      />

      <section className="hero-banner">
        <div className="hero-copy">
          <p className="hero-eyebrow">EL CUIDADO QUE MERECEN</p>
          <h2>Todo para su bienestar,<br />en un solo lugar.</h2>
          <p>Revisa sus citas, vacunas y expediente cuando lo necesites.</p>
        </div>
        <div className="hero-next">
          <span className="hero-paw"><PawPrint size={17} /></span>
          <span className="hero-next-copy">
            <small>PRÓXIMA CITA</small><strong>{nextAppointment ? `${nextAppointment.fecha} · ${nextAppointment.hora}` : "Sin citas programadas"}</strong>
            {nextAppointment && <span>{nextAppointment.mascota} · {nextAppointment.servicio}</span>}
          </span>
          <Link to="/cliente/citas">Ver mis citas <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumen de la cuenta">
        <article className="stat-card"><div className="stat-top"><span className="stat-icon mint"><CalendarDays size={18} /></span></div><p className="stat-label">Citas próximas</p><strong className="stat-value">{upcomingAppointments.length}</strong><span className="stat-foot">programadas</span></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-icon peach"><MapPin size={18} /></span></div><p className="stat-label">Mascotas</p><strong className="stat-value">{mascotas.length}</strong><span className="stat-foot">a tu cuidado</span></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-icon amber"><Syringe size={18} /></span></div><p className="stat-label">Vacunas por revisar</p><strong className="stat-value">{vacunas.filter((vaccine) => vaccine.estado === "PRÓXIMA").length}</strong><span className="stat-foot">próxima dosis</span></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-icon lilac"><CreditCard size={18} /></span></div><p className="stat-label">Pagos pendientes</p><strong className="stat-value">$850</strong><span className="stat-foot">1 orden pendiente</span></article>
      </section>

      <section className="pets-section">
        <div className="section-title-row">
          <div><h2>Mis mascotas</h2><p>Sus perfiles y accesos rápidos a su cuidado.</p></div>
          <Link className="text-link" to="/cliente/mascotas">Ver todas <span aria-hidden="true">→</span></Link>
        </div>
        <div className="pets-dashboard-grid">
          {mascotas.map((pet) => (
            <article className="dashboard-pet-card" key={pet.id}>
              <PetAvatar pet={pet} />
              <div className="dashboard-pet-info">
                <h3>{pet.nombre}</h3><p>{pet.especie} · {pet.edad}</p>
                <span className="pet-health"><Activity size={13} /> Saludable</span>
              </div>
              <div className="dashboard-pet-links">
                <Link to={`/cliente/mascotas/${pet.id}`}>Ver expediente</Link>
                <Link to={`/cliente/mascotas/${pet.id}/carnet`}>Carnet digital</Link>
              </div>
            </article>
          ))}
          <article className="vaccine-card">
            <div className="vaccine-heading"><span className="vaccine-alert"><Syringe size={20} /></span><span><strong>Próxima vacuna</strong><small>Toby necesita su refuerzo.</small></span></div>
            <div className="vaccine-detail"><strong>{nextVaccine?.nombre ?? "Sin vacunas próximas"}</strong><span>Próxima dosis · {nextVaccine?.proxima ?? "—"}</span><Link to="/cliente/mascotas/toby/carnet">Ver carnet <span aria-hidden="true">→</span></Link></div>
          </article>
        </div>
      </section>

      <section className="appointments-panel">
        <div className="section-title-row">
          <div><h2>Próximas citas</h2><p>Mantente al día con sus visitas a la clínica.</p></div>
          <Link className="text-link" to="/cliente/citas">Ver todas las citas <span aria-hidden="true">→</span></Link>
        </div>
        {upcomingAppointments.slice(0, 2).map((appointment) => (
          <Link className="appointment-row dashboard-appointment-row" key={appointment.id} to={`/cliente/citas/${appointment.id}`}>
            <div className="appointment-day"><strong>{new Date(`${appointment.fecha}T12:00:00`).toLocaleDateString("es-MX", { month: "short" }).replace(".", "").toUpperCase()}</strong><span>{new Date(`${appointment.fecha}T12:00:00`).getDate()}</span></div>
            <div className="appointment-row-detail"><strong>{appointment.servicio}</strong><span>{appointment.mascota} · {appointment.veterinario}</span></div>
            <div className="appointment-row-time"><strong>{appointment.hora}</strong><span><MapPin size={12} /> Veterinaria</span></div>
            <StatusBadge status={appointment.estado} />
          </Link>
        ))}
      </section>
    </>
  );
}

import { CalendarDays, Clock3, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { veterinarios } from "../../data/demoData.js";
import { PageHeader, Panel } from "../../components/InterfazUI.jsx";
import "./clinica.css";

export default function ClinicaMedicos() {
  return (
    <div className="interface-page">
      <PageHeader title="Clínica y Médicos" description="Conoce al equipo veterinario y encuentra atención para tu mascota." />
      <nav className="module-tabs"><Link className="module-tab-active" to="/cliente/clinica">Médicos veterinarios</Link><Link to="/cliente/clinica/servicios">Servicios y tarifas</Link></nav>
      <div className="doctor-grid">
        {veterinarios.map((doctor) => (
          <Panel className="doctor-card" key={doctor.id}>
            <div className="doctor-card-heading"><span className="doctor-avatar">{doctor.iniciales}</span><div><h2>{doctor.nombre}</h2><p>{doctor.especialidad} · {doctor.especies}</p></div></div>
            <span className="doctor-available"><i /> DISPONIBLE PARA CITAS</span>
            <div className="doctor-facts"><span><ShieldCheck size={14} /> Cédula profesional: {doctor.cedula}</span><span><Clock3 size={14} /> {doctor.horario}</span><span><Stethoscope size={14} /> Atención en clínica</span></div>
            <Link className="primary-button" to="/cliente/citas/nueva"><CalendarDays size={15} /> Agendar cita</Link>
          </Panel>
        ))}
      </div>
      <Panel title="Horarios generales de la clínica" className="clinic-hours">
        <div className="hours-grid">{[["Lunes a viernes", "8:00 a. m. – 7:00 p. m."], ["Sábado", "9:00 a. m. – 4:00 p. m."], ["Domingo", "Emergencias con cita"]].map(([day, hours]) => <p key={day}><strong>{day}</strong><span>{hours}</span></p>)}</div>
      </Panel>
    </div>
  );
}

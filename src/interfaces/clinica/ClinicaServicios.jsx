import { useState } from "react";
import { Clock3, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { servicios } from "../../data/demoData.js";
import { PageHeader, Panel } from "../../components/InterfazUI.jsx";
import "./clinica.css";

export default function ClinicaServicios() {
  const [category, setCategory] = useState("todos");
  const filteredServices = category === "todos" ? servicios : servicios.filter((service) => service.categoria === category);

  return (
    <div className="interface-page">
      <PageHeader title="Clínica y Médicos" description="Servicios disponibles y tarifas de referencia." />
      <nav className="module-tabs"><Link to="/cliente/clinica">Médicos veterinarios</Link><Link className="module-tab-active" to="/cliente/clinica/servicios">Servicios y tarifas</Link></nav>
      <div className="service-category-row">{[["todos", "Todos"], ["consulta", "Consulta"], ["preventiva", "Preventiva"], ["estetica", "Estética"]].map(([value, label]) => <button className={category === value ? "category-active" : ""} key={value} onClick={() => setCategory(value)} type="button">{label}</button>)}</div>
      <div className="service-catalog">
        {filteredServices.map((service) => (
          <Panel className="clinic-service-card" key={service.id}>
            <span className="service-icon"><Stethoscope size={17} /></span>
            <span className="service-category">{service.id === "estetica" ? "ESTÉTICA" : service.id === "consulta" ? "CONSULTA" : "PREVENTIVA"}</span>
            <h2>{service.nombre}</h2><p>{service.detalle}</p>
            <div><span><Clock3 size={13} /> {service.duracion}</span><strong>{service.precio}</strong></div>
            <small>Tarifa de referencia · puede variar por especie y peso.</small>
            <Link className="secondary-button" to="/cliente/citas/nueva">Solicitar servicio</Link>
          </Panel>
        ))}
      </div>
      <Panel title="Horario de atención" className="clinic-hours"><div className="hours-grid"><p><strong>Lunes a viernes</strong><span>8:00 a. m. – 7:00 p. m.</span></p><p><strong>Sábado</strong><span>9:00 a. m. – 4:00 p. m.</span></p><p><strong>Domingo</strong><span>Emergencias con cita</span></p></div></Panel>
    </div>
  );
}

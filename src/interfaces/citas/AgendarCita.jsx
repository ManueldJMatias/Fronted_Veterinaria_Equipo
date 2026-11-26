import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { fechaDemoISO, mascotas, servicios, veterinarios } from "../../data/demoData.js";
import { DemoNotice, PageHeader, PetAvatar } from "../../components/InterfazUI.jsx";
import "./citas.css";

const steps = ["Mascota", "Servicio", "Horario", "Confirmar"];

export default function AgendarCita() {
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState(mascotas[0].id);
  const [serviceId, setServiceId] = useState(servicios[0].id);
  const [vetId, setVetId] = useState(veterinarios[0].id);
  const [date, setDate] = useState(() => fechaDemoISO(7));
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const pet = mascotas.find((item) => item.id === petId);
  const service = servicios.find((item) => item.id === serviceId);
  const vet = veterinarios.find((item) => item.id === vetId);

  return (
    <div className="interface-page">
      <PageHeader title="Agendar nueva cita" description="Completa los pasos para solicitar una visita." />
      <ol className="wizard-steps">{steps.map((label, index) => {
        const number = index + 1;
        return <li className={step >= number ? "step-active" : ""} key={label}><span>{step > number ? <Check size={14} /> : number}</span>{label}</li>;
      })}</ol>
      {!submitted ? (
        <div className="wizard-content">
          <section className="ui-panel wizard-main">
            {step === 1 && <>
              <h2>¿A qué mascota vamos a atender?</h2>
              <div className="choice-grid">{mascotas.map((item) => <button className={`choice-card ${petId === item.id ? "choice-selected" : ""}`} key={item.id} onClick={() => setPetId(item.id)} type="button"><PetAvatar pet={item} size="small" /><span><strong>{item.nombre}</strong><small>{item.especie} · {item.edad}</small></span><span className="choice-radio" /></button>)}</div>
            </>}
            {step === 2 && <>
              <h2>¿Qué servicio necesita {pet.nombre}?</h2>
              <div className="service-choice-list">{servicios.map((item) => <button className={`service-choice ${serviceId === item.id ? "choice-selected" : ""}`} key={item.id} onClick={() => setServiceId(item.id)} type="button"><span className="choice-radio" /><span><strong>{item.nombre}</strong><small>{item.detalle} · {item.duracion}</small></span><b>{item.precio}</b></button>)}</div>
              <p className="field-hint">El costo final puede variar según la especie y el peso de tu mascota.</p>
            </>}
            {step === 3 && <>
              <h2>Elige veterinario y horario</h2>
              <label className="form-field">Veterinario<select value={vetId} onChange={(event) => setVetId(event.target.value)}>{veterinarios.map((item) => <option key={item.id} value={item.id}>{item.nombre} · {item.especialidad}</option>)}</select></label>
              <label className="form-field">Fecha<input min={fechaDemoISO()} onChange={(event) => setDate(event.target.value)} required type="date" value={date} /></label>
              <div className="slot-grid">{["10:30 a. m.", "11:30 a. m.", "1:00 p. m.", "3:30 p. m."].map((slot) => <button className={time === slot ? "slot-selected" : ""} key={slot} onClick={() => setTime(slot)} type="button">{slot}</button>)}</div>
              {!time && <p className="field-hint">Selecciona un horario disponible para continuar.</p>}
            </>}
            {step === 4 && <>
              <h2>Revisa tu solicitud</h2>
              <div className="review-list"><p><span>Mascota</span><strong>{pet.nombre} · {pet.especie}</strong></p><p><span>Servicio</span><strong>{service.nombre} · {service.precio}</strong></p><p><span>Veterinario</span><strong>{vet.nombre}</strong></p><p><span>Horario</span><strong>{new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })} · {time || "10:30 a. m."}</strong></p></div>
              <label className="form-field">Notas para la clínica<textarea placeholder="Cuéntanos algo que debamos saber..." rows="3" /></label>
            </>}
            <div className="wizard-actions">
              {step > 1 ? <button className="secondary-button" type="button" onClick={() => setStep(step - 1)}><ArrowLeft size={15} /> Anterior</button> : <Link className="secondary-button" to="/cliente/citas"><ArrowLeft size={15} /> Volver</Link>}
              <button className="primary-button" disabled={step === 3 && !time} onClick={() => step === 4 ? setSubmitted(true) : setStep(step + 1)} type="button">{step === 4 ? "Enviar solicitud" : "Continuar"} <ArrowRight size={15} /></button>
            </div>
          </section>
          <aside className="ui-panel wizard-aside"><p className="section-kicker">RESUMEN</p><PetAvatar pet={pet} /><h3>{pet.nombre}</h3><p>{service.nombre}</p><strong>{service.precio}</strong><small>La cita queda sujeta a confirmación de la clínica.</small></aside>
        </div>
      ) : (
        <section className="ui-panel wizard-confirmation"><span><Check size={25} /></span><h2>Solicitud preparada</h2><p>La vista está en modo demostración. La solicitud no se envió porque todavía no hay una API conectada.</p><Link className="primary-button" to="/cliente/citas">Volver a mis citas</Link><DemoNotice>Conecta el backend de citas para guardar y confirmar solicitudes.</DemoNotice></section>
      )}
    </div>
  );
}

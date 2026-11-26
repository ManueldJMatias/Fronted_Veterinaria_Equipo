import { useState } from "react";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";
import { useVeterinarioData } from "../../../contexts/VeterinarioDataContext.jsx";
import { dateLabel, dateOffset, professionalSchedule } from "../../../data/veterinarioDemoData.js";
import { VeterinarioPageHeader, VeterinarioPanel } from "../../../components/VeterinarioUI.jsx";

const emptyBlock = {
  motivo: "PERSONAL",
  fechaInicio: dateOffset(),
  fechaFin: dateOffset(),
  horaInicio: "12:00",
  horaFin: "13:00",
  notas: "",
};

const reasonLabels = { CIRUGIA: "Cirugía", PERSONAL: "Personal", REUNION: "Reunión", OTRO: "Otro" };

export default function MiDisponibilidad() {
  const { appointments, blocks, saveBlock, removeBlock } = useVeterinarioData();
  const [form, setForm] = useState(emptyBlock);
  const [editingId, setEditingId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function edit(block) {
    setEditingId(block.id);
    setForm({ motivo: block.motivo, fechaInicio: block.fechaInicio, fechaFin: block.fechaFin, horaInicio: block.horaInicio, horaFin: block.horaFin, notas: block.notas ?? "" });
    setError("");
    setNotice("");
  }

  function reset() {
    setEditingId("");
    setForm({ ...emptyBlock, fechaInicio: dateOffset(), fechaFin: dateOffset() });
    setError("");
  }

  function validate() {
    if (form.fechaFin < form.fechaInicio) return "La fecha final debe ser igual o posterior a la fecha inicial.";
    if (form.fechaInicio === form.fechaFin && form.horaFin <= form.horaInicio) return "La hora final debe ser posterior a la hora de inicio.";
    const appointmentConflict = appointments.find((appointment) => {
      if (!["PENDIENTE", "CONFIRMADA", "EN_SALA_ESPERA", "EN_ATENCION"].includes(appointment.estado)) return false;
      if (appointment.fecha < form.fechaInicio || appointment.fecha > form.fechaFin) return false;
      if (appointment.fecha > form.fechaInicio && appointment.fecha < form.fechaFin) return true;
      const start = timeToMinutes(appointment.hora);
      const end = start + appointment.duracionMinutos;
      const blockStart = appointment.fecha === form.fechaInicio ? timeToMinutes(form.horaInicio) : 0;
      const blockEnd = appointment.fecha === form.fechaFin ? timeToMinutes(form.horaFin) : 24 * 60;
      return start < blockEnd && end > blockStart;
    });
    if (appointmentConflict) return `El bloqueo se traslapa con ${appointmentConflict.id} (${appointmentConflict.hora}, ${appointmentConflict.estado.replaceAll("_", " ")}).`;
    const blockConflict = blocks.find((block) => {
      if (block.id === editingId || block.fechaFin < form.fechaInicio || block.fechaInicio > form.fechaFin) return false;
      const commonStart = block.fechaInicio > form.fechaInicio ? block.fechaInicio : form.fechaInicio;
      const commonEnd = block.fechaFin < form.fechaFin ? block.fechaFin : form.fechaFin;
      const newStart = commonStart === form.fechaInicio ? timeToMinutes(form.horaInicio) : 0;
      const newEnd = commonEnd === form.fechaFin ? timeToMinutes(form.horaFin) : 24 * 60;
      const existingStart = commonStart === block.fechaInicio ? timeToMinutes(block.horaInicio) : 0;
      const existingEnd = commonEnd === block.fechaFin ? timeToMinutes(block.horaFin) : 24 * 60;
      return newStart < existingEnd && newEnd > existingStart;
    });
    return blockConflict ? `El horario se traslapa con otro bloqueo (${reasonLabels[blockConflict.motivo] ?? blockConflict.motivo}).` : "";
  }

  function submit(event) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }
    saveBlock({ ...form, id: editingId || undefined });
    setNotice(editingId ? "Bloqueo actualizado en esta sesión de demostración." : "Bloqueo agregado en esta sesión de demostración.");
    reset();
  }

  function deleteBlock(id) {
    if (!window.confirm("¿Eliminar este bloqueo de disponibilidad?")) return;
    removeBlock(id);
    setNotice("Bloqueo eliminado de esta sesión de demostración.");
    if (editingId === id) reset();
  }

  const orderedBlocks = [...blocks].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio) || a.horaInicio.localeCompare(b.horaInicio));

  return (
    <div className="vet-page">
      <VeterinarioPageHeader title="Mi disponibilidad" description="Consulta tu horario semanal y administra bloqueos personales o clínicos." action={<span className="vet-profile-pill"><CalendarClock size={15} /> Horario de la clínica</span>} />
      <div className="vet-page-grid">
        <div className="vet-main-column">
          <VeterinarioPanel title="Horario semanal">
            <div className="vet-table-wrap"><table><thead><tr><th>Día</th><th>Horario</th><th>Consultorio</th></tr></thead><tbody>
              {professionalSchedule.map((day) => <tr key={day.dia}><td>{day.dia}</td><td>{day.horario}</td><td>{day.consultorio}</td></tr>)}
            </tbody></table></div>
            <p className="muted-copy">El horario base es informativo; la administración del horario laboral requiere conexión con backend.</p>
          </VeterinarioPanel>
          <VeterinarioPanel title="Bloqueos registrados" action={<span className="vet-cell-muted">{blocks.length} en total</span>}>
            {orderedBlocks.length ? <div className="vet-block-list">{orderedBlocks.map((block) => <article className="vet-block-card" key={block.id}>
              <span className="vet-block-icon"><CalendarClock size={16} /></span>
              <span><strong>{reasonLabels[block.motivo] ?? block.motivo}</strong><small>{dateLabel(block.fechaInicio)}{block.fechaFin !== block.fechaInicio ? ` – ${dateLabel(block.fechaFin)}` : ""} · {block.horaInicio}–{block.horaFin}</small>{block.notas && <small>{block.notas}</small>}</span>
              <button aria-label={`Editar bloqueo ${block.id}`} className="vet-icon-action" onClick={() => edit(block)} type="button"><Pencil size={14} /></button>
              <button aria-label={`Eliminar bloqueo ${block.id}`} className="vet-icon-action danger" onClick={() => deleteBlock(block.id)} type="button"><Trash2 size={14} /></button>
            </article>)}</div> : <p className="empty-state">No tienes bloqueos registrados.</p>}
          </VeterinarioPanel>
        </div>
        <VeterinarioPanel title={editingId ? "Editar bloqueo" : "Agregar bloqueo"}>
          <form className="vet-soap-section" onSubmit={submit}>
            <label className="vet-form-field">Motivo<select name="motivo" onChange={update} value={form.motivo}>{Object.entries(reasonLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
            <div className="vet-form-grid">
              <label className="vet-form-field">Desde<input min={dateOffset()} name="fechaInicio" onChange={update} required type="date" value={form.fechaInicio} /></label>
              <label className="vet-form-field">Hasta<input min={form.fechaInicio} name="fechaFin" onChange={update} required type="date" value={form.fechaFin} /></label>
              <label className="vet-form-field">Hora inicial<input name="horaInicio" onChange={update} required type="time" value={form.horaInicio} /></label>
              <label className="vet-form-field">Hora final<input name="horaFin" onChange={update} required type="time" value={form.horaFin} /></label>
            </div>
            <label className="vet-form-field">Notas (opcional)<textarea maxLength="160" name="notas" onChange={update} placeholder="Detalle para tu agenda" value={form.notas} /></label>
            {error && <p className="vet-form-error" role="alert">{error}</p>}
            {notice && <p className="demo-notice" role="status">{notice}</p>}
            <p className="muted-copy">Se verifican traslapes con citas activas y otros bloqueos antes de guardar.</p>
            <div className="vet-soap-actions">
              {editingId && <button className="secondary-button" onClick={reset} type="button">Cancelar edición</button>}
              <button className="primary-button" type="submit">{editingId ? <Pencil size={14} /> : <Plus size={14} />}{editingId ? "Guardar cambios" : "Agregar bloqueo"}</button>
            </div>
          </form>
        </VeterinarioPanel>
      </div>
    </div>
  );
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

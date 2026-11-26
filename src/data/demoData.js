export function fechaDemoISO(daysFromToday = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fechaDemoLabel(daysFromToday = 0) {
  return new Date(`${fechaDemoISO(daysFromToday)}T12:00:00`)
    .toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "")
    .toUpperCase();
}

const nextAppointmentDate = new Date(`${fechaDemoISO(7)}T12:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "long" });

export const mascotas = [
  {
    id: "luna",
    nombre: "Luna",
    especie: "Gata",
    raza: "Mestiza",
    edad: "3 años",
    peso: "4.2 kg",
    sexo: "Hembra",
    esterilizacion: "Esterilizada",
    emoji: "🐱",
    color: "peach",
  },
  {
    id: "toby",
    nombre: "Toby",
    especie: "Perro",
    raza: "Labrador",
    edad: "5 años",
    peso: "18.5 kg",
    sexo: "Macho",
    esterilizacion: "Esterilizado",
    emoji: "🐶",
    color: "lavender",
  },
];

export const citas = [
  {
    id: "CIT-240610",
    fecha: "2026-06-10",
    hora: "9:00 a. m.",
    servicio: "Consulta general",
    mascota: "Luna",
    mascotaId: "luna",
    veterinario: "Dra. Beatriz Jiménez",
    consultorio: "Consultorio 1",
    estado: "COMPLETADA",
    costo: "$450.00",
    notas: "Buen estado general. Se recomienda control de peso.",
  },
  {
    id: "CIT-240615",
    fecha: fechaDemoISO(7),
    hora: "10:30 a. m.",
    servicio: "Revisión general",
    mascota: "Luna",
    mascotaId: "luna",
    veterinario: "Dra. Andrea Ramírez",
    consultorio: "Consultorio 2",
    estado: "CONFIRMADA",
    costo: "$450.00",
    notas: "Revisión anual y actualización de vacunas.",
  },
  {
    id: "CIT-240619",
    fecha: fechaDemoISO(14),
    hora: "12:00 p. m.",
    servicio: "Vacunación",
    mascota: "Toby",
    mascotaId: "toby",
    veterinario: "Dra. Beatriz Jiménez",
    consultorio: "Consultorio 1",
    estado: "PENDIENTE",
    costo: "$380.00",
    notas: "Refuerzo de vacuna antirrábica.",
  },
  {
    id: "CIT-240624",
    fecha: fechaDemoISO(0),
    hora: "4:15 p. m.",
    servicio: "Consulta de seguimiento",
    mascota: "Luna",
    mascotaId: "luna",
    veterinario: "Dra. Andrea Ramírez",
    consultorio: "Consultorio 2",
    estado: "EN_ATENCION",
    costo: "$450.00",
    notas: "Seguimiento de control de peso.",
  },
];

export const servicios = [
  { id: "consulta", categoria: "consulta", nombre: "Consulta general", detalle: "Evaluación completa", duracion: "30 min", precio: "$450.00" },
  { id: "vacuna", categoria: "preventiva", nombre: "Vacunación", detalle: "Aplicación y registro en carnet", duracion: "20 min", precio: "$380.00" },
  { id: "estetica", categoria: "estetica", nombre: "Estética básica", detalle: "Baño, secado y cepillado", duracion: "60 min", precio: "$520.00" },
  { id: "desparasitacion", categoria: "preventiva", nombre: "Desparasitación", detalle: "Dosis según peso y especie", duracion: "15 min", precio: "Desde $250.00" },
];

export const veterinarios = [
  { id: "beatriz", nombre: "Dra. Beatriz Jiménez", especialidad: "Medicina general", especies: "Felinos y caninos", cedula: "8821045", horario: "Lun–Vie · 9:00 a. m.–5:00 p. m.", iniciales: "BJ" },
  { id: "carlos", nombre: "Dr. Carlos Mendoza", especialidad: "Cirugía", especies: "Caninos", cedula: "9013278", horario: "Lun–Sáb · 10:00 a. m.–6:00 p. m.", iniciales: "CM" },
  { id: "andrea", nombre: "Dra. Andrea Ramírez", especialidad: "Medicina preventiva", especies: "Felinos", cedula: "7754291", horario: "Mar–Sáb · 8:00 a. m.–4:00 p. m.", iniciales: "AR" },
];

export const ordenes = [
  { id: "ORD-240615", fecha: "15 JUN 2026", concepto: "Consulta general · Luna", total: "$850.00", estado: "PENDIENTE" },
  { id: "ORD-240602", fecha: "02 JUN 2026", concepto: "Vacunación · Toby", total: "$420.00", estado: "PAGADA" },
  { id: "ORD-240518", fecha: "18 MAY 2026", concepto: "Consulta de seguimiento", total: "$560.00", estado: "PAGADA" },
  { id: "ORD-240411", fecha: "11 ABR 2026", concepto: "Estética · Toby", total: "$680.00", estado: "CANCELADA" },
];

export const notificaciones = [
  { id: "N-1", tipo: "CONFIRMACION_CITA", titulo: "Cita confirmada", mensaje: `La consulta general de Luna fue confirmada para el ${nextAppointmentDate}.`, fecha: "Hoy · 10:45 a. m.", destino: "/cliente/citas/CIT-240615" },
  { id: "N-2", tipo: "RECORDATORIO_24H", titulo: "Próxima cita", mensaje: `La cita de Toby está programada para el ${fechaDemoLabel(14)} a las 12:00 p. m.`, fecha: "Ayer · 9:00 a. m.", destino: "/cliente/citas/CIT-240619" },
  { id: "N-3", tipo: "ALERTA_VACUNA", titulo: "Vacuna por vencer", mensaje: "La vacuna antirrábica de Toby requiere refuerzo.", fecha: "12 JUN 2026", destino: "/cliente/mascotas/toby/carnet" },
  { id: "N-4", tipo: "RECIBO_PAGO", titulo: "Recibo de pago", mensaje: "El recibo REC-240602 ya está disponible.", fecha: "10 JUN 2026", destino: "/cliente/pagos/ORD-240602" },
];

export const responsables = [
  { id: "R-1", nombre: "Carlos García", telefono: "55 9876 5432", parentesco: "Hermano" },
  { id: "R-2", nombre: "Laura Morales", telefono: "55 2345 6789", parentesco: "Madre" },
];

export const vacunas = [
  { nombre: "Triple felina", lote: "TF-20418", aplicada: fechaDemoLabel(-170), proxima: fechaDemoLabel(195), estado: "AL DÍA" },
  { nombre: "Antirrábica", lote: "AR-88210", aplicada: fechaDemoLabel(-351), proxima: fechaDemoLabel(14), estado: "PRÓXIMA" },
  { nombre: "Desparasitación", lote: "DP-51302", aplicada: fechaDemoLabel(-20), proxima: fechaDemoLabel(70), estado: "AL DÍA" },
];

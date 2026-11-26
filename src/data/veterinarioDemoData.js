function dateOffset(days = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateLabel(date, options = { day: "numeric", month: "short", year: "numeric" }) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", options);
}

export const veterinarian = {
  id: "vet-beatriz",
  nombre: "Dra. Beatriz Jiménez",
  displayName: "Dra. Beatriz",
  iniciales: "BJ",
  especialidad: "Medicina general",
  especies: "Felinos y caninos",
  cedula: "8821045",
  telefono: "55 1234 5678",
  correo: "beatriz.jimenez@veterinaria.mx",
};

export const veterinaryPatients = [
  {
    id: "moka",
    nombre: "Moka",
    especie: "Gata",
    raza: "Europea",
    edad: "4 años",
    sexo: "Hembra",
    peso: "4.2 kg",
    propietario: "Elena Ruiz",
    telefono: "55 2345 6789",
    correo: "elena.ruiz@correo.mx",
    color: "peach",
    emoji: "🐱",
    alergias: ["Amoxicilina · reacción cutánea leve"],
    enfermedades: ["Sin enfermedades crónicas registradas"],
    cirugias: ["Esterilización · 2023"],
    ultimaConsulta: dateOffset(-35),
    historialPeso: [3.7, 3.9, 4.0, 4.1, 4.2],
  },
  {
    id: "toby",
    nombre: "Toby",
    especie: "Perro",
    raza: "Labrador",
    edad: "6 años",
    sexo: "Macho",
    peso: "18.5 kg",
    propietario: "Diego López",
    telefono: "55 8765 4321",
    correo: "diego.lopez@correo.mx",
    color: "lavender",
    emoji: "🐶",
    alergias: ["Ninguna registrada"],
    enfermedades: ["Dermatitis estacional controlada"],
    cirugias: [],
    ultimaConsulta: dateOffset(-7),
    historialPeso: [17.8, 18.1, 18.0, 18.3, 18.5],
  },
  {
    id: "nala",
    nombre: "Nala",
    especie: "Perro",
    raza: "Mestiza",
    edad: "2 años",
    sexo: "Hembra",
    peso: "12.3 kg",
    propietario: "Sofía Marín",
    telefono: "55 1111 2233",
    correo: "sofia.marin@correo.mx",
    color: "mint",
    emoji: "🐕",
    alergias: ["Ninguna registrada"],
    enfermedades: ["Ninguna registrada"],
    cirugias: [],
    ultimaConsulta: dateOffset(0),
    historialPeso: [10.8, 11.2, 11.8, 12.0, 12.3],
  },
  {
    id: "luna",
    nombre: "Luna",
    especie: "Gata",
    raza: "Mestiza",
    edad: "3 años",
    sexo: "Hembra",
    peso: "4.4 kg",
    propietario: "Mariana García",
    telefono: "55 9876 5432",
    correo: "mariana@correo.mx",
    color: "peach",
    emoji: "🐈",
    alergias: ["Ninguna registrada"],
    enfermedades: ["Control de peso"],
    cirugias: ["Esterilización · 2024"],
    ultimaConsulta: dateOffset(-9),
    historialPeso: [4.1, 4.0, 4.2, 4.3, 4.4],
  },
  {
    id: "bruno",
    nombre: "Bruno",
    especie: "Perro",
    raza: "Beagle",
    edad: "5 años",
    sexo: "Macho",
    peso: "12 kg",
    propietario: "Arturo León",
    telefono: "55 3333 4455",
    correo: "arturo.leon@correo.mx",
    color: "lavender",
    emoji: "🐶",
    alergias: ["Ninguna registrada"],
    enfermedades: ["Ninguna registrada"],
    cirugias: [],
    ultimaConsulta: dateOffset(-22),
    historialPeso: [11.5, 11.6, 11.8, 11.9, 12],
  },
  {
    id: "emma",
    nombre: "Emma",
    especie: "Coneja",
    raza: "Mini Rex",
    edad: "1 año",
    sexo: "Hembra",
    peso: "1.8 kg",
    propietario: "Paola Cruz",
    telefono: "55 4444 5566",
    correo: "paola.cruz@correo.mx",
    color: "mint",
    emoji: "🐰",
    alergias: ["Ninguna registrada"],
    enfermedades: ["Ninguna registrada"],
    cirugias: [],
    ultimaConsulta: dateOffset(-13),
    historialPeso: [1.5, 1.6, 1.7, 1.75, 1.8],
  },
];

const appointmentDate = dateOffset(0);

export const veterinaryAppointments = [
  { id: "CIT-ANT-01", mascotaId: "moka", fecha: dateOffset(-35), hora: "10:00", duracionMinutos: 30, servicio: "Consulta de seguimiento", propietario: "Elena Ruiz", notas: "Control de peso y bienestar general.", consultorio: "Consultorio 1", estado: "COMPLETADA" },
  { id: "CIT-261125-08", mascotaId: "moka", fecha: appointmentDate, hora: "09:30", duracionMinutos: 30, servicio: "Consulta general", propietario: "Elena Ruiz", notas: "Poco apetito desde ayer y está más inactiva.", consultorio: "Consultorio 1", estado: "EN_SALA_ESPERA" },
  { id: "CIT-261125-09", mascotaId: "toby", fecha: appointmentDate, hora: "10:00", duracionMinutos: 20, servicio: "Vacunación", propietario: "Diego López", notas: "Control anual de vacunas.", consultorio: "Consultorio 2", estado: "EN_SALA_ESPERA" },
  { id: "CIT-261125-10", mascotaId: "nala", fecha: appointmentDate, hora: "10:30", duracionMinutos: 30, servicio: "Consulta de seguimiento", propietario: "Sofía Marín", notas: "Seguimiento de tratamiento.", consultorio: "Consultorio 1", estado: "EN_ATENCION" },
  { id: "CIT-261125-11", mascotaId: "luna", fecha: appointmentDate, hora: "11:30", duracionMinutos: 30, servicio: "Revisión general", propietario: "Mariana García", notas: "Revisión anual y peso.", consultorio: "Consultorio 2", estado: "CONFIRMADA" },
  { id: "CIT-261125-12", mascotaId: "bruno", fecha: appointmentDate, hora: "12:00", duracionMinutos: 30, servicio: "Consulta general", propietario: "Arturo León", notas: "Primera visita.", consultorio: "Consultorio 1", estado: "PENDIENTE" },
  { id: "CIT-261125-13", mascotaId: "emma", fecha: appointmentDate, hora: "12:30", duracionMinutos: 20, servicio: "Vacunación", propietario: "Paola Cruz", notas: "Aplicación de refuerzo.", consultorio: "Consultorio 1", estado: "PENDIENTE" },
  { id: "CIT-261125-14", mascotaId: "moka", fecha: appointmentDate, hora: "13:30", duracionMinutos: 30, servicio: "Consulta de seguimiento", propietario: "Elena Ruiz", notas: "Revisión de evolución.", consultorio: "Consultorio 2", estado: "COMPLETADA" },
  { id: "CIT-261126-01", mascotaId: "toby", fecha: dateOffset(1), hora: "09:00", duracionMinutos: 30, servicio: "Consulta general", propietario: "Diego López", notas: "Control de rutina.", consultorio: "Consultorio 1", estado: "CONFIRMADA" },
  { id: "CIT-261126-02", mascotaId: "nala", fecha: dateOffset(1), hora: "10:00", duracionMinutos: 30, servicio: "Revisión general", propietario: "Sofía Marín", notas: "Revisión de seguimiento.", consultorio: "Consultorio 2", estado: "PENDIENTE" },
  { id: "CIT-261127-01", mascotaId: "luna", fecha: dateOffset(2), hora: "11:00", duracionMinutos: 30, servicio: "Vacunación", propietario: "Mariana García", notas: "Refuerzo de vacuna.", consultorio: "Consultorio 1", estado: "CONFIRMADA" },
];

export const veterinaryConsultations = {
  "CIT-ANT-01": {
    motivo: "Control preventivo.",
    subjetivo: "La propietaria no observa cambios en el apetito.",
    objetivo: "Paciente alerta, sin hallazgos relevantes.",
    diagnostico: "Condición corporal levemente elevada.",
    plan: "Control de porciones y nueva medición en un mes.",
    peso: "4.1",
    temperatura: "38.2",
    frecuenciaCardiaca: "138",
    frecuenciaRespiratoria: "24",
    receta: {
      medicamento: "Probiótico felino",
      presentacion: "Sobres",
      cantidad: "5 sobres",
      dosis: "1 sobre cada 24 horas",
      duracion: "5 días",
      via: "Oral",
      indicaciones: "Administrar con alimento.",
    },
  },
  "CIT-261125-08": {
    motivo: "Poco apetito desde ayer; menor actividad.",
    subjetivo: "La propietaria refiere hiporexia desde hace 24 horas.",
    objetivo: "Mucosas rosadas, hidratación normal, abdomen blando.",
    diagnostico: "Gastritis leve probable.",
    plan: "Dieta blanda, hidratación y revisión en 7 días.",
    peso: "4.2",
    temperatura: "38.4",
    frecuenciaCardiaca: "142",
    frecuenciaRespiratoria: "28",
  },
  "CIT-261125-10": { motivo: "Seguimiento clínico.", subjetivo: "Evolución favorable en casa.", objetivo: "Paciente alerta, mucosas normales.", diagnostico: "Evolución estable.", plan: "Continuar observación.", peso: "12.3", temperatura: "38.2", frecuenciaCardiaca: "110", frecuenciaRespiratoria: "24" },
};

export const vaccineHistory = [
  { id: "V-1", mascotaId: "moka", nombre: "Triple felina", lote: "TF-41082", aplicada: dateOffset(-365), proxima: dateOffset(365), estado: "AL DÍA" },
  { id: "V-2", mascotaId: "moka", nombre: "Antirrábica", lote: "AR-22514", aplicada: dateOffset(-365), proxima: dateOffset(365), estado: "AL DÍA" },
  { id: "V-3", mascotaId: "toby", nombre: "Antirrábica", lote: "AR-91530", aplicada: dateOffset(-342), proxima: dateOffset(23), estado: "PRÓXIMA" },
  { id: "V-4", mascotaId: "nala", nombre: "Séxtuple canina", lote: "SC-71222", aplicada: dateOffset(-140), proxima: dateOffset(225), estado: "AL DÍA" },
];

export const inventoryProducts = [
  { id: "MED-01", nombre: "Probiótico felino 1 g", tipo: "MEDICAMENTO", stock: 18, unidad: "sobres", precio: 28 },
  { id: "MED-02", nombre: "Suero oral veterinario", tipo: "MEDICAMENTO", stock: 12, unidad: "frascos", precio: 95 },
  { id: "MED-03", nombre: "Vacuna antirrábica veterinaria", tipo: "MEDICAMENTO", stock: 8, unidad: "dosis", precio: 320 },
  { id: "MED-04", nombre: "Desparasitante veterinario", tipo: "MEDICAMENTO", stock: 14, unidad: "dosis", precio: 145 },
  { id: "INS-01", nombre: "Jeringa estéril 3 ml", tipo: "INSUMO_CLINICO", stock: 42, unidad: "piezas", precio: 8 },
  { id: "INS-02", nombre: "Gasa estéril", tipo: "INSUMO_CLINICO", stock: 35, unidad: "paquetes", precio: 12 },
  { id: "SHOP-01", nombre: "Alimento premium tienda", tipo: "TIENDA", stock: 50, unidad: "bolsas", precio: 780 },
];

export const veterinaryServices = [
  { id: "consulta", nombre: "Consulta general · felino", precio: 450, tipo: "SERVICIO" },
  { id: "vacunacion", nombre: "Aplicación de vacuna", precio: 180, tipo: "SERVICIO" },
];

export const professionalSchedule = [
  { dia: "Lunes", horario: "08:00–16:00", consultorio: "Consultorio 1" },
  { dia: "Martes", horario: "08:00–16:00", consultorio: "Consultorio 1" },
  { dia: "Miércoles", horario: "08:00–16:00", consultorio: "Consultorio 1" },
  { dia: "Jueves", horario: "08:00–16:00", consultorio: "Consultorio 1" },
  { dia: "Viernes", horario: "08:00–16:00", consultorio: "Consultorio 1" },
  { dia: "Sábado", horario: "09:00–13:00", consultorio: "Consultorio 2" },
  { dia: "Domingo", horario: "Descanso", consultorio: "—" },
];

export const initialVeterinaryBlocks = [
  { id: "B-1", motivo: "CIRUGIA", fechaInicio: dateOffset(1), fechaFin: dateOffset(1), horaInicio: "12:00", horaFin: "14:00", notas: "Procedimiento programado · Max" },
  { id: "B-2", motivo: "PERSONAL", fechaInicio: dateOffset(5), fechaFin: dateOffset(5), horaInicio: "08:00", horaFin: "12:00", notas: "Cita personal" },
];

export const initialVeterinaryNotifications = [
  { id: "VN-1", tipo: "NUEVA_CITA", titulo: "Nueva cita asignada", mensaje: "Moka · Consulta general · Hoy a las 09:30", fecha: "Hoy · 08:42", leida: false, citaId: "CIT-261125-08" },
  { id: "VN-2", tipo: "CANCELACION", titulo: "Paciente canceló su cita", mensaje: "Bruno · Hoy a las 12:00", fecha: "Hoy · 08:15", leida: false, citaId: "CIT-261125-12" },
  { id: "VN-3", tipo: "PACIENTE_EN_SALA", titulo: "Paciente en sala de espera", mensaje: "Toby llegó a recepción · Diego López", fecha: "Hoy · 09:55", leida: false, citaId: "CIT-261125-09" },
  { id: "VN-4", tipo: "REPROGRAMACION", titulo: "Cambio de horario", mensaje: "La consulta de Emma se reprogramó a las 13:00", fecha: "Ayer · 16:30", leida: true, citaId: "CIT-261125-13" },
  { id: "VN-5", tipo: "BLOQUEO", titulo: "Recordatorio de bloqueo", mensaje: "Cirugía programada mañana de 12:00 a 14:00", fecha: "Ayer · 15:10", leida: true },
];

export const projectedHospitalPatients = [
  { mascota: "Max", especie: "Perro", edad: "8 años", ingreso: "Ayer · 18:30", revision: "11:00 · Control de dolor", estado: "ESTABLE" },
  { mascota: "Lola", especie: "Gata", edad: "3 años", ingreso: "Hoy · 07:15", revision: "10:30 · Hidratación", estado: "OBSERVACIÓN" },
  { mascota: "Rocky", especie: "Perro", edad: "6 años", ingreso: "Hoy · 09:00", revision: "12:00 · Curación", estado: "RECUPERACIÓN" },
  { mascota: "Kiwi", especie: "Conejo", edad: "2 años", ingreso: "Ayer · 22:10", revision: "13:00 · Revisión general", estado: "ESTABLE" },
];

export { dateLabel, dateOffset };

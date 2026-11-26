import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const outputDirectory = fileURLToPath(new URL(".", import.meta.url));
const chromeProfile = join(tmpdir(), `vet-mockup-chrome-${process.pid}`);
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const chrome = chromeCandidates.find(existsSync);
if (!chrome) throw new Error("No se encontró Chrome o Edge para generar capturas PNG.");
mkdirSync(outputDirectory, { recursive: true });

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const t = (x, y, value, options = {}) => `<text x="${x}" y="${y}" class="${options.class ?? ""}" font-size="${options.size ?? 11}" font-weight="${options.weight ?? 400}" fill="${options.color ?? "#314751"}" text-anchor="${options.anchor ?? "start"}">${esc(value)}</text>`;
const r = (x, y, width, height, fill = "#fff", radius = 10, stroke = "#e7edef") => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}"${stroke ? ` stroke="${stroke}"` : ""}/>`;
const l = (x1, y1, x2, fourth, fifth) => {
  let y2 = y1;
  let color = "#edf1f2";
  let width = 1;
  if (typeof fourth === "number") y2 = fourth;
  if (typeof fourth === "string") color = fourth;
  if (typeof fifth === "string") color = fifth;
  if (typeof fifth === "number") width = fifth;
  return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${width}"/>`;
};
const dot = (x, y, color = "#168f8a", radius = 4) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>`;
const label = (x, y, value) => t(x, y, value.toUpperCase(), { size: 9, weight: 700, color: "#819198" });
const button = (x, y, width, value, secondary = false) => `${r(x, y, width, 32, secondary ? "#fff" : "#168f8a", 7, secondary ? "#cfe0df" : null)}${t(x + width / 2, y + 21, value, { size: 9, weight: 700, color: secondary ? "#168f8a" : "#fff", anchor: "middle" })}`;
const pill = (x, y, width, value, color = "#43866c", background = "#eaf6f0") => `${r(x, y, width, 21, background, 11, null)}${dot(x + 11, y + 10.5, color, 3)}${t(x + width / 2 + 5, y + 14, value, { size: 8, weight: 700, color, anchor: "middle" })}`;
const panelTitle = (x, y, title, caption = "") => `${t(x, y, title, { size: 15, weight: 700 })}${caption ? t(x, y + 19, caption, { size: 9, color: "#829399" }) : ""}`;
const field = (x, y, width, title, value, height = 37) => `${label(x, y, title)}${r(x, y + 8, width, height, "#fff", 6, "#e5ecee")}${t(x + 10, y + 31, value, { size: 9, color: value.startsWith("Escribe") ? "#a0adb1" : "#40555d" })}`;
const appointmentNames = [
  ["Moka", "Gata · Europea", "09:30", "Consulta general", "Elena Ruiz", "EN SALA"],
  ["Toby", "Perro · Labrador", "10:00", "Vacunación", "Diego López", "EN SALA"],
  ["Nala", "Perro · Mestiza", "10:30", "Seguimiento", "Sofía Marín", "EN ATENCIÓN"],
];

const files = [];
function makeSvg({ name, title, active, subtitle, content, overlay = "" }) {
  const nav = [
    ["Mi jornada", "⌂"],
    ["Mi agenda", "▦"],
    ["Pacientes (EHR)", "♡"],
    ["Mi disponibilidad", "◷"],
    ["Hospitalización", "＋"],
  ];
  let navigation = "";
  nav.forEach(([item, icon], index) => {
    const y = 116 + index * 46;
    const selected = item === active;
    navigation += selected ? r(15, y, 220, 38, "#eaf7f5", 8, null) : "";
    navigation += t(35, y + 24, icon, { size: 15, weight: 700, color: selected ? "#168f8a" : "#8a9ba0" });
    navigation += t(61, y + 24, item, { size: 11, weight: selected ? 700 : 500, color: selected ? "#168f8a" : "#65777e" });
    if (item === "Hospitalización") navigation += pill(156, y + 9, 65, "FASE 2", "#718187", "#f0f3f4");
  });
  let shell = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-labelledby="title description"><title id="title">${esc(title)}</title><desc id="description">Mockup de interfaz para el rol veterinario, vista ${esc(name)}.</desc><defs><style>text{font-family:"DM Sans","Segoe UI",Arial,sans-serif}.title{font-family:"Manrope","Segoe UI",Arial,sans-serif}.muted{fill:#819198}.tiny{font-size:8px}.body{font-size:10px}</style><filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="9" flood-color="#213941" flood-opacity=".05"/></filter></defs>`;
  shell += r(0, 0, 1600, 1000, "#f3f7f8", 0, null) + r(0, 0, 250, 1000, "#fff", 0, null) + l(250, 0, 250, 1000, "#e8eeee");
  shell += r(25, 23, 40, 40, "#168f8a", 12, null) + t(45, 50, "✣", { size: 21, weight: 700, color: "#fff", anchor: "middle" }) + t(76, 49, "Veterinaria", { size: 18, weight: 800, color: "#314751" });
  shell += label(26, 94, "Área clínica") + navigation;
  shell += l(16, 883, 234, 883) + r(27, 901, 40, 40, "#f4e3db", 20, null) + t(47, 926, "BJ", { size: 11, weight: 700, color: "#865f4a", anchor: "middle" }) + t(78, 918, "Dra. Beatriz Jiménez", { size: 10, weight: 700 }) + t(78, 936, "Médica veterinaria", { size: 8, color: "#83949a" });
  shell += r(250, 0, 1350, 75, "#fff", 0, null) + l(250, 75, 1600, 75);
  shell += t(285, 44, "Veterinaria", { size: 11, weight: 700 }) + t(367, 44, "›", { size: 14, color: "#9aa7ab" }) + t(385, 44, active || "Área clínica", { size: 11, weight: 700, color: "#168f8a" });
  shell += r(989, 20, 267, 35, "#f8fafb", 7, "#e8edef") + t(1004, 42, "⌕", { size: 17, color: "#84959a" }) + t(1025, 41, "Buscar mascota o propietario", { size: 9, color: "#87979c" });
  shell += r(1283, 21, 36, 36, "#f7f9fa", 18, null) + t(1301, 44, "♧", { size: 17, color: "#74868c", anchor: "middle" }) + dot(1312, 26, "#e78271", 7) + t(1312, 29, "3", { size: 7, weight: 700, color: "#fff", anchor: "middle" });
  shell += r(1336, 20, 38, 38, "#f4e3db", 20, null) + t(1355, 44, "BJ", { size: 10, weight: 700, color: "#865f4a", anchor: "middle" }) + t(1384, 36, "Dra. Beatriz", { size: 10, weight: 700 }) + t(1384, 51, "Cuenta profesional", { size: 8, color: "#84949a" });
  shell += t(285, 112, title, { class: "title", size: 25, weight: 700 }) + t(285, 136, subtitle, { size: 10, color: "#7d8f95" });
  shell += content + overlay + t(285, 778, "Vista de demostración · Portal del rol Veterinario", { size: 8, color: "#8d9ba0" }) + `</svg>`;
  const filename = `${name}.svg`;
  writeFileSync(join(outputDirectory, filename), shell, "utf8");
  files.push({ name, title, filename, png: `${name}.png` });
}

const waitlistRows = (x, startY, compact = false) => appointmentNames.map((patient, index) => {
  const y = startY + index * (compact ? 61 : 69);
  const animal = ["🐈", "🐕", "🐩"][index];
  return `${r(x, y, 36, 36, ["#fff0e8", "#eff0ff", "#eaf6f0"][index], 18, null)}${t(x + 18, y + 25, animal, { size: 18, anchor: "middle" })}${t(x + 48, y + 15, patient[0], { size: 10, weight: 700 })}${t(x + 48, y + 29, patient[1], { size: 8, color: "#819198" })}${t(x + 220, y + 15, patient[2], { size: 9, weight: 700 })}${t(x + 220, y + 29, patient[3], { size: 8, color: "#819198" })}${t(x + 370, y + 15, patient[4], { size: 9, weight: 600 })}${pill(x + 492, y + 7, 86, patient[5], index === 2 ? "#777dc2" : "#a87935", index === 2 ? "#f0efff" : "#fff5e5")}${button(x + 599, y + 4, compact ? 105 : 116, index === 2 ? "Continuar" : "Iniciar atención", index === 2)}`;
}).join("");

makeSvg({
  name: "02-veterinario-mi-agenda-clinica",
  title: "Veterinario · Mi agenda clínica",
  active: "Mi agenda",
  subtitle: "Consulta las citas asignadas, su estado y el consultorio de cada paciente.",
  content: `${r(285, 158, 1275, 58)}${button(305, 171, 33, "‹", true)}${t(355, 193, "24 nov — 30 nov, 2026", { size: 12, weight: 700 })}${button(540, 171, 33, "›", true)}${button(1130, 171, 86, "Día", true)}${button(1219, 171, 86, "Semana")}${button(1308, 171, 226, "＋  Agregar bloqueo", true)}
  ${r(285, 232, 1275, 498)}${["LUN 24", "MAR 25", "MIÉ 26", "JUE 27", "VIE 28", "SÁB 29", "DOM 30"].map((day, i) => `${i === 2 ? r(389 + i * 164, 239, 36, 28, "#eaf7f5", 13, null) : ""}${t(407 + i * 164, 260, day, { size: 9, weight: 700, color: i === 2 ? "#168f8a" : "#83949a", anchor: "middle" })}${l(325 + i * 164, 277, 325 + i * 164, 730, "#edf1f2")}`).join("")}
  ${["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((hour, i) => `${t(306, 306 + i * 59, hour, { size: 8, color: "#98a6aa" })}${l(340, 294 + i * 59, 1545, 294 + i * 59)}`).join("")}
  ${[["Moka · Consulta", 2, 1, "#e8f6f3"], ["Toby · Vacunación", 2, 2, "#fff3e3"], ["Nala · Seguimiento", 2, 3, "#efefff"], ["Luna · Revisión", 2, 4, "#e8f6f3"], ["Bruno · Consulta", 3, 3, "#fff3e3"], ["Emma · Vacuna", 4, 4, "#e8f6f3"], ["Cirugía · Bloqueo", 5, 4, "#fff0e9"]].map(([name, day, hour, color], i) => `${r(346 + day * 164, 299 + hour * 59 + (i % 2) * 7, 151, 44, color, 7, null)}${t(354 + day * 164, 317 + hour * 59 + (i % 2) * 7, name, { size: 8, weight: 700 })}${t(354 + day * 164, 332 + hour * 59 + (i % 2) * 7, `${i % 2 ? "10:00" : "09:30"} · Consultorio ${i % 2 + 1}`, { size: 7, color: "#788a90" })}`).join("")}
  ${r(1002, 358, 151, 48, "#fff5e5", 7, null)}${t(1010, 377, "Moka · Consulta", { size: 8, weight: 700 })}${t(1010, 392, "09:30 · Consultorio 1", { size: 7, color: "#788a90" })}
  ${r(1159, 419, 151, 48, "#eff0ff", 7, null)}${t(1167, 438, "Nala · Seguimiento", { size: 8, weight: 700 })}${t(1167, 453, "10:30 · Consultorio 2", { size: 7, color: "#788a90" })}
  ${pill(340, 697, 98, "EN SALA", "#a87935", "#fff5e5")}${pill(447, 697, 123, "EN ATENCIÓN", "#777dc2", "#efefff")}${pill(579, 697, 108, "COMPLETADA", "#43866c", "#eaf6f0")}${pill(696, 697, 97, "CANCELADA", "#849196", "#f0f3f4")}`
});

makeSvg({
  name: "03-veterinario-detalle-de-cita",
  title: "Veterinario · Detalle de cita",
  active: "Mi agenda",
  subtitle: "Información de la reserva y acceso directo al expediente y la consulta.",
  content: `${r(285, 157, 1275, 583)}${panelTitle(311, 190, "Mi agenda · Miércoles 25 de noviembre", "Selecciona una cita para revisar los datos de la reserva.")}${r(307, 225, 584, 76, "#f8faf9", 8, null)}${t(327, 252, "09:30", { size: 13, weight: 700, color: "#168f8a" })}${t(327, 273, "HOY", { size: 8, color: "#829399" })}${t(410, 252, "Moka · Consulta general", { size: 11, weight: 700 })}${t(410, 273, "Elena Ruiz · Consultorio 1", { size: 9, color: "#819198" })}${pill(769, 249, 98, "EN SALA", "#a87935", "#fff5e5")}
  ${r(924, 178, 603, 535)}${panelTitle(950, 210, "Detalle de la cita")}${t(950, 232, "FOLIO CIT-261125-08", { size: 8, weight: 700, color: "#168f8a" })}${l(950, 246, 1500, 246)}
  ${r(950, 264, 52, 52, "#fff0e8", 15, null)}${t(976, 297, "🐈", { size: 25, anchor: "middle" })}${t(1017, 283, "Moka", { size: 13, weight: 700 })}${t(1017, 303, "Gata · Europea · Hembra · 4 años", { size: 9, color: "#819198" })}${button(1395, 273, 105, "Ver expediente", true)}
  ${label(950, 346, "Propietaria")}${t(950, 365, "Elena Ruiz", { size: 10, weight: 600 })}${label(1210, 346, "Contacto")}${t(1210, 365, "55 2345 6789", { size: 10 })}${label(950, 398, "Servicio")}${t(950, 417, "Consulta general · 30 min", { size: 10, weight: 600 })}${label(1210, 398, "Consultorio")}${t(1210, 417, "Consultorio 1", { size: 10, weight: 600 })}
  ${label(950, 450, "Motivo y notas del cliente")}${r(950, 463, 550, 53, "#f8faf9", 7, null)}${t(962, 484, "Poco apetito desde ayer y está más inactiva de lo normal.", { size: 9, color: "#536970" })}${t(962, 501, "La propietaria comenta que no ha cambiado su alimentación.", { size: 8, color: "#819198" })}
  ${label(950, 548, "Historial relevante")}${r(950, 561, 550, 54, "#fff8ec", 7, null)}${dot(965, 579, "#d19742", 4)}${t(979, 582, "Alergia registrada: amoxicilina", { size: 9, weight: 600 })}${t(979, 599, "Último peso: 4.1 kg · 22 oct 2026", { size: 8, color: "#819198" })}
  ${button(950, 640, 134, "Abrir expediente", true)}${button(1092, 640, 203, "Iniciar consulta SOAP")}${button(1305, 640, 195, "Cerrar detalle", true)}`
});

makeSvg({
  name: "04-veterinario-consulta-soap",
  title: "Veterinario · Atención de consulta SOAP",
  active: "Pacientes (EHR)",
  subtitle: "CIT-261125-08 · Moka · Consulta general · Propietaria: Elena Ruiz",
  content: `${r(285, 158, 842, 590)}${r(1143, 158, 417, 590)}${r(302, 174, 808, 37, "#f7faf9", 7, null)}${["Consulta SOAP", "Receta médica", "Carnet", "Servicios e insumos"].map((tab, i) => `${i === 0 ? r(310 + i * 197, 178, 176, 29, "#e7f6f3", 6, null) : ""}${t(322 + i * 197, 197, tab, { size: 9, weight: i === 0 ? 700 : 500, color: i === 0 ? "#168f8a" : "#809096" })}`).join("")}
  ${panelTitle(310, 245, "Registro clínico · SOAP", "Completa la valoración médica antes de finalizar la consulta.")}${pill(979, 229, 108, "BORRADOR", "#a87935", "#fff5e5")}
  ${field(310, 278, 776, "Motivo de consulta", "Poco apetito desde ayer; menor actividad.", 42)}
  ${label(310, 348, "Constantes vitales")}${["Peso (kg)", "Temperatura (°C)", "Frec. cardiaca", "Frec. respiratoria"].map((item, i) => field(310 + i * 195, 357, 181, item, ["4.2", "38.4", "142 lpm", "28 rpm"][i], 35)).join("")}
  ${field(310, 423, 776, "S · Subjetivo", "La propietaria refiere hiporexia desde hace 24 horas.", 46)}
  ${field(310, 489, 776, "O · Objetivo", "Mucosas rosadas, hidratación normal, abdomen blando.", 46)}
  ${field(310, 555, 776, "A · Análisis / diagnóstico", "Gastritis leve probable · Evaluar evolución y apetito.", 46)}
  ${field(310, 621, 776, "P · Plan terapéutico", "Dieta blanda, hidratación y revisión en 7 días.", 46)}
  ${button(817, 698, 126, "Guardar borrador", true)}${button(950, 698, 155, "Revisar cierre →")}
  ${panelTitle(1167, 191, "Alertas del paciente")}${r(1167, 211, 369, 64, "#fff5e8", 8, null)}${dot(1184, 233, "#d19742", 5)}${t(1199, 234, "Alergia registrada", { size: 9, weight: 700, color: "#865f2a" })}${t(1199, 253, "Amoxicilina · reacción cutánea", { size: 8, color: "#8a795c" })}
  ${r(1167, 285, 369, 63, "#f7f9fa", 8, null)}${t(1184, 308, "Último peso", { size: 8, color: "#84949a" })}${t(1184, 332, "4.1 kg", { size: 13, weight: 700 })}${t(1260, 332, "22 oct 2026", { size: 8, color: "#819198" })}
  ${panelTitle(1167, 380, "Resumen de cita")}${t(1167, 407, "Servicio", { size: 8, color: "#829399" })}${t(1519, 407, "Consulta general", { size: 9, weight: 600, anchor: "end" })}${l(1167, 417, 1536)}${t(1167, 438, "Consultorio", { size: 8, color: "#829399" })}${t(1519, 438, "Consultorio 1", { size: 9, weight: 600, anchor: "end" })}${l(1167, 449, 1536)}${t(1167, 470, "Propietaria", { size: 8, color: "#829399" })}${t(1519, 470, "Elena Ruiz", { size: 9, weight: 600, anchor: "end" })}
  ${panelTitle(1167, 517, "Atajos del expediente")}${button(1167, 534, 369, "Ver historial clínico", true)}${button(1167, 575, 369, "Consultar carnet de vacunas", true)}${button(1167, 616, 369, "Ver recetas anteriores", true)}${t(1167, 691, "Los datos se guardan al conectar el backend clínico.", { size: 8, color: "#89999e"})}`
});

makeSvg({
  name: "05-veterinario-receta-medica",
  title: "Veterinario · Captura de receta médica",
  active: "Pacientes (EHR)",
  subtitle: "Consulta SOAP · Moka · Receta asociada a la atención clínica actual.",
  content: `${r(285, 158, 842, 590)}${r(1143, 158, 417, 590)}${r(302, 174, 808, 37, "#f7faf9", 7, null)}${["Consulta SOAP", "Receta médica", "Carnet", "Servicios e insumos"].map((tab, i) => `${i === 1 ? r(310 + i * 197, 178, 176, 29, "#e7f6f3", 6, null) : ""}${t(322 + i * 197, 197, tab, { size: 9, weight: i === 1 ? 700 : 500, color: i === 1 ? "#168f8a" : "#809096" })}`).join("")}
  ${panelTitle(310, 245, "Prescripción médica", "Añade medicamentos e indicaciones para generar la receta de la consulta.")}${pill(983, 229, 104, "1 MEDICAMENTO", "#168f8a", "#eaf7f5")}
  ${r(310, 270, 776, 174, "#fbfcfc", 8, "#e8eeee")}${field(328, 304, 355, "Producto", "Probiótico felino 1 g")}${field(701, 304, 175, "Presentación", "Sobres")}${field(894, 304, 174, "Cantidad", "5 sobres")}
  ${field(328, 371, 355, "Dosis", "1 sobre cada 24 horas")}${field(701, 371, 175, "Duración", "5 días")}${field(894, 371, 174, "Vía", "Oral")}
  ${field(310, 469, 776, "Indicaciones adicionales", "Administrar con alimento. Completar el tratamiento.", 48)}
  ${button(310, 545, 171, "＋ Añadir medicamento", true)}${r(310, 600, 776, 72, "#f3f8f7", 8, null)}${t(328, 626, "La alergia a amoxicilina está registrada en el expediente.", { size: 9, weight: 700, color: "#865f2a" })}${t(328, 647, "Revisa las alertas antes de emitir una prescripción.", { size: 8, color: "#8a795c" })}${button(794, 698, 132, "Vista previa PDF", true)}${button(934, 698, 153, "Guardar receta")}
  ${panelTitle(1167, 191, "Paciente y prescriptor")}${r(1167, 211, 369, 74, "#f8faf9", 8, null)}${r(1183, 228, 39, 39, "#fff0e8", 20, null)}${t(1202, 254, "🐈", { size: 19, anchor: "middle" })}${t(1234, 238, "Moka · 4 años", { size: 10, weight: 700 })}${t(1234, 257, "Elena Ruiz · 55 2345 6789", { size: 8, color: "#819198" })}
  ${r(1167, 298, 369, 84, "#fff5e8", 8, null)}${dot(1184, 321, "#d19742", 5)}${t(1199, 323, "Alerta: alergia registrada", { size: 9, weight: 700, color: "#865f2a" })}${t(1184, 344, "Amoxicilina · confirmar alternativa", { size: 8, color: "#8a795c" })}${t(1184, 360, "No continuar sin validar el diagnóstico.", { size: 8, color: "#8a795c" })}
  ${panelTitle(1167, 417, "Detalles de la receta")}${t(1167, 448, "Folio", { size: 8, color: "#829399" })}${t(1519, 448, "Se asigna al guardar", { size: 8, weight: 600, anchor: "end" })}${l(1167, 461, 1536)}${t(1167, 484, "Fecha", { size: 8, color: "#829399" })}${t(1519, 484, "25 nov 2026", { size: 8, weight: 600, anchor: "end" })}${l(1167, 497, 1536)}${t(1167, 520, "Cédula profesional", { size: 8, color: "#829399" })}${t(1519, 520, "8821045", { size: 8, weight: 600, anchor: "end" })}
  ${r(1167, 555, 369, 112, "#f7f9fa", 8, null)}${t(1184, 580, "El PDF se generará al conectar el servicio", { size: 8, color: "#788b91" })}${t(1184, 596, "de documentos de la clínica.", { size: 8, color: "#788b91" })}${button(1184, 615, 334, "Descargar PDF · Requiere integración", true)}`
});

makeSvg({
  name: "06-veterinario-registro-carnet-vacunacion",
  title: "Veterinario · Registro de vacuna y desparasitación",
  active: "Pacientes (EHR)",
  subtitle: "Consulta SOAP · Moka · Registra una vacuna o desparasitación en el carnet digital.",
  content: `${r(285, 158, 842, 590)}${r(1143, 158, 417, 590)}${r(302, 174, 808, 37, "#f7faf9", 7, null)}${["Consulta SOAP", "Receta médica", "Carnet", "Servicios e insumos"].map((tab, i) => `${i === 2 ? r(310 + i * 197, 178, 176, 29, "#e7f6f3", 6, null) : ""}${t(322 + i * 197, 197, tab, { size: 9, weight: i === 2 ? 700 : 500, color: i === 2 ? "#168f8a" : "#809096" })}`).join("")}
  ${panelTitle(310, 245, "Registrar biológico", "Este registro se agregará al carnet digital al finalizar la consulta.")}${pill(985, 229, 101, "OPCIONAL", "#777dc2", "#efefff")}
  ${label(310, 280, "Tipo de registro")}${r(310, 290, 371, 42, "#eaf7f5", 7, "#a6d4ce")}${dot(329, 311, "#168f8a", 6)}${t(346, 315, "Vacuna", { size: 10, weight: 700, color: "#168f8a" })}${r(695, 290, 391, 42, "#fff", 7, "#e5ecee")}${t(718, 315, "Desparasitación", { size: 10, color: "#687b82" })}
  ${field(310, 352, 372, "Nombre del biológico", "Vacuna triple felina", 42)}${field(699, 352, 387, "Fabricante / producto", "Selecciona producto", 42)}
  ${field(310, 422, 237, "Número de lote", "TF-41082", 42)}${field(563, 422, 237, "Fecha de aplicación", "25/11/2026", 42)}${field(815, 422, 271, "Próxima dosis", "25/11/2027", 42)}
  ${field(310, 492, 776, "Observaciones", "Aplicación subcutánea · Sin reacción adversa inmediata.", 49)}
  ${r(310, 581, 776, 75, "#f5f9f8", 8, null)}${t(329, 608, "Registro pendiente de confirmación", { size: 9, weight: 700 })}${t(329, 628, "El carnet se actualizará cuando guardes la consulta clínica.", { size: 8, color: "#819198" })}${button(826, 699, 124, "Guardar borrador", true)}${button(958, 699, 128, "Registrar dosis")}
  ${panelTitle(1167, 191, "Ficha de paciente")}${r(1167, 211, 369, 74, "#f8faf9", 8, null)}${r(1183, 228, 39, 39, "#fff0e8", 20, null)}${t(1202, 254, "🐈", { size: 19, anchor: "middle" })}${t(1234, 238, "Moka · 4 años", { size: 10, weight: 700 })}${t(1234, 257, "Gata · 4.2 kg", { size: 8, color: "#819198" })}
  ${panelTitle(1167, 321, "Vacunas anteriores")}${["Triple felina · 25 nov 2025", "Rabia · 25 nov 2025", "Leucemia felina · 12 jun 2025"].map((item, i) => `${l(1167, 342 + i * 48, 1536)}${dot(1180, 361 + i * 48, i === 2 ? "#d19742" : "#55a681", 4)}${t(1192, 364 + i * 48, item, { size: 8, weight: 600 })}${t(1192, 379 + i * 48, i === 2 ? "Refuerzo próximo" : "Aplicada · registrada", { size: 7, color: "#819198" })}`).join("")}
  ${r(1167, 505, 369, 89, "#eff8f6", 8, null)}${t(1184, 530, "Pista de auditoría", { size: 9, weight: 700, color: "#2c726c" })}${t(1184, 550, "Biológico, lote y fecha quedan asociados", { size: 8, color: "#64817f" })}${t(1184, 568, "a la consulta y al historial de la mascota.", { size: 8, color: "#64817f" })}${button(1167, 612, 369, "Abrir carnet digital", true)}`
});

makeSvg({
  name: "07-veterinario-servicios-insumos-puente-caja",
  title: "Veterinario · Orden de servicios e insumos · Puente con Caja",
  active: "Pacientes (EHR)",
  subtitle: "CIT-261125-08 · Consulta de Moka · Revisión de cargos e inventario antes del cierre.",
  content: `${r(285, 158, 842, 590)}${r(1143, 158, 417, 590)}${r(302, 174, 808, 37, "#f7faf9", 7, null)}${["Consulta SOAP", "Receta médica", "Carnet", "Servicios e insumos"].map((tab, i) => `${i === 3 ? r(310 + i * 197, 178, 176, 29, "#e7f6f3", 6, null) : ""}${t(322 + i * 197, 197, tab, { size: 9, weight: i === 3 ? 700 : 500, color: i === 3 ? "#168f8a" : "#809096" })}`).join("")}
  ${panelTitle(310, 245, "Servicios realizados", "Confirma los conceptos que se enviarán a recepción para cobro.")}${label(310, 278, "CONCEPTO")}${label(700, 278, "CANTIDAD")}${label(848, 278, "PRECIO")}${label(1005, 278, "TOTAL")}${l(310, 289, 1086)}
  ${[["Consulta general · felino", "1", "$450.00", "$450.00"], ["Aplicación de vacuna", "1", "$180.00", "$180.00"], ["Material clínico", "1", "$65.00", "$65.00"]].map((row, i) => `${t(310, 315 + i * 49, row[0], { size: 9, weight: 600 })}${t(722, 315 + i * 49, row[1], { size: 9 })}${t(848, 315 + i * 49, row[2], { size: 9 })}${t(1005, 315 + i * 49, row[3], { size: 9, weight: 700 })}${l(310, 331 + i * 49, 1086)}`).join("")}
  ${button(310, 463, 166, "＋ Añadir servicio", true)}${panelTitle(310, 527, "Medicamentos e insumos aplicados")}${label(310, 557, "PRODUCTO")}${label(681, 557, "CANTIDAD")}${label(843, 557, "EXISTENCIA")}${l(310, 568, 1086)}
  ${t(310, 593, "Jeringa estéril 3 ml", { size: 9, weight: 600 })}${t(681, 593, "1 pza", { size: 9 })}${pill(836, 578, 90, "DISPONIBLE", "#43866c", "#eaf6f0")}${t(1007, 593, "$8.00", { size: 9, weight: 700 })}${l(310, 608, 1086)}
  ${t(310, 633, "Vacuna triple felina", { size: 9, weight: 600 })}${t(681, 633, "1 dosis", { size: 9 })}${pill(836, 618, 90, "STOCK 12", "#43866c", "#eaf6f0")}${t(1007, 633, "$220.00", { size: 9, weight: 700 })}${button(310, 661, 190, "＋ Añadir medicamento", true)}
  ${panelTitle(1167, 191, "Resumen para Caja")}${r(1167, 211, 369, 126, "#f8faf9", 8, null)}${t(1184, 237, "Servicios", { size: 9, color: "#829399" })}${t(1519, 237, "$695.00", { size: 9, weight: 600, anchor: "end" })}${t(1184, 263, "Medicamentos / insumos", { size: 9, color: "#829399" })}${t(1519, 263, "$228.00", { size: 9, weight: 600, anchor: "end" })}${l(1184, 277, 1519)}${t(1184, 302, "Total de la orden", { size: 10, weight: 700 })}${t(1519, 302, "$923.00 MXN", { size: 13, weight: 700, color: "#168f8a", anchor: "end" })}
  ${r(1167, 351, 369, 86, "#fff6e8", 8, null)}${dot(1183, 374, "#c98c39", 4)}${t(1197, 377, "Se enviará como PENDIENTE_COBRO", { size: 8, weight: 700, color: "#8c692f" })}${t(1183, 396, "Caja completará el cobro. Verifica los", { size: 8, color: "#8a795c" })}${t(1183, 413, "conceptos antes de cerrar la atención.", { size: 8, color: "#8a795c" })}
  ${panelTitle(1167, 474, "Validación de inventario")}${pill(1167, 491, 105, "2 DISPONIBLES", "#43866c", "#eaf6f0")}${t(1167, 528, "Se registrará SALIDA_CONSULTA al confirmar.", { size: 8, color: "#819198" })}${t(1167, 546, "No se descontará stock si la operación falla.", { size: 8, color: "#819198" })}
  ${button(1167, 601, 369, "Finalizar consulta y enviar a caja")}${button(1167, 644, 369, "Volver al expediente", true)}${t(1167, 711, "El cierre requiere confirmación del veterinario.", { size: 8, color: "#89999e" })}`
});

makeSvg({
  name: "08-veterinario-directorio-pacientes",
  title: "Veterinario · Directorio de pacientes",
  active: "Pacientes (EHR)",
  subtitle: "Busca pacientes activos por nombre, especie, raza o propietario.",
  content: `${r(285, 158, 1275, 57)}${r(305, 170, 490, 35, "#fff", 7, "#e5ecee")}${t(322, 193, "⌕   Nombre de mascota, raza o propietario", { size: 9, color: "#87979c" })}${r(810, 170, 160, 35, "#fff", 7, "#e5ecee")}${t(826, 193, "Todas las especies   ⌄", { size: 9, color: "#566c73" })}${r(986, 170, 160, 35, "#fff", 7, "#e5ecee")}${t(1002, 193, "Estado: activos   ⌄", { size: 9, color: "#566c73" })}${button(1444, 171, 96, "Buscar")}
  ${t(305, 252, "Pacientes registrados", { size: 14, weight: 700 })}${t(480, 252, "248 mascotas · 196 propietarios", { size: 9, color: "#819198" })}${button(1377, 232, 163, "Exportar listado", true)}
  ${[["Moka", "Gata · Europea · 4 años", "Elena Ruiz", "Última consulta · 22 oct 2026", "4.2 kg", "MR"], ["Toby", "Perro · Labrador · 6 años", "Diego López", "Última consulta · 18 nov 2026", "18.5 kg", "TL"], ["Nala", "Perro · Mestiza · 2 años", "Sofía Marín", "Última consulta · 25 nov 2026", "12.3 kg", "NS"], ["Luna", "Gata · Mestiza · 3 años", "Mariana García", "Última consulta · 16 nov 2026", "4.4 kg", "LG"], ["Bruno", "Perro · Beagle · 5 años", "Arturo León", "Última consulta · 03 nov 2026", "12.0 kg", "AB"], ["Emma", "Coneja · Mini Rex · 1 año", "Paola Cruz", "Última consulta · 12 nov 2026", "1.8 kg", "PE"]].map((pet, i) => {const x=285+(i%3)*430;const y=273+Math.floor(i/3)*221;return `${r(x,y,410,202,"#fff",11)}${r(x+18,y+18,51,51,["#fff0e8","#eff0ff","#eaf6f0"][i%3],18,null)}${t(x+43,y+53,["🐈","🐕","🐩","🐱","🐶","🐇"][i],{size:25,anchor:"middle"})}${pill(x+321,y+26,70,"ACTIVA","#43866c","#eaf6f0")}${t(x+83,y+37,pet[0],{size:13,weight:700})}${t(x+83,y+57,pet[1],{size:8,color:"#819198"})}${l(x+19,y+86,x+390,y+86)}${label(x+20,y+109,"PROPIETARIO")}${t(x+20,y+130,pet[2],{size:9,weight:600})}${label(x+215,y+109,"PESO ACTUAL")}${t(x+215,y+130,pet[4],{size:9,weight:600})}${t(x+20,y+158,pet[3],{size:8,color:"#819198"})}${l(x+20,y+171,x+390,y+171)}${t(x+20,y+190,"Abrir expediente clínico  →",{size:9,weight:700,color:"#168f8a"})}${t(x+349,y+190,"Tel. 55 ···",{size:8,color:"#819198"})}`}).join("")}`
});

makeSvg({
  name: "09-veterinario-expediente-resumen",
  title: "Veterinario · Expediente clínico · Resumen",
  active: "Pacientes (EHR)",
  subtitle: "Pacientes / Moka · Expediente clínico electrónico · Vista médica.",
  content: `${r(285, 158, 1275, 91)}${r(305, 176, 54, 54, "#fff0e8", 16, null)}${t(332, 213, "🐈", { size: 29, anchor: "middle" })}${t(376, 193, "Moka", { size: 15, weight: 700 })}${t(376, 216, "Gata · Europea · Hembra · 4 años · 4.2 kg", { size: 9, color: "#819198" })}${pill(893, 188, 100, "PACIENTE ACTIVA","#43866c","#eaf6f0")}${button(1261, 183, 122, "＋ Agregar antecedente", true)}${button(1391, 183, 144, "Iniciar consulta")}${r(299, 264, 1245, 43, "#fff", 8, "#e8eeee")}${["Resumen", "Historial SOAP", "Recetas", "Carnet digital"].map((tab,i)=>`${i===0?r(307+i*174,269,164,33,"#eaf7f5",6,null):""}${t(323+i*174,290,tab,{size:9,weight:i===0?700:500,color:i===0?"#168f8a":"#819198"})}`).join("")}
  ${r(285, 324, 615, 405)}${panelTitle(307, 357, "Datos y antecedentes")}${button(755, 340, 121, "Editar antecedentes", true)}${[["Especie","Felino"],["Raza","Europea doméstica"],["Sexo","Hembra · esterilizada"],["Peso actual","4.2 kg · 22 oct 2026"],["Propietaria","Elena Ruiz"],["Contacto","55 2345 6789"]].map((row,i)=>`${label(309,394+i*34,row[0])}${t(495,394+i*34,row[1],{size:9,weight:600})}`).join("")}${l(307,607,878)}${panelTitle(307, 634, "Antecedentes clínicos")}${pill(307, 653, 93, "1 ALERGIA","#a87935","#fff5e5")}${t(415,668,"Amoxicilina · reacción cutánea leve",{size:9,weight:600})}${button(731, 681, 145, "＋ Nuevo antecedente", true)}
  ${r(920, 324, 640, 191)}${panelTitle(944, 357, "Última consulta SOAP")}${pill(1420, 338, 112, "22 OCT 2026","#168f8a","#eaf7f5")}${t(944, 392, "Control de peso · Dra. Beatriz Jiménez", {size:9,weight:600})}${t(944, 420, "Diagnóstico", {size:8,color:"#819198"})}${t(1060, 420, "Condición corporal levemente elevada.", {size:9})}${t(944, 450, "Plan", {size:8,color:"#819198"})}${t(1060, 450, "Control de porciones y nueva medición en un mes.", {size:9})}${button(1371, 467, 161, "Ver historial completo", true)}
  ${r(920, 530, 640, 199)}${panelTitle(944, 563, "Peso y vacunas")}${t(944, 592, "Evolución de peso", {size:9,weight:700})}${[0,1,2,3,4].map((i)=>l(950,618+i*18,1212,"#edf1f2"))}${`<polyline points="962,678 1014,663 1064,671 1115,645 1167,633 1210,622" fill="none" stroke="#159b96" stroke-width="2.5"/><circle cx="1167" cy="633" r="4" fill="#159b96"/>`}${pill(1263, 591, 108, "AL DÍA","#43866c","#eaf6f0")}${t(1263, 626,"Triple felina · 25 nov 2026",{size:8,weight:600})}${pill(1263, 653, 108, "PRÓXIMA","#a87935","#fff5e5")}${t(1263, 687,"Refuerzo · 25 nov 2027",{size:8,weight:600})}`
});

makeSvg({
  name: "10-veterinario-expediente-historial-soap",
  title: "Veterinario · Expediente clínico · Historial SOAP",
  active: "Pacientes (EHR)",
  subtitle: "Pacientes / Moka · Línea de tiempo de consultas y evolución del peso.",
  content: `${r(285, 158, 1275, 91)}${r(305, 176, 54, 54, "#fff0e8", 16, null)}${t(332, 213, "🐈", { size: 29, anchor: "middle" })}${t(376, 193, "Moka", { size: 15, weight: 700 })}${t(376, 216, "Gata · Europea · 4 años · Propietaria: Elena Ruiz", { size: 9, color: "#819198" })}${button(1386, 186, 148, "Iniciar consulta")}${r(299, 264, 1245, 43, "#fff", 8, "#e8eeee")}${["Resumen", "Historial SOAP", "Recetas", "Carnet digital"].map((tab,i)=>`${i===1?r(307+i*174,269,164,33,"#eaf7f5",6,null):""}${t(323+i*174,290,tab,{size:9,weight:i===1?700:500,color:i===1?"#168f8a":"#819198"})}`).join("")}
  ${r(285, 324, 755, 413)}${panelTitle(309, 356, "Consultas anteriores", "Registros clínicos ordenados por fecha.")}${[["22 OCT 2026","Control de peso · 4.2 kg","Condición corporal levemente elevada. Ajuste de ración; nueva medición en 30 días.","COMPLETADA"],["10 JUN 2026","Consulta general · 4.1 kg","Buen estado general. Se recomendó control de peso e hidratación.","COMPLETADA"],["14 FEB 2026","Molestia digestiva · 4.0 kg","Gastritis leve. Respuesta favorable al tratamiento y dieta blanda.","COMPLETADA"],["22 OCT 2025","Vacunación anual · 3.9 kg","Aplicación triple felina y refuerzo antirrábico.","COMPLETADA"]].map((entry,i)=>`${dot(323, 394+i*79, "#168f8a", 5)}${i<3?`<path d="M323 ${400+i*79}v59" stroke="#dceae8"/>`:""}${t(341,390+i*79,entry[0],{size:8,weight:700,color:"#168f8a"})}${t(341,410+i*79,entry[1],{size:10,weight:700})}${t(341,429+i*79,entry[2],{size:8,color:"#819198"})}${pill(896, 376+i*79, 116, entry[3],"#43866c","#eaf6f0")}${t(920, 433+i*79,"Abrir nota →",{size:8,weight:700,color:"#168f8a"})}`).join("")}
  ${r(1057, 324, 503, 413)}${panelTitle(1080,356,"Curva de peso")}${t(1080,376,"Registro histórico · kg",{size:8,color:"#819198"})}${[0,1,2,3,4,5].map(i=>l(1102,423+i*42,1528,"#edf1f2"))}${[0,1,2,3,4,5].map(i=>t(1082,427+i*42,`${5.0-i*.2}`,{size:7,color:"#98a6aa"})).join("")}${`<polyline points="1110,611 1190,587 1270,599 1350,540 1430,521 1515,507" fill="none" stroke="#168f8a" stroke-width="3"/><circle cx="1110" cy="611" r="5" fill="#168f8a"/><circle cx="1190" cy="587" r="5" fill="#168f8a"/><circle cx="1270" cy="599" r="5" fill="#168f8a"/><circle cx="1350" cy="540" r="5" fill="#168f8a"/><circle cx="1430" cy="521" r="5" fill="#168f8a"/><circle cx="1515" cy="507" r="5" fill="#168f8a"/>`}${["OCT 25","FEB 26","JUN 26","OCT 26"].map((m,i)=>t(1120+i*133,664,m,{size:7,color:"#89989d"})).join("")}${r(1080, 685, 454, 32, "#f2f8f6", 6, null)}${t(1095,706,"Último peso: 4.2 kg · Próximo control: dic 2026",{size:8,weight:600,color:"#52847c"})}`
});

makeSvg({
  name: "11-veterinario-expediente-recetas",
  title: "Veterinario · Expediente clínico · Recetas",
  active: "Pacientes (EHR)",
  subtitle: "Pacientes / Moka · Consulta y descarga del historial de prescripciones.",
  content: `${r(285, 158, 1275, 91)}${r(305, 176, 54, 54, "#fff0e8", 16, null)}${t(332, 213, "🐈", { size: 29, anchor: "middle" })}${t(376, 193, "Moka", { size: 15, weight: 700 })}${t(376, 216, "Gata · Europea · 4 años · Propietaria: Elena Ruiz", { size: 9, color: "#819198" })}${button(1386, 186, 148, "Iniciar consulta")}${r(299, 264, 1245, 43, "#fff", 8, "#e8eeee")}${["Resumen", "Historial SOAP", "Recetas", "Carnet digital"].map((tab,i)=>`${i===2?r(307+i*174,269,164,33,"#eaf7f5",6,null):""}${t(323+i*174,290,tab,{size:9,weight:i===2?700:500,color:i===2?"#168f8a":"#819198"})}`).join("")}
  ${panelTitle(285, 338, "Recetas médicas", "Prescripciones registradas en consultas anteriores.")}${button(1390, 316, 145, "＋ Nueva receta", true)}
  ${[["22 OCT 2026","Control de peso","Suplemento omega 3","1 cápsula al día · 30 días","Dra. Beatriz Jiménez"],["10 JUN 2026","Consulta general","Probiótico felino","1 sobre cada 24 horas · 5 días","Dra. Beatriz Jiménez"],["14 FEB 2026","Molestia digestiva","Protector gástrico","1/2 tableta cada 12 horas · 7 días","Dra. Andrea Ramírez"]].map((entry,i)=>`${r(285, 359+i*123, 1275, 105)}${r(307, 381+i*123, 44, 44, "#eaf7f5", 12, null)}${t(329, 410+i*123, "Rx", {size:12,weight:700,color:"#168f8a",anchor:"middle"})}${t(371, 390+i*123, entry[2], {size:11,weight:700})}${t(371, 409+i*123, `${entry[0]} · ${entry[1]}`, {size:8,color:"#819198"})}${t(371, 433+i*123, entry[3], {size:9,weight:600})}${t(800, 390+i*123, `Prescribió ${entry[4]}`, {size:8,color:"#819198"})}${t(800, 414+i*123, "Documento clínico · Moka", {size:8,color:"#819198"})}${pill(1191, 378+i*123, 98, "VIGENTE","#43866c","#eaf6f0")}${button(1302, 377+i*123, 112, "Ver receta", true)}${button(1421, 377+i*123, 115, "Descargar PDF", true)}`).join("")}
  ${r(285, 747, 1275, 1, "#edf1f2", 0, null)}${t(305, 722, "Los documentos PDF estarán disponibles al conectar el servicio de archivos clínicos.",{size:8,color:"#89999e"})}`
});

makeSvg({
  name: "12-veterinario-expediente-carnet-digital",
  title: "Veterinario · Expediente clínico · Carnet digital",
  active: "Pacientes (EHR)",
  subtitle: "Pacientes / Moka · Historial de vacunas y desparasitaciones.",
  content: `${r(285, 158, 1275, 91)}${r(305, 176, 54, 54, "#fff0e8", 16, null)}${t(332, 213, "🐈", { size: 29, anchor: "middle" })}${t(376, 193, "Moka", { size: 15, weight: 700 })}${t(376, 216, "Gata · Europea · 4 años · Propietaria: Elena Ruiz", { size: 9, color: "#819198" })}${button(1386, 186, 148, "Iniciar consulta")}${r(299, 264, 1245, 43, "#fff", 8, "#e8eeee")}${["Resumen", "Historial SOAP", "Recetas", "Carnet digital"].map((tab,i)=>`${i===3?r(307+i*174,269,164,33,"#eaf7f5",6,null):""}${t(323+i*174,290,tab,{size:9,weight:i===3?700:500,color:i===3?"#168f8a":"#819198"})}`).join("")}
  ${r(285, 323, 1275, 79, "#eaf7f5", 10, null)}${t(307, 349, "Próxima dosis recomendada", {size:8,weight:700,color:"#168f8a"})}${t(307, 378, "Refuerzo triple felina · 25 de noviembre de 2027", {size:13,weight:700})}${pill(1352, 351, 177, "EN 365 DÍAS","#43866c","#fff")}
  ${r(285, 419, 1275, 320)}${panelTitle(309, 452, "Registro de inmunización")}${button(1373, 432, 163, "＋ Registrar aplicación", true)}${label(309, 480, "BIOLÓGICO")}${label(643, 480, "LOTE")}${label(819, 480, "FECHA APLICACIÓN")}${label(1032, 480, "PRÓXIMA DOSIS")}${label(1260, 480, "ESTADO")}${l(309, 493, 1535)}
  ${[["Triple felina","TF-41082","25 NOV 2026","25 NOV 2027","AL DÍA"],["Antirrábica","AR-22514","25 NOV 2026","25 NOV 2027","AL DÍA"],["Leucemia felina","LF-18503","12 JUN 2026","12 JUN 2027","AL DÍA"],["Desparasitación","DP-91347","15 AGO 2026","15 FEB 2027","PRÓXIMA"]].map((row,i)=>`${t(309, 524+i*48, row[0], {size:9,weight:600})}${t(643,524+i*48,row[1],{size:8})}${t(819,524+i*48,row[2],{size:8})}${t(1032,524+i*48,row[3],{size:8})}${pill(1260, 507+i*48, 100, row[4],row[4]==="AL DÍA"?"#43866c":"#a87935",row[4]==="AL DÍA"?"#eaf6f0":"#fff5e5")}${t(1410,524+i*48,"Ver detalle",{size:8,weight:700,color:"#168f8a"})}${l(309,539+i*48,1535)}`).join("")}
  ${r(309, 713, 1226, 1, "#edf1f2", 0, null)}${t(309, 730, "El carnet guarda producto, lote, fecha y próxima dosis para dar seguimiento al paciente.",{size:8,color:"#819198"})}`
});

makeSvg({
  name: "13-veterinario-disponibilidad-y-bloqueos",
  title: "Veterinario · Mi disponibilidad y bloqueos",
  active: "Mi disponibilidad",
  subtitle: "Consulta tus turnos regulares asignados y administra bloqueos personales.",
  content: `${r(285, 158, 1275, 268)}${panelTitle(309, 191, "Turnos asignados por administración", "Horario regular · Solo lectura")}${pill(1379, 174, 151, "ASIGNACIÓN ACTIVA","#43866c","#eaf6f0")}${label(309,226,"DÍA")}${label(520,226,"TURNO")}${label(760,226,"CONSULTORIO")}${label(1045,226,"DESCANSO")}${l(309,239,1535)}
  ${["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map((day,i)=>`${t(309,265+i*22,day,{size:8,weight:600})}${t(520,265+i*22,i<5?"08:00 – 16:00":i===5?"09:00 – 13:00":"Descanso",{size:8})}${t(760,265+i*22,i<5?"Consultorio 1":"—",{size:8,color:"#65777e"})}${i===6?pill(1045,248+i*22,81,"DESCANSO","#849196","#f0f3f4"):""}${l(309,273+i*22,1535)}`).join("")}
  ${r(285, 448, 1275, 285)}${panelTitle(309, 480, "Bloqueos personales", "Cirugías, asuntos personales y días libres.")}${button(1377, 459, 157, "＋ Nuevo bloqueo")}${label(309, 515,"MOTIVO")}${label(610,515,"FECHA Y HORARIO")}${label(987,515,"NOTAS")}${label(1323,515,"ESTADO")}${l(309,527,1535)}
  ${[["Cirugía programada","26 nov · 12:00–14:00","Procedimiento · paciente Max","PROGRAMADO"],["Asunto personal","30 nov · 08:00–12:00","Cita personal","PROGRAMADO"],["Día libre","12 dic · Todo el día","Día solicitado","PENDIENTE"]].map((item,i)=>`${t(309,555+i*52,item[0],{size:9,weight:700})}${t(610,555+i*52,item[1],{size:8})}${t(987,555+i*52,item[2],{size:8,color:"#71858b"})}${pill(1323,538+i*52,115,item[3],i===2?"#a87935":"#43866c",i===2?"#fff5e5":"#eaf6f0")}${t(1455,555+i*52,"Editar · ⋯",{size:8,weight:600,color:"#168f8a"})}${l(309,570+i*52,1535)}`).join("")}
  ${r(309, 706, 1226, 1, "#edf1f2", 0, null)}${t(309, 724, "Los cambios de turno regular requieren autorización de administración.",{size:8,color:"#89999e"})}`
});

makeSvg({
  name: "14-veterinario-crear-bloqueo",
  title: "Veterinario · Crear bloqueo de disponibilidad",
  active: "Mi disponibilidad",
  subtitle: "Define un bloqueo personal o de cirugía; se validará contra las citas existentes.",
  content: `${r(285, 158, 1275, 575)}${r(690, 188, 485, 512, "#fff", 13, "#e6eded")}${t(720, 223, "Nuevo bloqueo de disponibilidad", {size:16,weight:700})}${t(720,245,"Configura el periodo y el motivo del bloqueo.",{size:9,color:"#819198"})}${l(720,258,1145)}
  ${label(720,287,"MOTIVO DEL BLOQUEO")}${r(720,298,425,40,"#eaf7f5",7,"#a6d4ce")}${dot(738,318,"#168f8a",5)}${t(753,322,"Personal",{size:10,weight:700,color:"#168f8a"})}${t(1079,322,"⌄",{size:12,color:"#819198"})}
  ${field(720, 359, 203,"Fecha de inicio","30/11/2026")}${field(942,359,203,"Hora de inicio","08:00")}
  ${field(720, 422, 203,"Fecha de fin","30/11/2026")}${field(942,422,203,"Hora de fin","12:00")}
  ${label(720, 497,"NOTAS")}${r(720,508,425,64,"#fff",7,"#e5ecee")}${t(732,531,"Cita personal",{size:9})}${t(732,552,"Información visible solo para clínica.",{size:8,color:"#89999e"})}
  ${r(720, 586, 425, 51, "#fff5e8", 7, null)}${dot(738,606,"#c98c39",4)}${t(751,609,"Validación de disponibilidad",{size:8,weight:700,color:"#8c692f"})}${t(732,627,"Se comprobarán traslapes con citas antes de confirmar.",{size:8,color:"#8a795c"})}
  ${button(720, 655, 135, "Cancelar", true)}${button(1002,655,143,"Guardar bloqueo")}
  ${t(310, 210, "Horario de la semana", {size:14,weight:700})}${t(310, 235, "Vista previa de las citas asignadas",{size:9,color:"#819198"})}${["LUN 24","MAR 25","MIÉ 26","JUE 27","VIE 28"].map((d,i)=>t(340+i*62,278,d,{size:7,weight:700,color:"#819198"})).join("")}${[0,1,2,3,4,5].map(i=>`${t(309,315+i*51,`${8+i}:00`,{size:8,color:"#819198"})}${l(342,309+i*51,640, "#edf1f2")}`).join("")}${r(405, 412, 178, 57, "#fff0e9", 7, null)}${t(416,434,"Cita · Bruno",{size:8,weight:700})}${t(416,451,"Consultorio 1 · 12:00",{size:7,color:"#819198"})}`
});

makeSvg({
  name: "15-veterinario-centro-notificaciones",
  title: "Veterinario · Centro de notificaciones",
  active: "Mi jornada",
  subtitle: "Avisos en la aplicación relacionados con citas y operación clínica.",
  content: `${r(285, 158, 1275, 57)}${["Todas","Nuevas citas","Cancelaciones","Alertas operativas"].map((tab,i)=>`${r(305+i*147,170, i===0?77:132, 31,i===0?"#eaf7f5":"#fff",16,i===0?"#b7ded8":"#e7edef")}${t(344+i*147,190,tab,{size:8,weight:i===0?700:500,color:i===0?"#168f8a":"#71848a",anchor:"middle"})}`).join("")}${t(305,252,"Notificaciones recientes",{size:14,weight:700})}${t(1517,252,"Marcar todas como leídas",{size:8,weight:700,color:"#168f8a",anchor:"end"})}
  ${[["Nueva cita asignada","Moka · Consulta general · Elena Ruiz · Hoy a las 09:30","Hoy · 08:42","NUEVA CITA","#168f8a","#eaf7f5"],["Paciente canceló su cita","Cita de Bruno · Arturo León · Hoy a las 12:00","Hoy · 08:15","CANCELACIÓN","#bd7165","#fff0ed"],["Paciente en sala de espera","Toby llegó a recepción · Diego López","Hoy · 09:55","EN SALA","#a87935","#fff5e5"],["Cambio de horario","La consulta de Emma se reprogramó a las 13:00","Ayer · 16:30","REPROGRAMADA","#777dc2","#efefff"],["Recordatorio de bloqueo","Cirugía programada mañana de 12:00 a 14:00","Ayer · 15:10","OPERACIÓN","#718187","#f0f3f4"]].map((item,i)=>`${r(285,275+i*91,1275,78,"#fff",9)}${r(304,294+i*91,38,38,item[5],20,null)}${t(323,319+i*91,["◷","×","●","↻","▣"][i],{size:15,weight:700,color:item[4],anchor:"middle"})}${dot(357,294+i*91,i===2?"#fff":"#e78271",4)}${t(372,302+i*91,item[0],{size:10,weight:700})}${t(372,321+i*91,item[1],{size:8,color:"#778990"})}${t(372,339+i*91,item[2],{size:7,color:"#9aa7ab"})}${pill(1292,294+i*91,108,item[3],item[4],item[5])}${t(1518,323+i*91,"Abrir  →",{size:8,weight:700,color:"#168f8a",anchor:"end"})}`).join("")}`
});

makeSvg({
  name: "16-veterinario-notificaciones-popover",
  title: "Veterinario · Campana y vista rápida de notificaciones",
  active: "Mi jornada",
  subtitle: "Vista rápida de avisos · Menú de notificaciones abierto desde la barra superior.",
  content: `${r(285, 158, 1275, 583)}${panelTitle(311,192,"Mi jornada · Agenda de hoy","El centro de notificaciones se despliega desde la campana de la barra superior.")}${r(311, 227, 820, 101,"#fff",9)}${t(333,256,"Resumen de la jornada",{size:11,weight:700})}${t(333,279,"8 citas asignadas · 2 pacientes en espera · 4 consultas completadas",{size:9,color:"#819198"})}${r(311,347,820,320,"#fff",9)}${panelTitle(333,381,"Pacientes de hoy")}${waitlistRows(333,410,true)}
  ${r(1118, 61, 371, 373, "#fff", 12, "#e4ecee")}${t(1141,92,"Notificaciones",{size:12,weight:700})}${t(1468,92,"3 nuevas",{size:8,weight:700,color:"#168f8a",anchor:"end"})}${l(1141,108,1468)}
  ${[["Nueva cita asignada","Moka · Consulta general · Hoy a las 09:30","2 min","#168f8a","#eaf7f5"],["Paciente canceló su cita","Bruno · Hoy a las 12:00","18 min","#bd7165","#fff0ed"],["Toby está en sala de espera","Recepción marcó su llegada","Ahora","#a87935","#fff5e5"]].map((item,i)=>`${r(1141,122+i*80,34,34,item[4],17,null)}${t(1158,145+i*80,["◷","×","●"][i],{size:13,weight:700,color:item[3],anchor:"middle"})}${dot(1179,123+i*80,"#e78271",3)}${t(1189,137+i*80,item[0],{size:8,weight:700})}${t(1189,154+i*80,item[1],{size:7,color:"#819198"})}${t(1189,169+i*80,item[2],{size:7,color:"#9aa7ab"})}${i<2?l(1141,194+i*80,1468):""}`).join("")}${l(1141,370,1468)}${t(1304,400,"Ver todas las notificaciones  →",{size:8,weight:700,color:"#168f8a",anchor:"middle"})}
  ${r(1283, 19, 36, 36, "#eaf7f5", 18, "#c6e5e0")}${t(1301,44,"♧",{size:17,color:"#168f8a",anchor:"middle"})}${dot(1312,26,"#e78271",7)}${t(1312,29,"3",{size:7,weight:700,color:"#fff",anchor:"middle"})}`
});

makeSvg({
  name: "17-veterinario-perfil-profesional",
  title: "Veterinario · Mi perfil profesional y seguridad",
  active: "Mi jornada",
  subtitle: "Consulta tus datos profesionales y actualiza la información de contacto de tu cuenta.",
  content: `${r(285, 158, 820, 569)}${r(1124, 158, 436, 280)}${r(1124, 454, 436, 273)}${r(309, 182, 61, 61, "#f4e3db", 31, null)}${t(340,221,"BJ",{size:17,weight:700,color:"#865f4a",anchor:"middle"})}${t(389,199,"Dra. Beatriz Jiménez",{size:15,weight:700})}${t(389,220,"Médica veterinaria · Cuenta activa",{size:9,color:"#819198"})}${pill(915, 200, 125, "PERFIL VERIFICADO","#43866c","#eaf6f0")}${l(309,263,1080)}
  ${panelTitle(309, 295, "Datos de contacto")}${field(309, 324, 360, "Correo profesional", "beatriz.jimenez@veterinaria.mx")}${field(692,324,388,"Teléfono", "55 1234 5678")}${field(309, 392, 771, "Dirección de contacto", "Av. de las Mascotas 123, Centro")}${button(925, 463, 155, "Guardar cambios")}
  ${panelTitle(309, 532, "Información profesional")}${field(309, 558, 360, "Cédula profesional", "8821045")}${field(692,558,388, "Especialidad / especies", "Medicina general · Felinos y caninos")}${t(309, 673, "Los datos profesionales son administrados por la clínica.", {size:8,color:"#89999e"})}
  ${panelTitle(1149, 191, "Seguridad de la cuenta")}${t(1149,219,"Actualiza tu contraseña de acceso.",{size:8,color:"#819198"})}${field(1149, 238, 386, "Contraseña actual", "••••••••••")}${field(1149, 298, 386, "Nueva contraseña", "Mínimo 8 caracteres")}${button(1345, 367, 190, "Cambiar contraseña")}
  ${panelTitle(1149, 487, "Sesión y actividad")}${t(1149, 520, "Último acceso", {size:8,color:"#819198"})}${t(1535,520,"Hoy · 08:12 · Esta sesión",{size:8,weight:600,anchor:"end"})}${l(1149,535,1535)}${t(1149,560,"Dispositivo",{size:8,color:"#819198"})}${t(1535,560,"Chrome · Windows",{size:8,weight:600,anchor:"end"})}${l(1149,575,1535)}${t(1149,603,"Cerrar sesión en este equipo",{size:8,weight:600,color:"#bd7165"})}${button(1149, 638, 386, "Cerrar sesión", true)}`
});

makeSvg({
  name: "18-veterinario-hospitalizacion-fase-2",
  title: "Veterinario · Hospitalización y seguimiento · Fase 2",
  active: "Hospitalización",
  subtitle: "Vista proyectada para la siguiente fase · Seguimiento clínico de pacientes hospitalizados.",
  content: `${r(285, 158, 1275, 59, "#fff6e8", 9, "#f1dfbd")}${dot(307, 187, "#c98c39", 5)}${t(323,184,"VISTA PROYECTADA · FASE 2",{size:9,weight:700,color:"#8c692f"})}${t(323,201,"Este módulo no forma parte del MVP operativo actual.",{size:8,color:"#8a795c"})}${pill(1392,177,142,"NO DISPONIBLE","#a87935","#fff")}
  ${r(285, 236, 300, 103)}${r(601,236,300,103)}${r(917,236,300,103)}${r(1233,236,327,103)}${t(309,267,"Pacientes hospitalizados",{size:8,color:"#819198"})}${t(309,310,"5",{size:26,weight:700})}${t(345,310,"activos",{size:8,color:"#819198"})}${t(625,267,"Revisión pendiente",{size:8,color:"#819198"})}${t(625,310,"2",{size:26,weight:700,color:"#a87935"})}${t(661,310,"en esta hora",{size:8,color:"#819198"})}${t(941,267,"Tratamientos hoy",{size:8,color:"#819198"})}${t(941,310,"12",{size:26,weight:700,color:"#168f8a"})}${t(977,310,"programados",{size:8,color:"#819198"})}${t(1257,267,"Altas previstas",{size:8,color:"#819198"})}${t(1257,310,"1",{size:26,weight:700,color:"#43866c"})}${t(1293,310,"para hoy",{size:8,color:"#819198"})}
  ${r(285, 359, 827, 356)}${panelTitle(309,392,"Pacientes internos","Panel previsto de seguimiento hospitalario.")}${label(309,427,"PACIENTE")}${label(510,427,"INGRESO")}${label(677,427,"PRÓXIMA REVISIÓN")}${label(883,427,"ESTADO")}${l(309,439,1087)}
  ${[["Max · Perro · 8 años","24 nov · 18:30","11:00 · Control de dolor","ESTABLE"],["Lola · Gata · 3 años","25 nov · 07:15","10:30 · Hidratación","OBSERVACIÓN"],["Rocky · Perro · 6 años","25 nov · 09:00","12:00 · Curación","RECUPERACIÓN"],["Kiwi · Conejo · 2 años","24 nov · 22:10","13:00 · Revisión general","ESTABLE"]].map((item,i)=>`${r(309,451+i*55,39,39,["#fff0e8","#f0efff","#eaf6f0","#fff5e5"][i],12,null)}${t(329,477+i*55,["🐕","🐈","🐶","🐇"][i],{size:18,anchor:"middle"})}${t(359,465+i*55,item[0],{size:8,weight:700})}${t(510,465+i*55,item[1],{size:8})}${t(677,465+i*55,item[2],{size:8})}${pill(883, 452+i*55, 119,item[3],i===1?"#a87935":"#43866c",i===1?"#fff5e5":"#eaf6f0")}${l(309,489+i*55,1087)}`).join("")}
  ${r(1128,359,432,356)}${panelTitle(1152,392,"Seguimiento próximo","Plan proyectado de tratamientos y rondas.")}${[["10:00","Revisión · Lola","Control de hidratación"],["11:00","Medicación · Max","Analgesia · Dosis programada"],["12:00","Curación · Rocky","Revisión de herida"],["13:00","Revisión · Kiwi","Control general"]].map((item,i)=>`${dot(1160,435+i*58,i===1?"#d19742":"#168f8a",4)}${i<3?`<path d="M1160 ${440+i*58}v45" stroke="#dceae8"/>`:""}${t(1175,439+i*58,item[0],{size:8,weight:700,color:"#168f8a"})}${t(1227,435+i*58,item[1],{size:8,weight:700})}${t(1227,451+i*58,item[2],{size:7,color:"#819198"})}`).join("")}${button(1152,659,382,"Ver tablero de hospitalización",true)}`
});

const titleForInitial = "01-veterinario-inicio-mi-jornada";
const initialSvg = join(outputDirectory, "veterinario-inicial-mi-jornada.svg");
if (!existsSync(initialSvg)) throw new Error(`Falta el mockup inicial requerido: ${initialSvg}`);
const initialData = { name: titleForInitial, title: "Veterinario · Inicio · Mi jornada", filename: `${titleForInitial}.svg`, png: `${titleForInitial}.png` };
const initialMarkup = (await import("node:fs/promises")).readFile(initialSvg, "utf8");
writeFileSync(join(outputDirectory, initialData.filename), await initialMarkup, "utf8");
files.unshift(initialData);

for (const item of files) {
  const pngPath = join(outputDirectory, item.png);
  const svgUrl = pathToFileURL(join(outputDirectory, item.filename)).href;
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${chromeProfile}`, `--screenshot=${pngPath}`, "--window-size=1600,1000", svgUrl], { stdio: "ignore" });
}

const columns = 3;
const cellWidth = 514;
const cellHeight = 330;
const rows = Math.ceil(files.length / columns);
let indexContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${rows * cellHeight + 105}" viewBox="0 0 1600 ${rows * cellHeight + 105}" role="img" aria-labelledby="title"><title id="title">Veterinaria · Mockups del rol veterinario</title><rect width="100%" height="100%" fill="#eef4f5"/><text x="30" y="46" font-family="Segoe UI,Arial,sans-serif" font-size="24" font-weight="700" fill="#263e49">Veterinaria · Mockups del rol veterinario</text><text x="30" y="72" font-family="Segoe UI,Arial,sans-serif" font-size="12" fill="#71848a">Fase 1 · Vistas operativas, expediente clínico y flujo SOAP · Hospitalización proyectada Fase 2</text>`;
for (let i = 0; i < files.length; i++) {
  const item = files[i];
  const x = 25 + (i % columns) * cellWidth;
  const y = 94 + Math.floor(i / columns) * cellHeight;
  indexContent += `<text x="${x}" y="${y + 15}" font-family="Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" fill="#27424f">${String(i + 1).padStart(2, "0")} · ${esc(item.title.replace("Veterinario · ", ""))}</text><image href="${item.png}" x="${x}" y="${y + 25}" width="490" height="291" preserveAspectRatio="xMidYMid meet"/>`;
}
indexContent += "</svg>";
const indexSvgPath = join(outputDirectory, "00-indice-mockups-veterinario.svg");
const indexPngPath = join(outputDirectory, "00-indice-mockups-veterinario.png");
writeFileSync(indexSvgPath, indexContent, "utf8");
const indexUrl = pathToFileURL(indexSvgPath).href;
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${chromeProfile}`, `--screenshot=${indexPngPath}`, `--window-size=1600,${rows * cellHeight + 105}`, indexUrl], { stdio: "ignore" });
rmSync(chromeProfile, { recursive: true, force: true });
console.log(`Generated ${files.length} veterinary mockups and index in ${outputDirectory}`);

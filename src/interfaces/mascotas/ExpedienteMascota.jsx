import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { mascotas, vacunas } from "../../data/demoData.js";
import { DemoNotice, PageHeader, PetAvatar, Panel, StatusBadge } from "../../components/InterfazUI.jsx";
import "./mascotas.css";

const tabs = [
  { label: "Resumen", suffix: "" },
  { label: "Historial clínico", suffix: "/historial" },
  { label: "Recetas", suffix: "/recetas" },
  { label: "Carnet digital", suffix: "/carnet" },
];

export default function ExpedienteMascota({ pestañaInicial = "Resumen" }) {
  const { id } = useParams();
  const location = useLocation();
  const pet = mascotas.find((item) => item.id === id) ?? mascotas[0];
  const activeTab = tabs.find((tab) => tab.suffix && location.pathname.endsWith(tab.suffix))?.label ?? pestañaInicial;
  const [notice, setNotice] = useState("");

  return (
    <div className="interface-page">
      <PageHeader eyebrow={<Link to="/cliente/mascotas">Mis mascotas</Link>} title={`Expediente de ${pet.nombre}`} description={`${pet.especie} · ${pet.raza} · ${pet.edad} · ${pet.peso}`} />
      <section className="record-pet-banner"><PetAvatar pet={pet} /><div><strong>{pet.nombre}</strong><span>{pet.especie} · {pet.raza} · {pet.edad} · {pet.peso}</span></div><StatusBadge status="SALUDABLE" /><Link to={`/cliente/mascotas/${pet.id}/editar`}>Editar ficha</Link></section>
      <nav className="record-tabs" aria-label="Pestañas del expediente">
        {tabs.map((tab) => <Link className={activeTab === tab.label ? "record-tab-active" : ""} key={tab.label} to={`/cliente/mascotas/${pet.id}${tab.suffix}`}>{tab.label}</Link>)}
      </nav>

      {activeTab === "Resumen" && <div className="record-summary-grid">
        <Panel title={`Ficha de ${pet.nombre}`}><dl className="record-facts">{[["Especie", pet.especie], ["Raza", pet.raza], ["Peso", pet.peso], ["Sexo", pet.sexo], ["Esterilización", pet.esterilizacion]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></Panel>
        <Panel title="Antecedentes clínicos"><div className="history-item"><strong>Alergias</strong><span>Polen · reacción leve</span></div><div className="history-item"><strong>Enfermedad crónica</strong><span>Ninguna registrada</span></div><div className="history-item"><strong>Cirugía previa</strong><span>Esterilización · 2024</span></div></Panel>
        <Panel className="record-wide" title="Última consulta" action={<Link className="text-link" to={`/cliente/mascotas/${pet.id}/historial`}>Ver historial <span aria-hidden="true">→</span></Link>}><strong>Consulta general · 10 de junio de 2026</strong><p className="muted-copy">Diagnóstico: buen estado general. Se recomienda control de peso.</p></Panel>
      </div>}

      {activeTab === "Historial clínico" && <div className="record-summary-grid">
        <Panel title="Consultas SOAP">
          {[["10 JUN 2026", "Revisión general", "Buen estado de salud"], ["14 FEB 2026", "Molestia digestiva", "Irritación leve"], ["22 OCT 2025", "Vacunación anual", "Sin reacciones"]].map(([date, reason, diagnosis]) => <article className="soap-entry" key={date}><span>{date}</span><strong>{reason}</strong><p>Motivo y evaluación registrados en consulta.</p><p><b>Diagnóstico:</b> {diagnosis}</p><p><b>Plan:</b> seguimiento y cuidados en casa.</p></article>)}
        </Panel>
        <Panel title="Evolución del peso"><div className="weight-chart"><div className="weight-grid" /><svg viewBox="0 0 360 200" role="img" aria-label="Gráfica de evolución de peso"><polyline points="12,155 88,125 164,137 240,84 336,48" /><circle cx="12" cy="155" r="5" /><circle cx="88" cy="125" r="5" /><circle cx="164" cy="137" r="5" /><circle cx="240" cy="84" r="5" /><circle cx="336" cy="48" r="5" /></svg><div className="chart-labels"><span>ENE</span><span>MAR</span><span>ABR</span><span>MAY</span><span>JUN</span></div></div></Panel>
      </div>}

      {activeTab === "Recetas" && <div className="recipe-list">{[["10 JUN 2026", "Suplemento vitamínico", "Dra. Beatriz Jiménez", "1 tableta cada 24 horas · 14 días"], ["14 FEB 2026", "Probiótico felino", "Dra. Andrea Ramírez", "1 sobre cada 12 horas · 5 días"]].map(([date, name, doctor, instructions]) => <Panel className="recipe-card" key={date}><span className="recipe-icon"><FileText size={19} /></span><div><h2>{name}</h2><p>{date} · {doctor}</p><strong>Indicaciones</strong><p>{instructions}</p><small>Administrar con alimento. Conservar en lugar fresco.</small></div><button className="secondary-button" onClick={() => setNotice("El PDF de la receta estará disponible al conectar el almacenamiento de documentos.")} type="button"><Download size={15} /> Descargar PDF</button></Panel>)}</div>}

      {activeTab === "Carnet digital" && <Panel title="Vacunación y desparasitación" className="vaccine-table-panel"><div className="responsive-table"><table><thead><tr><th>Biológico</th><th>Lote</th><th>Aplicación</th><th>Próxima dosis</th><th>Estado</th></tr></thead><tbody>{vacunas.map((vaccine) => <tr key={vaccine.lote}><td>{vaccine.nombre}</td><td>{vaccine.lote}</td><td>{vaccine.aplicada}</td><td>{vaccine.proxima}</td><td><StatusBadge status={vaccine.estado} /></td></tr>)}</tbody></table></div></Panel>}
      {notice && <DemoNotice>{notice}</DemoNotice>}
    </div>
  );
}

import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ClipboardList,
  CircleHelp,
  CreditCard,
  Heart,
  LayoutDashboard,
  MapPin,
  Menu,
  PawPrint,
  Plus,
  Settings,
  Stethoscope,
  Syringe,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { label: "Inicio", icon: LayoutDashboard, active: true },
  { label: "Mis citas", icon: CalendarDays },
  { label: "Mis mascotas", icon: PawPrint },
  { label: "Mis pagos", icon: CreditCard },
  { label: "Clínica y Médicos", icon: Stethoscope },
  { label: "Historial clínico", icon: ClipboardList },
];

const pets = [
  {
    name: "Luna",
    detail: "Gata · 3 años",
    type: "cat",
    color: "peach",
  },
  {
    name: "Toby",
    detail: "Perro · 5 años",
    type: "dog",
    color: "lavender",
  },
];

function InicioCliente() {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPet, setSelectedPet] = useState("Luna");
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const appointmentDay = tomorrow.toLocaleDateString("es-MX", { day: "2-digit" });
  const appointmentMonth = tomorrow.toLocaleDateString("es-MX", { month: "short" }).replace(".", "").toUpperCase();

  const closeAppointment = () => {
    setAppointmentOpen(false);
    setAppointmentConfirmed(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-header">
          <a className="brand" href="#inicio" aria-label="Veterinaria, inicio">
            <span className="brand-mark">
              <PawPrint size={21} strokeWidth={2.2} />
            </span>
            <span>Veterinaria</span>
          </a>
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            title={sidebarCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>
        <nav className="main-nav" aria-label="Navegación principal">
          {navigation.map(({ label, icon: Icon, active, count }) => (
            <a
              className={`nav-link ${active ? "nav-link-active" : ""}`}
              href={active ? "#inicio" : "#"}
              key={label}
              title={sidebarCollapsed ? label : undefined}
              onClick={(event) => {
                if (!active) event.preventDefault();
                setMobileNavOpen(false);
              }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {count && <span className="nav-count">{count}</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><CircleHelp size={18} /></span>
            <div>
              <strong>¿Necesitas ayuda?</strong>
              <span>Estamos para ti y tus mascotas.</span>
              <a href="mailto:contacto@veterinaria.com">Contáctanos <ArrowRight size={13} /></a>
            </div>
          </div>
        </div>
      </aside>

      <main className={`main-area ${sidebarCollapsed ? "main-area-collapsed" : ""}`} id="inicio">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <Menu size={21} />
          </button>
          <div className="topbar-title"><span>Veterinaria</span></div>
          <div className="topbar-actions">
            <button className="icon-button notification-button" type="button" aria-label="Notificaciones">
              <Bell size={19} /><i />
            </button>
            <button className="user-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="avatar">MG</span>
              <span className="user-copy"><strong>Mariana</strong><small>Mi cuenta</small></span>
            </button>
            {menuOpen && (
              <div className="user-dropdown">
                <a href="#perfil"><Settings size={16} /> Mi perfil</a>
                <a href="#responsables"><Heart size={16} /> Responsables extra</a>
                <button type="button" onClick={() => setMenuOpen(false)}><ArrowRight size={16} /> Cerrar sesión</button>
              </div>
            )}
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <h1>¡Hola, Mariana! <span className="wave">✦</span></h1>
              <p className="welcome-subtitle">Aquí tienes un resumen de la salud y próximas actividades de tus mascotas.</p>
            </div>
          </section>

          <section className="hero-banner">
            <div className="hero-copy">
              <p className="hero-eyebrow">EL CUIDADO QUE MERECEN</p>
              <h2>Todo para su bienestar,<br />en un solo lugar.</h2>
              <p>Revisa sus citas, vacunas y expediente cuando lo necesites.</p>
            </div>
            <div className="hero-next">
              <span className="hero-paw"><PawPrint size={17} /></span>
              <span className="hero-next-copy"><small>PRÓXIMA CITA</small><strong>Mañana · 10:30 a. m.</strong><span>Luna · Consulta general</span></span>
              <button type="button" onClick={() => setAppointmentOpen(true)}>Ver mis citas <ArrowRight size={14} /></button>
            </div>
          </section>

          <section className="stats-grid" aria-label="Resumen">
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon mint"><CalendarDays size={18} /></span></div>
              <p className="stat-label">Citas próximas</p>
              <strong className="stat-value">2</strong>
              <span className="stat-foot">programadas</span>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon peach"><MapPin size={18} /></span></div>
              <p className="stat-label">Mascotas</p>
              <strong className="stat-value">2</strong>
              <span className="stat-foot">a tu cuidado</span>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon amber"><Syringe size={18} /></span></div>
              <p className="stat-label">Vacunas por revisar</p>
              <strong className="stat-value">1</strong>
              <span className="stat-foot">próxima dosis</span>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon lilac"><CreditCard size={18} /></span></div>
              <p className="stat-label">Pagos pendientes</p>
              <strong className="stat-value">$0</strong>
              <span className="stat-foot">todo al corriente</span>
            </article>
          </section>

          <section className="pets-section">
            <div className="section-title-row">
              <div><h2>Mis mascotas</h2><p>Sus perfiles y accesos rápidos a su cuidado.</p></div>
              <a className="text-link" href="#mascotas">Ver todas <ArrowRight size={15} /></a>
            </div>
            <div className="pets-dashboard-grid">
              {pets.map((pet) => (
                <article className="dashboard-pet-card" key={pet.name}>
                  <span className={`pet-illustration ${pet.color}`} role="img" aria-label={pet.type === "cat" ? "Gato" : "Perro"}>{pet.type === "cat" ? "🐱" : "🐶"}</span>
                  <div className="dashboard-pet-info">
                    <h3>{pet.name}</h3>
                    <p>{pet.detail}</p>
                    <span className="pet-health"><Activity size={13} /> Saludable</span>
                  </div>
                  <div className="dashboard-pet-links"><a href="#expediente">Ver expediente</a><a href="#carnet">Carnet de vacunas</a></div>
                </article>
              ))}
              <article className="vaccine-card">
                <div className="vaccine-heading"><span className="vaccine-alert"><Syringe size={20} /></span><span><strong>Próxima vacuna</strong><small>Toby necesita su refuerzo.</small></span></div>
                <div className="vaccine-detail"><strong>Vacuna antirrábica</strong><span>Fecha sugerida: {appointmentDay} de {tomorrow.toLocaleDateString("es-MX", { month: "long" })}</span><a href="#carnet">Ver carnet <ArrowRight size={13} /></a></div>
              </article>
            </div>
          </section>

          <section className="appointments-panel">
            <div className="section-title-row">
              <div><h2>Próximas citas</h2><p>Mantente al día con sus visitas a la clínica.</p></div>
              <a className="text-link" href="#citas">Ver todas las citas <ArrowRight size={15} /></a>
            </div>
            <div className="appointment-row">
              <div className="appointment-day"><strong>{appointmentMonth}</strong><span>{appointmentDay}</span></div>
              <div className="appointment-row-detail"><strong>Consulta general</strong><span>Luna · Dra. Beatriz Jiménez</span></div>
              <div className="appointment-row-time"><strong>10:30 a. m.</strong><span><MapPin size={12} /> Veterinaria</span></div>
              <span className="appointment-status">Pendiente</span>
            </div>
          </section>
          <footer className="page-footer"><span>Tus datos y los de tus mascotas están protegidos.</span><span>Vista previa de diseño</span></footer>
        </div>
      </main>

      {appointmentOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeAppointment();
        }}>
          <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close icon-button" type="button" onClick={closeAppointment} aria-label="Cerrar"><X size={19} /></button>
            {appointmentConfirmed ? (
              <div className="confirmation-state">
                <span className="confirmation-icon"><Check size={26} /></span>
                <p className="section-kicker">SOLICITUD LISTA</p>
                <h2 id="modal-title">¡Qué bien!</h2>
                <p>Preparamos la solicitud de cita para {selectedPet}. Muy pronto podrás elegir el horario disponible.</p>
                <button className="primary-button" type="button" onClick={closeAppointment}>Listo</button>
              </div>
            ) : (
              <>
                <p className="section-kicker">NUEVA CITA <span className="step-count">PASO 1 DE 3</span></p>
                <h2 id="modal-title">¿A quién vamos a cuidar?</h2>
                <p className="modal-description">Elige a tu mascota para comenzar a buscar el mejor horario.</p>
                <div className="modal-pet-options">
                  {pets.map((pet) => (
                    <button
                      type="button"
                      key={pet.name}
                      className={`modal-pet-option ${selectedPet === pet.name ? "modal-pet-selected" : ""}`}
                      onClick={() => setSelectedPet(pet.name)}
                    >
                      <span className={`pet-illustration modal-pet-illustration ${pet.color}`} role="img" aria-label={pet.type === "cat" ? "Gato" : "Perro"}>{pet.type === "cat" ? "🐱" : "🐶"}</span>
                      <span><strong>{pet.name}</strong><small>{pet.detail.split(" · ")[0]}</small></span>
                      <span className="radio-indicator">{selectedPet === pet.name && <span />}</span>
                    </button>
                  ))}
                </div>
                <button className="primary-button modal-next" type="button" onClick={() => setAppointmentConfirmed(true)}>Continuar <ArrowRight size={16} /></button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default InicioCliente;

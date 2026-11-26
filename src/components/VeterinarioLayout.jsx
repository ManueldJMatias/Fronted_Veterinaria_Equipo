import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  PawPrint,
  Settings,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useVeterinarioData } from "../contexts/VeterinarioDataContext.jsx";

const navigation = [
  { label: "Mi jornada", to: "/veterinario/inicio", icon: LayoutDashboard, end: true },
  { label: "Mi agenda", to: "/veterinario/agenda", icon: CalendarDays },
  { label: "Pacientes (EHR)", to: "/veterinario/pacientes", icon: PawPrint },
  { label: "Mi disponibilidad", to: "/veterinario/disponibilidad", icon: Clock3 },
  { label: "Hospitalización", to: "/veterinario/hospitalizacion", icon: ClipboardList, projected: true },
];

export default function VeterinarioLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { patients, notifications, profile, markNotificationsRead } = useVeterinarioData();
  const location = useLocation();
  const navigate = useNavigate();
  const unread = notifications.filter((item) => !item.leida).length;
  const suggestions = search.trim()
    ? patients.filter((patient) => `${patient.nombre} ${patient.propietario} ${patient.raza}`.toLocaleLowerCase("es-MX").includes(search.trim().toLocaleLowerCase("es-MX"))).slice(0, 5)
    : [];

  function openPatient(patientId) {
    setSearch("");
    setSearchOpen(false);
    navigate(`/veterinario/pacientes/${patientId}`);
  }

  return (
    <div className="app-shell veterinarian-shell">
      <aside className={`sidebar veterinarian-sidebar ${mobileNavOpen ? "sidebar-open" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link className="brand" to="/veterinario/inicio" aria-label="Veterinaria, mi jornada">
            <span className="brand-mark"><PawPrint size={21} strokeWidth={2.2} /></span>
            <span>Veterinaria</span>
          </Link>
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            title={sidebarCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>
        <span className="vet-sidebar-section-label">Área clínica</span>
        <nav className="main-nav" aria-label="Navegación veterinaria">
          {navigation.map(({ label, to, icon: Icon, end, projected }) => (
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""} ${projected ? "vet-nav-projected" : ""}`}
              end={end}
              key={to}
              onClick={() => setMobileNavOpen(false)}
              title={sidebarCollapsed ? `${label}${projected ? " · Fase 2" : ""}` : undefined}
              to={to}
            >
              <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
              {projected && !sidebarCollapsed && <small>Fase 2</small>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card veterinarian-help-card">
            <span className="help-icon"><Clock3 size={17} /></span>
            <div><strong>Turno de hoy</strong><span>08:00 a. m. – 4:00 p. m.</span><Link to="/veterinario/disponibilidad">Ver disponibilidad</Link></div>
          </div>
          <div className="vet-sidebar-user">
            <span className="avatar">{profile.iniciales}</span>
            <span><strong>{profile.nombre}</strong><small>{profile.especialidad}</small></span>
            <button type="button" aria-label="Abrir perfil profesional" title="Mi perfil" onClick={() => navigate("/veterinario/perfil")}><Settings size={16} /></button>
          </div>
        </div>
      </aside>

      <main className={`main-area veterinarian-main-area ${sidebarCollapsed ? "main-area-collapsed" : ""}`}>
        <header className="topbar veterinarian-topbar">
          <button className="icon-button mobile-menu-button" type="button" aria-label="Abrir menú" onClick={() => setMobileNavOpen((open) => !open)}>
            <Menu size={21} />
          </button>
          <div className="topbar-title"><span>Veterinaria</span></div>
          <div className="topbar-actions">
            <div className="vet-global-search">
              <label className="vet-search-control">
                <PawPrint size={16} />
                <input
                  aria-label="Buscar mascota o propietario"
                  autoComplete="off"
                  onBlur={() => window.setTimeout(() => setSearchOpen(false), 130)}
                  onChange={(event) => setSearch(event.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && suggestions[0]) openPatient(suggestions[0].id);
                    if (event.key === "Escape") setSearchOpen(false);
                  }}
                  placeholder="Buscar mascota o propietario"
                  value={search}
                />
                <kbd>⌘ K</kbd>
              </label>
              {searchOpen && search.trim() && (
                <div className="vet-search-results">
                  {suggestions.map((patient) => (
                    <button key={patient.id} onMouseDown={(event) => event.preventDefault()} onClick={() => openPatient(patient.id)} type="button">
                      <span className="vet-search-avatar">{patient.emoji}</span>
                      <span><strong>{patient.nombre}</strong><small>{patient.propietario} · {patient.especie}</small></span>
                    </button>
                  ))}
                  {suggestions.length === 0 && <p>No se encontraron pacientes.</p>}
                </div>
              )}
            </div>
            <div className="topbar-popover-anchor">
              <button
                className="icon-button notification-button"
                type="button"
                aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ""}`}
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setUserMenuOpen(false);
                }}
              >
                <Bell size={19} />
                {unread > 0 && <i />}
              </button>
              {notificationsOpen && (
                <div className="notification-popover vet-notification-popover">
                  <div className="notification-popover-heading"><strong>Notificaciones</strong><span>{unread} nuevas</span></div>
                  {notifications.slice(0, 3).map((notification) => (
                    <Link
                      className="notification-popover-item"
                      key={notification.id}
                      onClick={() => {
                        markNotificationsRead();
                        setNotificationsOpen(false);
                        if (notification.citaId) navigate(`/veterinario/citas/${notification.citaId}`);
                      }}
                      to={notification.citaId ? `/veterinario/citas/${notification.citaId}` : "/veterinario/notificaciones"}
                    >
                      <span className={`notification-dot ${notification.leida ? "vet-read-dot" : ""}`} />
                      <span><strong>{notification.titulo}</strong><small>{notification.mensaje}</small><small>{notification.fecha}</small></span>
                    </Link>
                  ))}
                  <Link className="notification-popover-all" onClick={() => { markNotificationsRead(); setNotificationsOpen(false); }} to="/veterinario/notificaciones">Ver todas las notificaciones</Link>
                </div>
              )}
            </div>
            <div className="topbar-popover-anchor">
              <button
                className="user-menu-button"
                type="button"
                aria-expanded={userMenuOpen}
                onClick={() => {
                  setUserMenuOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
              >
                <span className="avatar">{profile.iniciales}</span>
                <span className="user-copy"><strong>{profile.displayName}</strong><small>Cuenta profesional</small></span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/veterinario/perfil" onClick={() => setUserMenuOpen(false)}><Settings size={15} /> Mi perfil profesional</Link>
                  <button type="button" onClick={() => navigate("/login")}><LogOut size={15} /> Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="page-content veterinarian-page-content" key={location.pathname}><Outlet /></div>
      </main>
    </div>
  );
}

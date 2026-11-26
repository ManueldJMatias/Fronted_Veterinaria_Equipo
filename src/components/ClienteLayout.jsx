import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Heart,
  LayoutDashboard,
  Menu,
  PawPrint,
  Settings,
  Stethoscope,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { notificaciones } from "../data/demoData.js";

const navigation = [
  { label: "Inicio", to: "/cliente/inicio", icon: LayoutDashboard, end: true },
  { label: "Mis citas", to: "/cliente/citas", icon: CalendarDays },
  { label: "Mis mascotas", to: "/cliente/mascotas", icon: PawPrint },
  { label: "Mis pagos", to: "/cliente/pagos", icon: CreditCard },
  { label: "Clínica y Médicos", to: "/cliente/clinica", icon: Stethoscope },
  { label: "Historial clínico", to: "/cliente/mascotas/luna/historial", icon: ClipboardList },
];

function NotificationPopover({ onClose }) {
  return (
    <div className="notification-popover">
      <div className="notification-popover-heading">
        <strong>Notificaciones</strong>
        <span>{notificaciones.length} avisos</span>
      </div>
      {notificaciones.slice(0, 3).map((notification) => (
        <Link
          to={notification.destino}
          className="notification-popover-item"
          key={notification.id}
          onClick={onClose}
        >
          <span className="notification-dot" />
          <span><strong>{notification.titulo}</strong><small>{notification.mensaje}</small><small>{notification.fecha}</small></span>
        </Link>
      ))}
      <Link to="/cliente/notificaciones" className="notification-popover-all" onClick={onClose}>Ver todas las notificaciones</Link>
    </div>
  );
}

export default function ClienteLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link className="brand" to="/cliente/inicio" aria-label="Veterinaria, inicio">
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
        <nav className="main-nav" aria-label="Navegación principal">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              end={end}
              key={to}
              onClick={() => setMobileNavOpen(false)}
              title={sidebarCollapsed ? label : undefined}
              to={to}
            >
              <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><CircleHelp size={18} /></span>
            <div><strong>¿Necesitas ayuda?</strong><span>Estamos para ti y tus mascotas.</span><a href="mailto:contacto@veterinaria.com">Contáctanos</a></div>
          </div>
        </div>
      </aside>

      <main className={`main-area ${sidebarCollapsed ? "main-area-collapsed" : ""}`}>
        <header className="topbar">
          <button className="icon-button mobile-menu-button" type="button" aria-label="Abrir menú" onClick={() => setMobileNavOpen((open) => !open)}>
            <Menu size={21} />
          </button>
          <div className="topbar-title"><span>Veterinaria</span></div>
          <div className="topbar-actions">
            <div className="topbar-popover-anchor">
              <button
                className="icon-button notification-button"
                type="button"
                aria-label="Notificaciones"
                aria-expanded={notificationsOpen}
                onClick={() => { setNotificationsOpen((open) => !open); setUserMenuOpen(false); }}
              >
                <Bell size={19} /><i />
              </button>
              {notificationsOpen && <NotificationPopover onClose={() => setNotificationsOpen(false)} />}
            </div>
            <div className="topbar-popover-anchor">
              <button
                className="user-menu-button"
                type="button"
                aria-expanded={userMenuOpen}
                onClick={() => { setUserMenuOpen((open) => !open); setNotificationsOpen(false); }}
              >
                <span className="avatar">MG</span><span className="user-copy"><strong>Mariana</strong><small>Mi cuenta</small></span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/cliente/perfil" onClick={() => setUserMenuOpen(false)}><Settings size={16} /> Mi perfil</Link>
                  <Link to="/cliente/perfil/responsables" onClick={() => setUserMenuOpen(false)}><Heart size={16} /> Responsables extra</Link>
                  <button type="button" onClick={() => { setUserMenuOpen(false); navigate("/login"); }}><Settings size={16} /> Volver al acceso</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="page-content" key={location.pathname}><Outlet /></div>
      </main>
    </div>
  );
}

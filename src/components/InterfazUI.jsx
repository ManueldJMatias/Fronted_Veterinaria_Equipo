import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="section-kicker">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  const normalized = status?.toUpperCase() ?? "PENDIENTE";
  const className = normalized.includes("COMPLET") || normalized === "PAGADA" || normalized === "CONFIRMADA" || normalized === "ACTIVA" || normalized === "DISPONIBLE" || normalized === "ESTABLE" || normalized === "AL DÍA"
    ? "status-success"
    : normalized.includes("ATENCION") || normalized.includes("SALA")
      ? "status-progress"
      : normalized === "CANCELADA"
        ? "status-muted"
        : "status-pending";

  return <span className={`status-badge ${className}`}>{normalized.replaceAll("_", " ")}</span>;
}

export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`ui-panel ${className}`}>
      {(title || action) && (
        <div className="ui-panel-heading">
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function TextLink({ to, children }) {
  return <Link className="text-link" to={to}>{children}<ArrowRight size={14} /></Link>;
}

export function PetAvatar({ pet, size = "normal" }) {
  return (
    <span className={`ui-pet-avatar ${pet.color} ${size === "small" ? "ui-pet-avatar-small" : ""}`} role="img" aria-label={pet.especie}>
      {pet.emoji}
    </span>
  );
}

export function DemoNotice({ children }) {
  return <p className="demo-notice" role="status">{children}</p>;
}

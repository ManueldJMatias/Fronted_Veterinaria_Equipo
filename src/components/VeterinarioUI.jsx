import { AlertTriangle, PawPrint } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "./InterfazUI.jsx";

export { PageHeader as VeterinarioPageHeader, Panel as VeterinarioPanel, StatusBadge as EstadoVeterinario };

export function AnimalAvatar({ patient, size = "normal" }) {
  return (
    <span className={`vet-animal-avatar ${patient.color ?? "mint"} ${size === "small" ? "vet-animal-avatar-small" : ""}`} role="img" aria-label={patient.especie}>
      {patient.emoji}
    </span>
  );
}

export function AlertaClinica({ children, tone = "warning" }) {
  return (
    <div className={`vet-clinical-alert ${tone}`} role="note">
      <AlertTriangle size={16} />
      <span>{children}</span>
    </div>
  );
}

export function EmptyPatients({ children = "No hay pacientes para mostrar." }) {
  return <div className="vet-empty-state"><PawPrint size={21} /><p>{children}</p></div>;
}

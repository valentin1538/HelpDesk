import { STATUS_LABELS } from "../../constants/labels.js";

/** Statut d'un ticket : pastille colorée (Ouvert, En cours, En attente, Résolu, Fermé). */
export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-dot badge-status-${status}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

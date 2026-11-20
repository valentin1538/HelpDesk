import { ChevronDown, ChevronUp, ChevronsUp, Equal } from 'lucide-react';
import { PRIORITY_LABELS } from '../../constants/labels.js';

// Icônes de priorité à la manière de Jira : plus la flèche monte, plus c'est urgent.
const ICONS = { low: ChevronDown, medium: Equal, high: ChevronUp, critical: ChevronsUp };

/** Priorité d'un ticket : icône colorée + libellé. */
export default function PriorityBadge({ priority, showLabel = true }) {
  const Icon = ICONS[priority] ?? Equal;
  const label = PRIORITY_LABELS[priority] ?? priority;
  return (
    <span className={`priority priority-${priority}`} title={`Priorité ${label.toLowerCase()}`}>
      <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </span>
  );
}

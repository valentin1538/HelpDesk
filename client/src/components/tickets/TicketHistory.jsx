import { ArrowRight } from 'lucide-react';
import { PRIORITY_LABELS } from '../../constants/labels.js';
import { formatDateTime, formatRelative, fullName } from '../../utils/format.js';
import Avatar from '../ui/Avatar.jsx';
import StatusBadge from './StatusBadge.jsx';

/** Phrase lisible pour une entrée d'historique (RG5). */
function describe(entry, people) {
  const by = fullName(entry.by);
  const person = (id) => fullName(people[id]);
  switch (entry.action) {
    case 'created':
      return <>{by} a déclaré l’incident</>;
    case 'status_changed':
      return (
        <>
          {by} a changé le statut
          <span className="history-change">
            <StatusBadge status={entry.from} />
            <ArrowRight size={14} aria-label="vers" />
            <StatusBadge status={entry.to} />
          </span>
        </>
      );
    case 'priority_changed':
      return (
        <>
          {by} a changé la priorité : {PRIORITY_LABELS[entry.from]} → {PRIORITY_LABELS[entry.to]}
        </>
      );
    case 'assigned':
      if (!entry.to) return <>{by} a retiré l’assignation</>;
      if (entry.to === entry.by?._id) return <>{by} a pris en charge le ticket</>;
      return (
        <>
          {by} a assigné le ticket à <strong>{person(entry.to)}</strong>
        </>
      );
    default:
      return <>{by}</>;
  }
}

/** Historique du ticket (frise chronologique). */
export default function TicketHistory({ history, people }) {
  return (
    <ol className="history">
      {history.map((entry, index) => (
        <li key={`${entry.at}-${index}`} className="history-item">
          <Avatar firstName={entry.by?.firstName} lastName={entry.by?.lastName} size={28} />
          <div className="history-content">
            <p className="history-text">{describe(entry, people)}</p>
            <time className="history-time" dateTime={entry.at} title={formatDateTime(entry.at)}>
              {formatRelative(entry.at)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}

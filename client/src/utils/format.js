const dateTime = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
const relative = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

const UNITS = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/** 20 nov. 2026, 14:32 */
export function formatDateTime(value) {
  return value ? dateTime.format(new Date(value)) : '—';
}

/** « il y a 3 heures », « hier », « à l’instant » */
export function formatRelative(value, now = Date.now()) {
  if (!value) return '—';
  const seconds = (new Date(value).getTime() - now) / 1000;
  if (Math.abs(seconds) < 45) return 'à l’instant';
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return relative.format(Math.round(seconds / 60), 'minute');
}

/** Prénom Nom */
export const fullName = (person) => (person ? `${person.firstName} ${person.lastName}` : '—');

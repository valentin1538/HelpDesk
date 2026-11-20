/**
 * État vide : quand une liste n'a pas encore de contenu.
 * Explique la situation et propose l'action suivante (bonne pratique UX : jamais d'écran « mort »).
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon" aria-hidden="true">
          <Icon size={28} strokeWidth={1.75} />
        </div>
      )}
      <h2 className="empty-state-title">{title}</h2>
      {description && <p className="empty-state-description">{description}</p>}
      {children}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

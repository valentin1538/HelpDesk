/**
 * Pastille de texte.
 *   tone : 'neutral' | 'accent' ou une classe dédiée (ex. 'status-open')
 *   dot  : affiche un point coloré devant le texte
 */
export default function Badge({
  tone = "neutral",
  dot = false,
  children,
  className = "",
}) {
  return (
    <span
      className={`badge badge-${tone}${dot ? " badge-dot" : ""} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

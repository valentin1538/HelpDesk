/** Carte : surface blanche arrondie à ombre douce. */
export default function Card({
  as: Component = "section",
  title,
  actions,
  interactive = false,
  className = "",
  bodyClassName = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`card${interactive ? " card-interactive" : ""} ${className}`.trim()}
      {...props}
    >
      {(title || actions) && (
        <header className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {actions}
        </header>
      )}
      <div className={`card-body ${bodyClassName}`.trim()}>{children}</div>
    </Component>
  );
}

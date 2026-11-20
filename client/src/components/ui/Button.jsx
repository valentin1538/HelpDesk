import Spinner from './Spinner.jsx';

/**
 * Bouton du design system.
 *   variant : 'primary' | 'secondary' | 'ghost' | 'danger'
 *   size    : 'sm' | 'md' | 'lg'
 *   as      : composant à rendre (ex. Link de react-router) — par défaut <button>
 *   icon    : composant d'icône Lucide affiché avant le texte
 *   loading : affiche un indicateur et désactive le bouton
 */
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconOnly = false,
  block = false,
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    block && 'btn-block',
    iconOnly && 'btn-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isButton = Component === 'button';
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <Component
      className={classes}
      {...(isButton && { type: props.type ?? 'button', disabled: disabled || loading })}
      {...(!isButton && (disabled || loading) && { 'aria-disabled': true })}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : Icon && <Icon size={iconSize} strokeWidth={2} aria-hidden="true" />}
      {children}
    </Component>
  );
}

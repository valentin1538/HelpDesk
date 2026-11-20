import { CircleAlert } from 'lucide-react';

/**
 * Champ de formulaire avec libellé, aide et message d'erreur (renvoyé par l'API dans error.details).
 *   as : 'input' (défaut) | 'textarea' | 'select' (options en children)
 *   counter : affiche « n / maxLength » sous le champ (avec maxLength)
 */
export default function FormField({
  as: Control = 'input',
  label,
  name,
  error,
  hint,
  counter = false,
  children,
  ...controlProps
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const length = String(controlProps.value ?? '').length;

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <Control
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...controlProps}
      >
        {children}
      </Control>
      <span className="field-footer">
        {error ? (
          <span id={errorId} className="field-error">
            <CircleAlert size={14} aria-hidden="true" />
            {error}
          </span>
        ) : (
          hint && (
            <span id={hintId} className="field-hint">
              {hint}
            </span>
          )
        )}
        {counter && controlProps.maxLength && (
          <span className="field-counter" aria-hidden="true">
            {length} / {controlProps.maxLength}
          </span>
        )}
      </span>
    </label>
  );
}

import { CircleAlert } from 'lucide-react';

/** Champ de formulaire avec libellé et message d'erreur (renvoyé par l'API dans error.details). */
export default function FormField({ label, name, error, hint, ...inputProps }) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...inputProps}
      />
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
    </label>
  );
}

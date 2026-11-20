/** Champ de formulaire avec libellé et message d'erreur (renvoyé par l'API dans error.details). */
export default function FormField({ label, name, error, hint, ...inputProps }) {
  const errorId = `${name}-error`;
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error ? (
        <span id={errorId} className="field-error">
          {error}
        </span>
      ) : (
        hint && <span className="field-hint">{hint}</span>
      )}
    </label>
  );
}

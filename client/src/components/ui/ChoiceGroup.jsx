import { CircleAlert } from 'lucide-react';

/**
 * Groupe de choix exclusifs (boutons radio stylés), accessible au clavier (flèches) et aux lecteurs d'écran.
 *   options : [{ value, label, description?, icon? }]
 *   variant : 'cards' (grille de cartes) | 'segmented' (barre segmentée)
 */
export default function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  hint,
  variant = 'cards',
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset
      className="choice-fieldset"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="field-label">{legend}</legend>
      <div className={`choice-${variant}`}>
        {options.map(({ value: optionValue, label, description, icon: Icon, className = '' }) => (
          <label key={optionValue} className={`choice ${className}`.trim()}>
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
            />
            <span className="choice-body">
              {Icon && (
                <Icon className="choice-icon" size={20} strokeWidth={1.9} aria-hidden="true" />
              )}
              <span className="choice-label">{label}</span>
              {description && <span className="choice-description">{description}</span>}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <span id={errorId} className="field-error">
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </span>
      ) : (
        hint && <span className="field-hint">{hint}</span>
      )}
    </fieldset>
  );
}

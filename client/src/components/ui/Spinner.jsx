/** Indicateur de chargement. `large` pour le chargement d'une page entière. */
export default function Spinner({ large = false, label = 'Chargement' }) {
  return (
    <span className={`spinner${large ? ' spinner-lg' : ''}`} role="status" aria-label={label} />
  );
}

/** Chargement d'une page (ex. vérification de la session). */
export function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner large />
    </div>
  );
}

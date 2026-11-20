import { useId } from 'react';

/**
 * Logo Opale : squircle irisé (reflets d'une opale) + anneau « O » + éclat (clarté).
 * Les identifiants de dégradé sont uniques (useId) pour afficher plusieurs logos sur une même page.
 */
export function LogoMark({ size = 32, className }) {
  const id = useId();
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Opale"
    >
      <defs>
        <linearGradient id={`${id}g`} x1="6" y1="2" x2="60" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8FD3FE" />
          <stop offset=".52" stopColor="#A99BFB" />
          <stop offset="1" stopColor="#F3A7D6" />
        </linearGradient>
        <radialGradient
          id={`${id}h`}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(30 0 0 30 18 12)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${id}g)`} />
      <rect width="64" height="64" rx="18" fill={`url(#${id}h)`} />
      <circle cx="30" cy="34" r="13" stroke="#fff" strokeWidth="5.5" />
      <path
        fill="#fff"
        d="M46 11c.6 3.6 2.7 5.6 6.2 6.2-3.5.6-5.6 2.6-6.2 6.2-.6-3.6-2.6-5.6-6.2-6.2 3.6-.6 5.6-2.6 6.2-6.2Z"
      />
    </svg>
  );
}

/** Logo complet : symbole + nom. */
export default function Logo({ size = 32, subtitle }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-text">
        <span className="logo-name">Opale</span>
        {subtitle && <span className="logo-subtitle">{subtitle}</span>}
      </span>
    </span>
  );
}

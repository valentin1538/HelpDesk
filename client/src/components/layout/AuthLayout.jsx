import { MessagesSquare, Radio, Zap } from 'lucide-react';
import Logo from '../brand/Logo.jsx';

const FEATURES = [
  { icon: Zap, text: 'Déclarez un incident en moins d’une minute' },
  { icon: Radio, text: 'Suivez son avancement en temps réel' },
  { icon: MessagesSquare, text: 'Échangez avec le support au même endroit' },
];

/** Écrans de connexion / inscription : panneau de marque (gauche) + formulaire (droite). */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-brand" aria-hidden="true">
        <Logo size={40} subtitle="Service desk" />
        <div>
          <p className="auth-brand-title">Le support IT, tout en clarté.</p>
          <p className="auth-brand-text">
            Une seule place pour déclarer, suivre et résoudre les incidents informatiques de
            l’entreprise.
          </p>
          <ul className="auth-features">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="auth-feature">
                <Icon size={18} strokeWidth={1.9} />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth-brand-footer">© Opale — Mini-projet MERN, La Manu</p>
      </aside>

      <main className="auth-panel">
        <div className="auth-form">
          <header className="auth-form-header">
            <Logo size={36} />
            <h1 className="auth-form-title">{title}</h1>
            {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

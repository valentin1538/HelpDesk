import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import Logo from '../components/brand/Logo.jsx';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <main className="auth-panel" style={{ minHeight: '100vh' }}>
      <div className="empty-state">
        <Logo size={40} />
        <p className="text-gradient" style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>
          404
        </p>
        <h1 className="empty-state-title">Page introuvable</h1>
        <p className="empty-state-description">
          Cette page n’existe pas ou a été déplacée. Revenez à vos tickets pour continuer.
        </p>
        <div className="empty-state-action">
          <Button as={Link} to="/" icon={ArrowLeft}>
            Retour à l’accueil
          </Button>
        </div>
      </div>
    </main>
  );
}

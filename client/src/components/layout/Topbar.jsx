import { LogIn, Menu, Plus, Search } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import Logo from '../brand/Logo.jsx';
import Button from '../ui/Button.jsx';

/** Barre supérieure : menu (mobile), recherche (US20, à venir), action principale « Créer ». */
export default function Topbar({ onOpenMenu, menuOpen }) {
  const { status } = useAuth();

  return (
    <header className="topbar">
      <Button
        variant="ghost"
        iconOnly
        icon={Menu}
        className="topbar-menu"
        onClick={onOpenMenu}
        aria-label="Ouvrir le menu"
        aria-controls="sidebar"
        aria-expanded={menuOpen}
      />
      <Link to="/" className="topbar-brand" aria-label="Opale — accueil">
        <Logo size={28} />
      </Link>

      <div
        className="topbar-search"
        title="Recherche — bientôt disponible (US20)"
        aria-disabled="true"
      >
        <Search size={16} aria-hidden="true" />
        <span>Rechercher un ticket…</span>
        <kbd>⌘K</kbd>
      </div>

      <div className="topbar-actions">
        {status === 'anonymous' ? (
          <Button as={Link} to="/login" variant="secondary" size="sm" icon={LogIn}>
            Se connecter
          </Button>
        ) : (
          <Button as={Link} to="/tickets/new" size="sm" icon={Plus}>
            Créer un ticket
          </Button>
        )}
      </div>
    </header>
  );
}

import { LogOut, X } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { NAV_GROUPS } from '../../constants/navigation.js';
import { ROLE_LABELS } from '../../constants/labels.js';
import { useAuth } from '../../hooks/useAuth.js';
import Logo from '../brand/Logo.jsx';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';

/** Barre latérale : marque, navigation par groupes, carte de l'utilisateur connecté. */
export default function Sidebar({ open, onClose, onLogout }) {
  // `status` sert à afficher la carte utilisateur (et le bouton de déconnexion) ci-dessous :
  // sans lui, `status` désignerait la globale navigateur window.status ("") → carte jamais affichée.
  const { user, status } = useAuth();

  // US09 — n'afficher que les liens autorisés pour le rôle (groupes vides masqués)
  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.roles || item.roles.includes(user?.role)),
  })).filter((group) => group.items.length > 0);

  return (
    <aside id="sidebar" className="sidebar" data-open={open} aria-label="Navigation principale">
      <div className="sidebar-brand">
        <Link to="/" aria-label="Opale — accueil">
          <Logo size={34} subtitle="Service desk" />
        </Link>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          icon={X}
          className="sidebar-close"
          onClick={onClose}
          aria-label="Fermer le menu"
        />
      </div>

      <nav className="sidebar-nav">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            <ul className="nav-list">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className="nav-link" onClick={onClose}>
                    <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {status === 'authenticated' && (
        <div className="sidebar-footer">
          <Avatar firstName={user.firstName} lastName={user.lastName} size={36} />
          <div className="sidebar-user">
            <span className="sidebar-user-name">
              {user.firstName} {user.lastName}
            </span>
            <span className="sidebar-user-role">{ROLE_LABELS[user.role]}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            icon={LogOut}
            onClick={onLogout}
            aria-label="Se déconnecter"
            title="Se déconnecter"
          />
        </div>
      )}
    </aside>
  );
}

import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

const ROLE_LABELS = { user: 'Utilisateur', technician: 'Technicien', admin: 'Administrateur' };

export default function Layout() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <header className="app-header">
        <strong className="brand">HelpDesk</strong>
        <nav className="app-nav">
          <NavLink to="/tickets">Mes tickets</NavLink>
          <NavLink to="/tickets/new">Nouveau ticket</NavLink>
          <NavLink to="/queue">File technicien</NavLink>
          <NavLink to="/admin">Tableau de bord</NavLink>
        </nav>

        <div className="session">
          {status === 'authenticated' && (
            <>
              <span className="session-user">
                {user.firstName} {user.lastName}
                <span className="badge">{ROLE_LABELS[user.role]}</span>
              </span>
              <button className="btn btn-link" type="button" onClick={handleLogout}>
                Se déconnecter
              </button>
            </>
          )}
          {status === 'anonymous' && <Link to="/login">Se connecter</Link>}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}

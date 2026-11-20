import { Navigate } from 'react-router';
import { homePathFor } from '../../context/AuthContext.js';
import { useAuth } from '../../hooks/useAuth.js';

/** « / » → accueil du rôle (user → /tickets, technician → /queue, admin → /admin). */
export default function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={homePathFor(user.role)} replace />;
}

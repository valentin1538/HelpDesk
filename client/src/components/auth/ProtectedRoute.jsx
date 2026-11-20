import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth.js";
import ForbiddenPage from "../../pages/ForbiddenPage.jsx";
import { PageLoader } from "../ui/Spinner.jsx";

/**
 * Garde de route (US09).
 *  - session en cours de vérification → indicateur de chargement
 *  - non connecté → /login, en mémorisant la page demandée (LoginPage y revient après connexion)
 *  - rôle non autorisé → page « Accès réservé »
 */
export default function ProtectedRoute({ roles }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <PageLoader />;
  if (status === "anonymous") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  if (roles && !roles.includes(user.role)) return <ForbiddenPage />;
  return <Outlet />;
}

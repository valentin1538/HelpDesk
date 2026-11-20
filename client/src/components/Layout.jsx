import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import Sidebar from "./layout/Sidebar.jsx";
import Topbar from "./layout/Topbar.jsx";

/**
 * Coque de l'application (inspirée de Jira) : barre latérale + barre supérieure + contenu.
 * Sous 900 px, la barre latérale devient un tiroir ouvert par le bouton menu.
 */
export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Le tiroir se referme au clic sur un lien (Sidebar → onClose), sur le fond, ou avec Échap
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
      />
      <div
        className="sidebar-overlay"
        data-open={menuOpen}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div className="main-area">
        <Topbar menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        <main id="contenu" className="content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

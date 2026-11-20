import { useCallback, useEffect, useMemo, useState } from 'react';
import http, { TOKEN_KEY } from '../api/http.js';
import { AuthContext } from './AuthContext.js';

/**
 * Gère la session : le token JWT est conservé dans localStorage (clé partagée avec l'instance axios),
 * l'utilisateur courant est rechargé via GET /api/auth/me au démarrage de l'application.
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() =>
    localStorage.getItem(TOKEN_KEY) ? 'loading' : 'anonymous',
  );

  // Restauration de la session après un rechargement de la page
  useEffect(() => {
    if (status !== 'loading') return;
    let cancelled = false;
    http
      .get('/auth/me')
      .then(({ data }) => {
        if (cancelled) return;
        setUser(data.user);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_KEY); // token expiré ou compte désactivé
        setStatus('anonymous');
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  const openSession = useCallback(({ token, user: loggedUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedUser);
    setStatus('authenticated');
    return loggedUser;
  }, []);

  const login = useCallback(
    async (email, password) =>
      openSession((await http.post('/auth/login', { email, password })).data),
    [openSession],
  );

  const register = useCallback(
    async (form) => openSession((await http.post('/auth/register', form)).data),
    [openSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { createContext } from 'react';

/**
 * Contexte d'authentification (US01). Valeur fournie par <AuthProvider> :
 *   { user, status, login, register, logout }
 *   status : 'loading' (session en cours de vérification) | 'authenticated' | 'anonymous'
 * À lire avec le hook useAuth().
 */
export const AuthContext = createContext(null);

/** Page d'accueil selon le rôle, après connexion. */
export const HOME_BY_ROLE = Object.freeze({
  user: '/tickets',
  technician: '/queue',
  admin: '/admin',
});

export const homePathFor = (role) => HOME_BY_ROLE[role] ?? '/tickets';

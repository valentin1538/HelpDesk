import { User } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

/**
 * Authentification : vérifie le JWT (Authorization: Bearer <token>) et charge l'utilisateur dans req.user.
 *  - token absent, mal formé, invalide ou expiré → 401
 *  - utilisateur supprimé ou compte désactivé (RG8) → 401, même avec un token encore valide
 *
 * Nécessaire à US01 (GET /api/auth/me). Le contrôle des rôles (requireRole) relève de US09.
 */
export async function authenticate(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw AppError.unauthorized('Authentification requise');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    const expired = err.name === 'TokenExpiredError';
    throw new AppError(
      401,
      expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
      expired ? 'Session expirée, reconnectez-vous' : 'Token invalide',
    );
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw AppError.unauthorized('Compte introuvable ou désactivé');
  }

  req.user = user;
  next();
}

/**
 * Autorisation par rôle (US09). À placer APRÈS authenticate :
 *   router.get('/stats', authenticate, requireRole('admin'), controller.stats);
 * Le rôle vient de req.user (rechargé par authenticate) : pas de requête supplémentaire.
 *  - pas d'utilisateur (authenticate oublié) → 401
 *  - rôle non autorisé → 403 FORBIDDEN
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) throw AppError.unauthorized('Authentification requise');
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden(`Accès réservé : ${roles.join(', ')}`);
    }
    next();
  };
}
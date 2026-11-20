import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Contrat JWT partagé (planning, « Contrats partagés ») :
 *   en-tête  Authorization: Bearer <token>
 *   charge   { sub: <userId>, role }
 * Signé en HMAC-SHA256 avec JWT_SECRET.
 */
export function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.jwtExpiresIn,
  });
}

/** Renvoie la charge décodée, ou lève une erreur si le token est invalide / expiré. */
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
}

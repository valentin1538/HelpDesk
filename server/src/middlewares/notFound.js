import { AppError } from '../utils/AppError.js';

// Toute requête qui n'a trouvé aucune route arrive ici.
export function notFound(req, res, next) {
  next(AppError.notFound(`Route introuvable : ${req.method} ${req.originalUrl}`));
}

import mongoose from 'mongoose';
import { isProduction } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Traduit toute erreur en réponse JSON au format unique :
 *   { "error": { "code": "NOT_FOUND", "message": "...", "details"?: ... } }
 *
 * Express 5 transmet automatiquement ici les erreurs levées dans les handlers async
 * (plus besoin de try/catch ni d'asyncHandler).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const error = normalize(err);

  if (error.status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details !== undefined && { details: error.details }),
    },
  });
}

function normalize(err) {
  if (err instanceof AppError) return err;

  // Validation Mongoose (required, enum, minlength…) → 400 avec le détail par champ
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message]),
    );
    return new AppError(400, 'VALIDATION_ERROR', 'Données invalides', details);
  }

  // Modification concurrente d'un même document (verrou optimiste)
  if (err instanceof mongoose.Error.VersionError) {
    return new AppError(
      409,
      'CONCURRENT_UPDATE',
      "Ce ticket vient d'être modifié par quelqu'un d'autre, rechargez-le",
    );
  }

  // ObjectId mal formé dans l'URL (ex. /api/tickets/abc)
  if (err instanceof mongoose.Error.CastError) {
    return new AppError(400, 'INVALID_ID', `Identifiant invalide : ${err.value}`);
  }

  // Index unique violé (ex. email déjà utilisé)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return new AppError(
      409,
      'DUPLICATE',
      `Valeur déjà utilisée : ${fields.join(', ')}`,
      err.keyValue,
    );
  }

  // Corps JSON illisible ou trop volumineux (express.json)
  if (err.type === 'entity.parse.failed') {
    return new AppError(400, 'INVALID_JSON', 'Corps de requête JSON invalide');
  }
  if (err.type === 'entity.too.large') {
    return new AppError(413, 'PAYLOAD_TOO_LARGE', 'Corps de requête trop volumineux');
  }

  // Erreur inattendue : on ne divulgue pas le détail en production
  return new AppError(
    500,
    'INTERNAL_ERROR',
    isProduction ? 'Erreur interne du serveur' : err.message || 'Erreur interne du serveur',
  );
}

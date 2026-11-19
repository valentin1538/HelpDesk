/**
 * Erreur métier « attendue », transformée en réponse JSON par le middleware errorHandler :
 *   { "error": { "code": "...", "message": "...", "details": ... } }
 *
 * Usage dans un contrôleur ou un service :
 *   throw AppError.notFound('Ticket introuvable');
 *   throw new AppError(409, 'INVALID_TRANSITION', 'Transition de statut non autorisée');
 */
export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message = 'Requête invalide', details) {
    return new AppError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Authentification requise') {
    return new AppError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Accès interdit') {
    return new AppError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Ressource introuvable') {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static conflict(message = 'Conflit', code = 'CONFLICT') {
    return new AppError(409, code, message);
  }
}

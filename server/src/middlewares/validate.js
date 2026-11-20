import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

/**
 * À placer après une liste de règles express-validator.
 * En cas d'échec : 400 VALIDATION_ERROR avec le premier message par champ (même format que Mongoose).
 *   router.post('/register', registerRules, validate, controller)
 */
export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = {};
  for (const error of result.array()) {
    if (error.type === 'field' && !details[error.path]) details[error.path] = error.msg;
  }
  next(new AppError(400, 'VALIDATION_ERROR', 'Données invalides', details));
}

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as controller from '../controllers/commentController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

/**
 * US06 — Commentaires d'un ticket, montés sur /api/tickets/:id/comments.
 * mergeParams : l'identifiant du ticket vient du chemin de montage.
 * Les droits (propriétaire / support) et les règles RG6 / RG7 sont dans le service,
 * car ils dépendent du ticket et non du seul rôle.
 */
const router = Router({ mergeParams: true });

const idRule = param('id').isMongoId().withMessage('Identifiant de ticket invalide');

router.get(
  '/',
  authenticate,
  idRule,
  query('page').optional().isInt({ min: 1 }).withMessage('page doit être un entier ≥ 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit doit être un entier entre 1 et 50'),
  validate,
  controller.list,
);

router.post(
  '/',
  authenticate,
  idRule,
  body('content')
    .isString()
    .withMessage('Le commentaire est requis')
    .trim()
    .notEmpty()
    .withMessage('Le commentaire ne peut pas être vide')
    .isLength({ max: 5000 })
    .withMessage('Le commentaire ne doit pas dépasser 5000 caractères'),
  // Booléen JSON strict : isBoolean() seul accepte la chaîne "false", que Boolean("false")
  // transformerait en true → un message voulu public deviendrait une note interne.
  body('isInternal')
    .optional()
    .custom((value) => typeof value === 'boolean')
    .withMessage('isInternal doit être un booléen (true ou false)'),
  validate,
  controller.create,
);

export default router;

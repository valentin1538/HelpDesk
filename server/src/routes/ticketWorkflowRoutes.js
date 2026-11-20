import { Router } from 'express';
import { body, param } from 'express-validator';
import * as controller from '../controllers/ticketWorkflowController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { STATUSES } from '../models/index.js';

/**
 * US05 — cycle de vie d'un ticket. Monté sur /api/tickets, dans un fichier à part
 * des routes CRUD (US02, US04) pour que chacun travaille sans conflit Git.
 * Les règles de rôle (RG2, RG4…) sont dans le service, car elles dépendent du ticket.
 */
const router = Router();

const idRule = param('id').isMongoId().withMessage('Identifiant de ticket invalide');

router.patch(
  '/:id/status',
  authenticate,
  idRule,
  body('status')
    .isIn(STATUSES)
    .withMessage(`Statut invalide (valeurs possibles : ${STATUSES.join(', ')})`),
  validate,
  controller.changeStatus,
);

router.patch(
  '/:id/assign',
  authenticate,
  idRule,
  body('assignedTo')
    .exists()
    .withMessage('assignedTo est requis (identifiant, "me" ou null)')
    .custom((v) => v === null || v === 'me' || /^[a-f\d]{24}$/i.test(v))
    .withMessage('assignedTo doit être un identifiant, "me" ou null'),
  validate,
  controller.assign,
);

export default router;

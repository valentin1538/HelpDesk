import { Router } from 'express';
import { body } from 'express-validator';
import * as controller from '../controllers/ticketController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { CATEGORIES, PRIORITIES } from '../models/index.js';

/**
 * Routes CRUD des tickets, montées sur /api/tickets.
 * (Le cycle de vie — statut, assignation — est dans ticketWorkflowRoutes.js, US05.)
 */
const router = Router();

const createRules = [
  body('title')
    .isString()
    .withMessage('Le titre est requis')
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage('Le titre doit contenir entre 5 et 120 caractères'),
  body('description')
    .isString()
    .withMessage('La description est requise')
    .trim()
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ max: 5000 })
    .withMessage('La description ne doit pas dépasser 5000 caractères'),
  body('category').isIn(CATEGORIES).withMessage('Choisissez une catégorie'),
  body('priority').optional().isIn(PRIORITIES).withMessage('Priorité invalide'),
];

// US02 — déclarer un incident (tout utilisateur connecté)
router.post('/', authenticate, createRules, validate, controller.create);

export default router;

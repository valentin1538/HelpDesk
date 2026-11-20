import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

/** Limite les tentatives (force brute sur les mots de passe, création de comptes en masse). */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new AppError(429, 'TOO_MANY_REQUESTS', 'Trop de tentatives, réessayez dans quelques minutes'),
    );
  },
});

const registerRules = [
  body('firstName').trim().notEmpty().withMessage('Le prénom est requis').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Le nom est requis').isLength({ max: 50 }),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password')
    .isString()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Za-z]/)
    .withMessage('Le mot de passe doit contenir au moins une lettre')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre'),
  body('department').optional().trim().isLength({ max: 80 }),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password')
    .isString()
    .withMessage('Le mot de passe est requis')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
];

router.post('/register', authLimiter, registerRules, validate, authController.register);
router.post('/login', authLimiter, loginRules, validate, authController.login);
router.get('/me', authenticate, authController.me);

export default router;

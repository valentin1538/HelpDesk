import { Router } from 'express';
import { isDbConnected } from '../config/db.js';
import authRoutes from './authRoutes.js';

const router = Router();

// État de l'API et de la base (utilisé pour vérifier l'environnement et par Docker)
router.get('/health', (req, res) => {
  const db = isDbConnected() ? 'ok' : 'down';
  res.status(db === 'ok' ? 200 : 503).json({ api: 'ok', db, uptime: Math.round(process.uptime()) });
});

// Montage des routes métier — UNE ligne par US pour limiter les conflits Git :
router.use('/auth', authRoutes); // US01
// router.use('/tickets', ticketRoutes);         // US02, US04, US05
// router.use('/tickets/:id/comments', commentRoutes); // US06
// router.use('/users', userRoutes);             // US14
// router.use('/notifications', notificationRoutes); // US15
// router.use('/stats', statsRoutes);            // US10

export default router;

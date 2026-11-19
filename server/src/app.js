import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

/**
 * Application Express : décrit le traitement des requêtes, sans démarrer de serveur.
 * Le démarrage (BDD, HTTP, Socket.io, port) est dans server.js.
 */
const app = express();

// Sécurité et parsing
app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: '100kb' }));

// Routes de l'API
app.use('/api', routes);

// Fin de chaîne : 404 puis gestion centralisée des erreurs (toujours en dernier)
app.use(notFound);
app.use(errorHandler);

export default app;

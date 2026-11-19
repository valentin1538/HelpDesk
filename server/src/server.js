import http from 'node:http';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { initSocket } from './socket/index.js';
import app from './app.js';

/**
 * Point d'entrée Node.js : connexion BDD, serveur HTTP partagé par Express et Socket.io,
 * écoute du port, arrêt propre.
 */
try {
  await connectDB();
} catch (err) {
  console.error('Connexion MongoDB impossible :', err.message);
  process.exit(1);
}

const server = http.createServer(app);
const io = initSocket(server);

server.listen(env.port, () => {
  console.log(`API sur http://localhost:${env.port} (${env.nodeEnv})`);
});

// Arrêt propre : on cesse d'accepter des connexions, on ferme les sockets puis la BDD.
// Déclenché par Ctrl+C (SIGINT), docker stop (SIGTERM) ou nodemon au redémarrage (SIGUSR2 / SIGTERM).
let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} reçu : arrêt en cours…`);

  const forceExit = setTimeout(() => {
    console.error('Arrêt forcé (délai dépassé)');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  try {
    await io.close(); // ferme aussi le serveur HTTP
    await disconnectDB();
    console.log('Arrêt terminé');
    process.exit(0);
  } catch (err) {
    console.error("Erreur pendant l'arrêt :", err);
    process.exit(1);
  }
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGUSR2']) {
  process.once(signal, () => shutdown(signal));
}

// Erreur non gérée : on journalise et on redémarre proprement plutôt que de continuer dans un état incertain.
process.on('unhandledRejection', (reason) => {
  console.error('Promesse rejetée non gérée :', reason);
  shutdown('unhandledRejection');
});

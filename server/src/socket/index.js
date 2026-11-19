import { Server } from 'socket.io';
import { env } from '../config/env.js';

let io;

/**
 * Attache Socket.io au serveur HTTP de Node (même port que l'API REST).
 * L'authentification JWT au handshake et les rooms (user:<id>, ticket:<id>, staff)
 * arrivent au Sprint 4 (US07, US08).
 */
export function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: env.clientUrl } });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });

  return io;
}

/** Accès à l'instance depuis les services (émission d'événements après une écriture REST). */
export function getIO() {
  if (!io) throw new Error('Socket.io non initialisé');
  return io;
}

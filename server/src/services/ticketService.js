import { Ticket } from '../models/index.js';
import { populateTicket } from './ticketAccess.js';

/**
 * US02 — Déclarer un incident.
 * Seuls les champs saisis par le demandeur sont repris (protection contre l'« assignation de masse ») :
 * statut, assigné, numéro, priorityRank, historique et dates sont TOUJOURS fixés par le serveur.
 *  - numéro HD-XXXX : Counter atomique (hook pre('save') du modèle, après validation → pas de trou)
 *  - priorityRank : calculé depuis la priorité (hook pre('validate'))
 *  - historique : entrée « created » ajoutée par le modèle
 */
export async function createTicket({ title, description, category, priority }, author) {
  const ticket = await Ticket.create({
    title,
    description,
    category,
    ...(priority && { priority }), // absente → « medium » par défaut (schéma)
    createdBy: author._id,
  });
  return populateTicket(ticket);
}

import { Ticket, User } from '../models/index.js';
import { findTicketForUser, populateTicket } from './ticketAccess.js';

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

/**
 * US05 — Détail d'un ticket (RG1 : un utilisateur ne voit que les siens, 404 sinon).
 * Renvoie aussi `people` : nom des personnes citées dans l'historique d'assignation
 * (les champs from / to n'y sont que des identifiants), pour un historique lisible côté client.
 */
export async function getTicket(ticketId, user) {
  const ticket = await populateTicket(await findTicketForUser(ticketId, user));

  const ids = new Set();
  for (const entry of ticket.history) {
    if (entry.action !== 'assigned') continue;
    if (entry.from) ids.add(entry.from);
    if (entry.to) ids.add(entry.to);
  }
  const users = ids.size
    ? await User.find({ _id: { $in: [...ids] } }).select('firstName lastName role')
    : [];
  const people = Object.fromEntries(
    users.map((u) => [
      String(u._id),
      { firstName: u.firstName, lastName: u.lastName, role: u.role },
    ]),
  );

  return { ticket, people };
}

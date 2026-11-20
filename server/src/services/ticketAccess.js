import { STAFF_ROLES, Ticket } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

export const isStaff = (user) => STAFF_ROLES.includes(user.role);

/**
 * Charge un ticket en appliquant RG1 : un utilisateur ne voit que ses propres tickets,
 * le support (technician / admin) les voit tous.
 * Un ticket d'un autre utilisateur renvoie 404 (et non 403) : on ne révèle pas son existence.
 *
 * Réutilisable par toutes les routes /api/tickets/:id (détail, statut, commentaires…).
 */
export async function findTicketForUser(ticketId, user) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw AppError.notFound('Ticket introuvable');

  if (!isStaff(user) && !ticket.createdBy.equals(user._id)) {
    throw AppError.notFound('Ticket introuvable');
  }
  return ticket;
}

/** Champs des utilisateurs renvoyés avec un ticket (jamais le mot de passe). */
export const USER_PUBLIC_FIELDS = 'firstName lastName email role';

export function populateTicket(ticket) {
  return ticket.populate([
    { path: 'createdBy', select: USER_PUBLIC_FIELDS },
    { path: 'assignedTo', select: USER_PUBLIC_FIELDS },
    { path: 'history.by', select: 'firstName lastName role' },
  ]);
}

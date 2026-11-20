import { STAFF_ROLES, STATUS_TRANSITIONS, User } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { findTicketForUser, isStaff, populateTicket } from './ticketAccess.js';

/** RG2 — transitions qu'un utilisateur (non support) peut faire sur SON ticket. */
const USER_TRANSITIONS = Object.freeze({
  resolved: ['closed', 'in_progress'], // confirmer la résolution, ou rouvrir
});

/**
 * US05 — Changement de statut.
 *  RG2 : seul le support change le statut, sauf fermeture / réouverture d'un ticket résolu par son auteur
 *  RG3 : transitions autorisées (STATUS_TRANSITIONS)
 *  RG4 : passage « en cours » sans assigné → assigné au technicien qui agit
 *  RG5 : chaque changement est historisé
 * Statut, historique et dates sont modifiés puis enregistrés en UNE écriture (ticket.save()).
 */
export async function changeStatus(ticketId, newStatus, actor) {
  const ticket = await findTicketForUser(ticketId, actor);
  const from = ticket.status;

  const allowed = STATUS_TRANSITIONS[from];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      409,
      'INVALID_TRANSITION',
      `Transition non autorisée : ${from} → ${newStatus}`,
      { from, to: newStatus, allowed },
    );
  }

  if (!isStaff(actor) && !USER_TRANSITIONS[from]?.includes(newStatus)) {
    throw AppError.forbidden(
      'Seul le support peut changer ce statut (vous pouvez fermer ou rouvrir un ticket résolu)',
    );
  }

  const now = new Date();
  ticket.status = newStatus;
  ticket.history.push({ action: 'status_changed', from, to: newStatus, by: actor._id, at: now });

  // RG4 — prise en charge automatique
  if (newStatus === 'in_progress' && !ticket.assignedTo && isStaff(actor)) {
    ticket.assignedTo = actor._id;
    ticket.history.push({
      action: 'assigned',
      from: null,
      to: String(actor._id),
      by: actor._id,
      at: now,
    });
  }

  // Dates de suivi (statistiques de délais)
  if (newStatus === 'in_progress' && !ticket.firstResponseAt) ticket.firstResponseAt = now;
  if (newStatus === 'resolved') ticket.resolvedAt = now;
  if (from === 'resolved' && newStatus === 'in_progress') ticket.resolvedAt = null; // réouverture
  if (newStatus === 'closed') ticket.closedAt = now;

  await ticket.save();
  return populateTicket(ticket);
}

/**
 * US05 — Assignation.
 *  - un technicien ne peut s'assigner qu'à lui-même (« prendre en charge »)
 *  - un administrateur peut assigner à n'importe quel membre actif du support, ou désassigner (null)
 *  - un ticket fermé ne peut plus être réassigné
 * @param assigneeId  ObjectId, 'me' ou null
 */
export async function assignTicket(ticketId, assigneeId, actor) {
  if (!isStaff(actor)) throw AppError.forbidden('Seul le support peut assigner un ticket');

  const ticket = await findTicketForUser(ticketId, actor);
  if (ticket.status === 'closed') {
    throw new AppError(409, 'TICKET_CLOSED', 'Un ticket fermé ne peut plus être assigné');
  }

  const targetId = assigneeId === 'me' ? String(actor._id) : assigneeId;

  if (actor.role === 'technician') {
    if (targetId !== String(actor._id)) {
      throw AppError.forbidden("Un technicien ne peut s'assigner que lui-même");
    }
    // « Prendre en charge » uniquement un ticket libre : réassigner un ticket est le rôle de l'admin
    if (ticket.assignedTo && !ticket.assignedTo.equals(actor._id)) {
      throw new AppError(
        409,
        'ALREADY_ASSIGNED',
        'Ce ticket est déjà pris en charge par un autre technicien',
      );
    }
  }

  if (targetId !== null) {
    const assignee = await User.findById(targetId);
    if (!assignee || !assignee.isActive || !STAFF_ROLES.includes(assignee.role)) {
      throw new AppError(
        400,
        'INVALID_ASSIGNEE',
        'Le ticket ne peut être assigné qu’à un membre actif du support',
      );
    }
  }

  const previous = ticket.assignedTo ? String(ticket.assignedTo) : null;
  if (previous === targetId) return populateTicket(ticket); // déjà assigné : rien à faire

  const now = new Date();
  ticket.assignedTo = targetId;
  ticket.history.push({ action: 'assigned', from: previous, to: targetId, by: actor._id, at: now });
  if (targetId && !ticket.firstResponseAt) ticket.firstResponseAt = now;

  await ticket.save();
  return populateTicket(ticket);
}

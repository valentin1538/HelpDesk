import { Comment } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { USER_PUBLIC_FIELDS, findTicketForUser, isStaff } from './ticketAccess.js';

/** Taille de page par défaut et plafond accepté (paramètre `limit`). */
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function readPagination(page, limit) {
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const pageSize = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(limit, 10) || DEFAULT_LIMIT));
  return { page: currentPage, limit: pageSize, skip: (currentPage - 1) * pageSize };
}

/**
 * US06 — Fil de commentaires d'un ticket.
 *  RG1 : propriétaire du ticket ou support (404 sinon, via findTicketForUser)
 *  RG6 : une note interne n'est jamais renvoyée à un `user`
 * Pagination : tri du plus récent au plus ancien pour que la page 1 soit toujours la plus utile,
 * puis remise dans l'ordre chronologique avant la réponse (le client n'a rien à inverser).
 */
export async function listComments(ticketId, user, { page, limit } = {}) {
  await findTicketForUser(ticketId, user);

  const { page: currentPage, limit: pageSize, skip } = readPagination(page, limit);
  const filter = { ticket: ticketId };
  if (!isStaff(user)) filter.isInternal = false; // RG6

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate({ path: 'author', select: USER_PUBLIC_FIELDS }),
    Comment.countDocuments(filter),
  ]);

  return {
    comments: comments.reverse(),
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

/**
 * US06 — Ajouter un commentaire.
 *  RG7 : un ticket fermé n'accepte plus de commentaire (409)
 *  RG6 : `isInternal` n'est retenu que pour le support ; il est ignoré pour un `user`
 */
export async function createComment(ticketId, { content, isInternal }, actor) {
  const ticket = await findTicketForUser(ticketId, actor);
  if (ticket.status === 'closed') {
    throw new AppError(409, 'TICKET_CLOSED', 'Un ticket fermé n’accepte plus de commentaire');
  }

  const comment = await Comment.create({
    ticket: ticket._id,
    author: actor._id,
    content,
    isInternal: isStaff(actor) && isInternal === true, // seul le booléen true crée une note interne
  });

  return comment.populate({ path: 'author', select: USER_PUBLIC_FIELDS });
}

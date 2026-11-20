import http from './http.js';

/** Appels de l'API commentaires (US06). */

// GET /api/tickets/:id/comments?page=&limit= → { comments, pagination }
export async function listComments(ticketId, { page = 1, limit = 20 } = {}) {
  const { data } = await http.get(`/tickets/${ticketId}/comments`, { params: { page, limit } });
  return data;
}

// POST /api/tickets/:id/comments → { comment }   (isInternal : note interne, support uniquement)
export async function addComment(ticketId, { content, isInternal = false }) {
  const { data } = await http.post(`/tickets/${ticketId}/comments`, { content, isInternal });
  return data.comment;
}

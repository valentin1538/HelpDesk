import http from './http.js';

/** Appels de l'API tickets. Chaque fonction renvoie directement les données utiles. */

// US02 — POST /api/tickets → { ticket }
export async function createTicket({ title, description, category, priority }) {
  const { data } = await http.post('/tickets', { title, description, category, priority });
  return data.ticket;
}

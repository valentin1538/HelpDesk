import http from './http.js';

/** Appels de l'API tickets. Chaque fonction renvoie directement les données utiles. */

// US02 — POST /api/tickets → { ticket }
export async function createTicket({ title, description, category, priority }) {
  const { data } = await http.post('/tickets', { title, description, category, priority });
  return data.ticket;
}

// US05 — GET /api/tickets/:id → { ticket, people }
export async function getTicket(id) {
  const { data } = await http.get(`/tickets/${id}`);
  return data;
}

// US05 — PATCH /api/tickets/:id/status → { ticket }
export async function changeStatus(id, status) {
  const { data } = await http.patch(`/tickets/${id}/status`, { status });
  return data.ticket;
}

// US05 — PATCH /api/tickets/:id/assign → { ticket }   (assignedTo : id, 'me' ou null)
export async function assignTicket(id, assignedTo) {
  const { data } = await http.patch(`/tickets/${id}/assign`, { assignedTo });
  return data.ticket;
}

import * as ticketService from '../services/ticketService.js';

// POST /api/tickets → 201 { ticket }
export async function create(req, res) {
  const ticket = await ticketService.createTicket(req.body, req.user);
  res.status(201).location(`/api/tickets/${ticket._id}`).json({ ticket });
}

// GET /api/tickets/:id → 200 { ticket, people }
export async function getOne(req, res) {
  res.json(await ticketService.getTicket(req.params.id, req.user));
}

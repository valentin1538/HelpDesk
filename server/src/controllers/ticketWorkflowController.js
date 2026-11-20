import * as workflow from '../services/ticketWorkflowService.js';

// PATCH /api/tickets/:id/status  { status } → 200 { ticket }
export async function changeStatus(req, res) {
  const ticket = await workflow.changeStatus(req.params.id, req.body.status, req.user);
  res.json({ ticket });
}

// PATCH /api/tickets/:id/assign  { assignedTo: <userId> | 'me' | null } → 200 { ticket }
export async function assign(req, res) {
  const ticket = await workflow.assignTicket(req.params.id, req.body.assignedTo, req.user);
  res.json({ ticket });
}

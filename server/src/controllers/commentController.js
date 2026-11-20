import * as commentService from '../services/commentService.js';

// GET /api/tickets/:id/comments?page=1&limit=20 → 200 { comments, pagination }
export async function list(req, res) {
  const { page, limit } = req.query;
  res.json(await commentService.listComments(req.params.id, req.user, { page, limit }));
}

// POST /api/tickets/:id/comments  { content, isInternal } → 201 { comment }
export async function create(req, res) {
  const comment = await commentService.createComment(req.params.id, req.body, req.user);
  res.status(201).json({ comment });
}

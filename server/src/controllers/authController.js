import * as authService from '../services/authService.js';

// POST /api/auth/register → 201 { token, user }
export async function register(req, res) {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}

// POST /api/auth/login → 200 { token, user }
export async function login(req, res) {
  const result = await authService.login(req.body);
  res.json(result);
}

// GET /api/auth/me → 200 { user }  (req.user chargé par le middleware authenticate)
export function me(req, res) {
  res.json({ user: req.user });
}

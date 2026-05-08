import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService.js';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  role: z.enum(['farmer', 'manager', 'vet', 'admin']).optional(),
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed' });
  }
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await authService.register(parsed.data);
  return res.status(201).json(result);
});

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const userRouter = Router();

userRouter.get('/profile', requireAuth, (req, res) => {
  res.json({
    user: req.user,
    activeFarmId: 'farm-demo-1',
  });
});

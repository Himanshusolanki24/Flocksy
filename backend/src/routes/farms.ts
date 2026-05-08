import { randomUUID } from 'crypto';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const farmRouter = Router();

farmRouter.get('/', requireAuth, (_req, res) => {
  res.json({
    items: [
      {
        id: 'farm-demo-1',
        name: 'Green Coop Farm',
        location: 'Nashik',
        flockSize: 2400,
        houseCount: 3,
      },
    ],
  });
});

farmRouter.post('/', requireAuth, (req, res) => {
  res.status(201).json({
    id: randomUUID(),
    ...req.body,
    createdAt: new Date().toISOString(),
  });
});

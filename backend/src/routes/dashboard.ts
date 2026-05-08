import { Router } from 'express';
import { dashboardService } from '../services/dashboardService.js';

export const dashboardRouter = Router();

dashboardRouter.get('/summary', async (_req, res) => {
  const summary = await dashboardService.getSummary();
  res.json(summary);
});

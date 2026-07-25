import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import { diagnosisRouter } from './routes/diagnosis.js';
import { farmRouter } from './routes/farms.js';
import { healthRouter } from './routes/health.js';
import { userRouter } from './routes/users.js';
import { vetRouter } from './routes/vets.js';

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/farms', farmRouter);
app.use('/api/v1/diagnosis', diagnosisRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vets', vetRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({
    error: error.message || 'Internal server error',
  });
});

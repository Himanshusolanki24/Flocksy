import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthenticatedRequestUser } from '../types/index.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedRequestUser;
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthenticatedRequestUser;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

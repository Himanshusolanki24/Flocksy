import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthenticatedRequestUser } from '../types/index.js';

const demoUser: AuthenticatedRequestUser & { passwordHash: string } = {
  id: 'demo-user',
  email: 'farmer@focksy.ai',
  role: 'farmer',
  passwordHash: bcrypt.hashSync('demo1234', 10),
};

export const authService = {
  async login(email: string, password: string) {
    if (email !== demoUser.email || !(await bcrypt.compare(password, demoUser.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const user = { id: demoUser.id, email: demoUser.email, role: demoUser.role };
    const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });

    return { token, user };
  },

  async register(payload: { email: string; password: string; role?: AuthenticatedRequestUser['role'] }) {
    const user = {
      id: randomUUID(),
      email: payload.email,
      role: payload.role ?? 'farmer',
    } satisfies AuthenticatedRequestUser;

    const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
    return { token, user };
  },
};

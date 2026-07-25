import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  AI_CORE_URL: z.string().url(),
  MEDIA_PROVIDER: z.string().default('local'),
  MEDIA_BUCKET: z.string().default('focksy-media'),
});

export const env = envSchema.parse(process.env);

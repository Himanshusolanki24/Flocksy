import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { env } from '../config/env.js';

export const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
});

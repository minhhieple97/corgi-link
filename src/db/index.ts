import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/env';

const connectionString = env.DATABASE_URL;

const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, { schema });

export { eq, and, or, like, desc, asc } from 'drizzle-orm';

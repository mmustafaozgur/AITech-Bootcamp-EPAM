import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../config/env';

/**
 * PostgreSQL connection pool using DATABASE_URL from env.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

/**
 * Drizzle ORM instance for database operations.
 */
export const db = drizzle(pool);

/**
 * Graceful shutdown hook for database pool.
 */
export const shutdownDb = async () => {
  await pool.end();
};

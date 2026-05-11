import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Zod schema for environment variables validation.
 */
const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  BCRYPT_ROUNDS: z.string().regex(/^\d+$/).transform(Number),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  BASE_URL: z.string().url()
});

/**
 * Validated and typed environment variables.
 * Crashes at startup if any required variable is missing or invalid.
 */
export const env = envSchema.parse(process.env);

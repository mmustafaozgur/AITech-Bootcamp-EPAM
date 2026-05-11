import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

/**
 * Users table definition.
 * Represents a registered account.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  is_verified: boolean('is_verified').notNull().default(false),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  last_login_at: timestamp('last_login_at', { withTimezone: true }),
  deleted_at: timestamp('deleted_at', { withTimezone: true })
});

/**
 * Add other tables: refresh_tokens, email_verification_tokens, password_reset_tokens
 * (see data-model.md for full schema)
 */

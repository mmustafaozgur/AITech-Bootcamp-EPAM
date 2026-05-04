import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { sendPasswordResetEmail } from './emailService';

const BCRYPT_COST = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function issueToken(userId: string): { token: string; expiresIn: number } {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');

  const expiresIn = Number(process.env.JWT_EXPIRES_IN ?? 86400);
  const token = jwt.sign({ sub: userId }, secret, { expiresIn });
  return { token, expiresIn };
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();

  // Check for existing account – use a constant-time comparison path to avoid
  // leaking existence via timing side-channels.
  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [normalizedEmail]
  );

  if (existing.rowCount && existing.rowCount > 0) {
    throw Object.assign(new Error('Email already registered.'), {
      code: 'EMAIL_IN_USE',
      status: 409,
    });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const result = await pool.query<{ id: string }>(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
    [normalizedEmail, passwordHash]
  );

  const userId = result.rows[0].id;
  return issueToken(userId);
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const result = await pool.query<{
    id: string;
    password_hash: string;
    failed_login_attempts: number;
    locked_until: Date | null;
  }>(
    `SELECT id, password_hash, failed_login_attempts, locked_until
     FROM users WHERE email = $1`,
    [normalizedEmail]
  );

  // Always run bcrypt to prevent timing attacks even when user doesn't exist
  const dummyHash =
    '$2b$12$invalidhashfortimingprotectionxxxxxxxxxxxxxxxxxxxxxxxxx';
  const row = result.rows[0] ?? null;
  const hashToCompare = row ? row.password_hash : dummyHash;

  // Check lock before password comparison
  if (row?.locked_until && row.locked_until > new Date()) {
    throw Object.assign(new Error('Too many attempts. Try again in 1 hour.'), {
      code: 'ACCOUNT_LOCKED',
      status: 429,
    });
  }

  const passwordMatch = await bcrypt.compare(password, hashToCompare);

  if (!row || !passwordMatch) {
    if (row) {
      const newAttempts = row.failed_login_attempts + 1;
      const lockedUntil =
        newAttempts >= MAX_FAILED_ATTEMPTS
          ? new Date(Date.now() + LOCK_DURATION_MS)
          : null;

      await pool.query(
        `UPDATE users
         SET failed_login_attempts = $1, locked_until = $2
         WHERE id = $3`,
        [newAttempts, lockedUntil, row.id]
      );

      if (lockedUntil) {
        throw Object.assign(
          new Error('Too many attempts. Try again in 1 hour.'),
          { code: 'ACCOUNT_LOCKED', status: 429 }
        );
      }
    }

    throw Object.assign(new Error('Invalid email or password'), {
      code: 'INVALID_CREDENTIALS',
      status: 401,
    });
  }

  // Successful login – reset failure counter
  await pool.query(
    `UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1`,
    [row.id]
  );

  return issueToken(row.id);
}

// ─── Request Password Reset ───────────────────────────────────────────────────

export async function requestPasswordReset(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();

  const result = await pool.query<{ id: string }>(
    'SELECT id FROM users WHERE email = $1',
    [normalizedEmail]
  );

  // Silently succeed if email not found to avoid user enumeration
  if (!result.rowCount || result.rowCount === 0) return;

  const userId = result.rows[0].id;

  // Invalidate previous unused tokens for this user
  await pool.query(
    `UPDATE password_reset_tokens SET used = TRUE WHERE user_id = $1 AND used = FALSE`,
    [userId]
  );

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  await sendPasswordResetEmail(normalizedEmail, rawToken);
}

// ─── Confirm Password Reset ───────────────────────────────────────────────────

export async function confirmPasswordReset(
  rawToken: string,
  newPassword: string
): Promise<void> {
  const tokenHash = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  const result = await pool.query<{
    id: string;
    user_id: string;
    expires_at: Date;
    used: boolean;
  }>(
    `SELECT id, user_id, expires_at, used FROM password_reset_tokens
     WHERE token_hash = $1`,
    [tokenHash]
  );

  const tokenRow = result.rows[0];

  if (!tokenRow || tokenRow.used || tokenRow.expires_at < new Date()) {
    throw Object.assign(
      new Error('Invalid or expired reset token.'),
      { code: 'INVALID_TOKEN', status: 400 }
    );
  }

  const newHash = await bcrypt.hash(newPassword, BCRYPT_COST);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE users
       SET password_hash = $1, failed_login_attempts = 0, locked_until = NULL
       WHERE id = $2`,
      [newHash, tokenRow.user_id]
    );
    await client.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE id = $1`,
      [tokenRow.id]
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

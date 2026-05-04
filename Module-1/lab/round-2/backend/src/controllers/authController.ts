import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pool from '../db/pool';
import { signAccessToken } from '../utils/jwt';
import { sendPasswordResetEmail } from '../utils/email';

const SALT_ROUNDS = 12;
const RESET_EXPIRES_MINUTES = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES ?? 60);

// ─── Register ────────────────────────────────────────────────────────────────

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body as { email: string; password: string };

  const existing = await pool.query<{ id: string }>(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()],
  );
  if (existing.rowCount && existing.rowCount > 0) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query<{ id: string; email: string }>(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email.toLowerCase(), passwordHash],
  );

  const user = result.rows[0];
  const token = signAccessToken({ userId: user.id, email: user.email });

  res.status(201).json({ token, user: { id: user.id, email: user.email } });
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body as { email: string; password: string };

  const result = await pool.query<{ id: string; email: string; password_hash: string }>(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email.toLowerCase()],
  );

  const user = result.rows[0];
  // Use constant-time comparison to prevent timing attacks
  const dummyHash = '$2b$12$invalidhashfortimingattackprevention000000000000000000';
  const passwordMatch = user
    ? await bcrypt.compare(password, user.password_hash)
    : await bcrypt.compare(password, dummyHash);

  if (!user || !passwordMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = signAccessToken({ userId: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
}

// ─── Forgot Password ─────────────────────────────────────────────────────────

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { email } = req.body as { email: string };

  const result = await pool.query<{ id: string }>(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()],
  );

  // Always return 200 to avoid user enumeration
  if (!result.rowCount || result.rowCount === 0) {
    res.json({ message: 'If that email is registered you will receive a reset link shortly' });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + RESET_EXPIRES_MINUTES * 60 * 1000);

  await pool.query(
    'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
    [resetToken, expires, email.toLowerCase()],
  );

  try {
    await sendPasswordResetEmail(email.toLowerCase(), resetToken);
  } catch (err) {
    console.error('Failed to send reset email:', err);
    // Clear the token so it doesn't sit unused
    await pool.query(
      'UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE email = $1',
      [email.toLowerCase()],
    );
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    return;
  }

  res.json({ message: 'If that email is registered you will receive a reset link shortly' });
}

// ─── Reset Password ──────────────────────────────────────────────────────────

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { token, password } = req.body as { token: string; password: string };

  const result = await pool.query<{ id: string; email: string }>(
    `SELECT id, email FROM users
     WHERE reset_password_token = $1
       AND reset_password_expires > NOW()`,
    [token],
  );

  if (!result.rowCount || result.rowCount === 0) {
    res.status(400).json({ message: 'Reset token is invalid or has expired' });
    return;
  }

  const user = result.rows[0];
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await pool.query(
    `UPDATE users
     SET password_hash = $1,
         reset_password_token = NULL,
         reset_password_expires = NULL
     WHERE id = $2`,
    [passwordHash, user.id],
  );

  res.json({ message: 'Password has been reset successfully' });
}

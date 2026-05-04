'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../utils/email');

const router = express.Router();

const SALT_ROUNDS = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required.' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 30) {
    return res.status(400).json({ error: 'Username must be between 3 and 30 characters.' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const db = getDb();

  const existing = db
    .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
    .get(email.toLowerCase(), username.trim().toLowerCase());

  if (existing) {
    return res.status(409).json({ error: 'Email or username already in use.' });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = db
    .prepare(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)'
    )
    .run(email.trim().toLowerCase(), username.trim(), hashedPassword);

  const token = signToken(result.lastInsertRowid);

  return res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: {
      id: result.lastInsertRowid,
      email: email.trim().toLowerCase(),
      username: username.trim(),
    },
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required.' });
  }

  const db = getDb();
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email.trim().toLowerCase());

  // Use constant-time comparison to prevent timing attacks
  const dummyHash = '$2a$12$invalidhashforcomparison000000000000000000000000000000';
  const isValid = user
    ? await bcrypt.compare(password, user.password)
    : await bcrypt.compare(password, dummyHash);

  if (!isValid || !user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signToken(user.id);

  return res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
});

// ---------------------------------------------------------------------------
// GET /api/auth/me  (protected)
// ---------------------------------------------------------------------------
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ---------------------------------------------------------------------------
// POST /api/auth/forgot-password
// ---------------------------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'email is required.' });
  }

  const db = getDb();
  const user = db
    .prepare('SELECT id, email FROM users WHERE email = ?')
    .get(email.trim().toLowerCase());

  // Always respond with success to prevent user enumeration
  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  }

  // Invalidate any previous unused tokens for this user
  db.prepare(
    "UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0"
  ).run(user.id);

  const token = randomUUID();
  const expiryMinutes = parseInt(process.env.RESET_TOKEN_EXPIRES_MINUTES || '30', 10);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

  db.prepare(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)'
  ).run(user.id, token, expiresAt);

  try {
    await sendPasswordResetEmail(user.email, token);
  } catch (err) {
    console.error('Failed to send reset email:', err.message);
    // Don't leak email errors to the client
  }

  return res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// ---------------------------------------------------------------------------
// POST /api/auth/reset-password
// ---------------------------------------------------------------------------
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body || {};

  if (!token || !password) {
    return res.status(400).json({ error: 'token and password are required.' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const db = getDb();

  const record = db
    .prepare(
      `SELECT prt.id, prt.user_id, prt.expires_at, prt.used
       FROM password_reset_tokens prt
       WHERE prt.token = ?`
    )
    .get(token);

  if (!record) {
    return res.status(400).json({ error: 'Invalid or expired reset token.' });
  }

  if (record.used) {
    return res.status(400).json({ error: 'This reset token has already been used.' });
  }

  if (new Date(record.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const updateUser = db.prepare(
    "UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?"
  );
  const invalidateToken = db.prepare(
    'UPDATE password_reset_tokens SET used = 1 WHERE id = ?'
  );

  db.transaction(() => {
    updateUser.run(hashedPassword, record.user_id);
    invalidateToken.run(record.id);
  })();

  return res.json({ message: 'Password reset successfully. You can now log in.' });
});

module.exports = router;

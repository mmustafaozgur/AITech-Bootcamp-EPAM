'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 12;

// All user routes require authentication
router.use(requireAuth);

// ---------------------------------------------------------------------------
// PUT /api/user/change-password
// ---------------------------------------------------------------------------
router.put('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required.' });
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'New password must differ from the current password.' });
  }

  const db = getDb();
  const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  db.prepare("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?")
    .run(hashedPassword, req.user.id);

  return res.json({ message: 'Password changed successfully.' });
});

// ---------------------------------------------------------------------------
// GET /api/user/profile
// ---------------------------------------------------------------------------
router.get('/profile', (req, res) => {
  const db = getDb();
  const user = db
    .prepare('SELECT id, email, username, created_at FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({ user });
});

module.exports = router;

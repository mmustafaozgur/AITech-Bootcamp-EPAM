'use strict';

const jwt = require('jsonwebtoken');
const { getDb } = require('../db/database');

/**
 * Middleware: verify JWT from Authorization header (Bearer <token>).
 * Attaches req.user = { id, email, username } on success.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const token = authHeader.slice(7);

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  // Ensure user still exists in DB
  const db = getDb();
  const user = db
    .prepare('SELECT id, email, username FROM users WHERE id = ?')
    .get(payload.sub);

  if (!user) {
    return res.status(401).json({ error: 'User no longer exists.' });
  }

  req.user = user;
  next();
}

module.exports = { requireAuth };

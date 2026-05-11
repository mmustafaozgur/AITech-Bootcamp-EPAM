
import { Router, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  generateEmailVerificationToken,
  verifyEmail,
  getUserByEmail,
  generatePasswordResetToken,
  resetPassword
} from '../services/userService';
const router = Router();

/**
 * GET /auth/profile
 * Returns a mock user profile (requires email in query for demo).
 */
router.get('/profile', (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email is required' });
  const user = getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, is_verified: user.is_verified, is_active: user.is_active });
});

/**
 * DELETE /auth/delete-account
 * Deletes a user account (requires email in body for demo).
 */
router.delete('/delete-account', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.is_active = false;
  user.deleted_at = new Date();
  res.json({ message: 'Account deleted' });
});

/**
 * POST /auth/logout
 * Mocks user logout (stateless, just returns success).
 */
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out' });
});

/**
 * POST /auth/refresh-token
 * Mocks token refresh (returns a new mock token).
 */
router.post('/refresh-token', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });
  // In real app, validate and issue new JWT
  res.json({ token: token + '-refreshed' });
});

/**
 * POST /auth/request-password-reset
 * Generates a password reset token for a user (mocked, returns token in response).
 */
router.post('/request-password-reset', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const token = generatePasswordResetToken(email);
  // In real app, email would be sent here
  res.json({ message: 'Password reset token generated', token });
});

/**
 * POST /auth/reset-password
 * Resets a user's password using a token.
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and newPassword are required' });
  const ok = await resetPassword(token, newPassword);
  if (ok) return res.json({ message: 'Password reset successful' });
  return res.status(400).json({ error: 'Invalid or expired token' });
});

/**
 * POST /auth/verify-email
 * Verifies a user's email with a token.
 */
router.post('/verify-email', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });
  const ok = verifyEmail(token);
  if (ok) return res.json({ message: 'Email verified' });
  return res.status(400).json({ error: 'Invalid or expired token' });
});


/**
 * POST /auth/login
 * Authenticates a user and returns a mock JWT.
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await loginUser(email, password);
    // Mock JWT for demonstration (not secure)
    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});


/**
 * POST /auth/register
 * Registers a new user (in-memory store).
 */
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await registerUser(email, password);
    res.status(201).json({ id: user.id, email: user.email, is_verified: user.is_verified });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

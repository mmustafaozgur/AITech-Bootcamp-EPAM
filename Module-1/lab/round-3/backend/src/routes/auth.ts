import { Router, Request, Response } from 'express';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  confirmPasswordReset,
} from '../services/authService';
import { isValidEmail, isValidPassword } from '../utils/validation';

const router = Router();

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post(
  '/register',
  authRateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as Record<string, unknown>;

    if (typeof email !== 'string' || !isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'A valid email is required.' },
      });
      return;
    }

    if (typeof password !== 'string' || !isValidPassword(password)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            'Password must be at least 8 characters and contain at least one uppercase letter and one number.',
        },
      });
      return;
    }

    try {
      const { token, expiresIn } = await registerUser(email, password);
      res.status(201).json({ success: true, data: { token, expiresIn } });
    } catch (err) {
      handleAuthError(err, res);
    }
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  '/login',
  authRateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as Record<string, unknown>;

    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' },
      });
      return;
    }

    try {
      const { token, expiresIn } = await loginUser(email, password);
      res.status(200).json({ success: true, data: { token, expiresIn } });
    } catch (err) {
      handleAuthError(err, res);
    }
  }
);

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
//   Body without `token`  → request reset email
//   Body with `token`     → confirm reset with new password
router.post(
  '/reset-password',
  authRateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    const { email, token, newPassword } = req.body as Record<string, unknown>;

    // --- Confirm reset (token provided) ---
    if (typeof token === 'string') {
      if (typeof newPassword !== 'string' || !isValidPassword(newPassword)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message:
              'New password must be at least 8 characters and contain at least one uppercase letter and one number.',
          },
        });
        return;
      }

      try {
        await confirmPasswordReset(token, newPassword);
        res.status(200).json({
          success: true,
          data: { message: 'Password has been reset successfully.' },
        });
      } catch (err) {
        handleAuthError(err, res);
      }
      return;
    }

    // --- Request reset (email provided) ---
    if (typeof email !== 'string' || !isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'A valid email is required.' },
      });
      return;
    }

    try {
      await requestPasswordReset(email);
      // Always respond with 200 to prevent user enumeration
      res.status(200).json({
        success: true,
        data: {
          message:
            'If that email is registered, you will receive a reset link shortly.',
        },
      });
    } catch (err) {
      handleAuthError(err, res);
    }
  }
);

// ─── Error helper ─────────────────────────────────────────────────────────────
type AuthError = Error & { code?: string; status?: number };

function handleAuthError(err: unknown, res: Response): void {
  const e = err as AuthError;
  const status = e.status ?? 500;
  const code = e.code ?? 'INTERNAL_ERROR';
  const message =
    status === 500
      ? 'Connection failed. Please try again.'
      : e.message;

  res.status(status).json({ success: false, error: { code, message } });
}

export default router;

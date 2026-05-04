import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';

const router = Router();

const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number');

const emailRule = body('email')
  .isEmail().withMessage('Must be a valid email address')
  .normalizeEmail();

// POST /api/auth/register
router.post(
  '/register',
  [emailRule, passwordRules],
  register,
);

// POST /api/auth/login
router.post(
  '/login',
  [emailRule, body('password').notEmpty().withMessage('Password is required')],
  login,
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [emailRule],
  forgotPassword,
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    passwordRules,
  ],
  resetPassword,
);

export default router;

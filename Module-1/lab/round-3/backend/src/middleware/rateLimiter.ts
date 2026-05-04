import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for auth endpoints.
 * Allows 5 requests per hour per IP, then responds with a lock message.
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'ACCOUNT_LOCKED',
        message: 'Too many attempts. Try again in 1 hour.',
      },
    });
  },
});

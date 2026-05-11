import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Express error-handling middleware.
 * Maps known error types to HTTP status codes.
 * Logs errors via logger. Never leaks stack traces in production.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let status = 500;
  let message = 'Internal server error';

  // Map known error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  }

  logger.error('errorHandler', { status, message, error: err.message });

  res.status(status).json({ error: message });
}

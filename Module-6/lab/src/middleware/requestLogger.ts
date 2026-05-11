import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Logs method, path, status, and duration as structured JSON on every response.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    logger.info('request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs
    });
  });
  next();
}

import express from 'express';
import { json } from 'express';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './routes/auth';

/**
 * Factory to create the Express app with all middleware and routers.
 * Does not call listen().
 */
export function createApp() {
  const app = express();
  app.use(json());
  app.use(requestLogger);
  app.use('/auth', authRouter);
  app.use(errorHandler);
  return app;
}

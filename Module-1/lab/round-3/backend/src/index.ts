import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();

app.use(cors({ origin: process.env.APP_URL ?? 'http://localhost:3000' }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Auth routes
app.use('/api/auth', authRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found.' },
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Connection failed. Please try again.' },
    });
  }
);

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});

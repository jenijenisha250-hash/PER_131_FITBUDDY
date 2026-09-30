import express, { Express } from 'express';
import { apiRouter } from './routes.ts';

/**
 * Configures and returns the core Express application with all FitBuddy API routes.
 */
export function createFitBuddyApp(): Express {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use('/', apiRouter);
  return app;
}

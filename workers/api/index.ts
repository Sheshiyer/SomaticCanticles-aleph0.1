import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { D1Database } from '@cloudflare/workers-types';

// Type definitions
export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
  SENTRY_DSN?: string;
  ENVIRONMENT: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

export type Variables = {
  user?: {
    id: string;
    email: string;
    role: string;
  };
};

// Create Hono app
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://somatic-canticles.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
  });
});

// Auth routes
app.route('/auth', await import('./auth/index').then(m => m.default));

// User routes
app.route('/user', await import('./user/index').then(m => m.default));

// Biorhythm routes
app.route('/biorhythm', await import('./biorhythm/index').then(m => m.default));

// Chapters routes
app.route('/chapters', await import('./chapters/index').then(m => m.default));

// Progress routes
app.route('/progress', await import('./progress/index').then(m => m.default));

// Location routes
app.route('/location', await import('./location/index').then(m => m.default));

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: c.req.path,
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'development' ? err.message : 'Something went wrong',
  }, 500);
});

export default app;

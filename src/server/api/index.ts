import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import auth from './auth/index';
import user from './user/index';
import biorhythm from './biorhythm/index';
import chapters from './chapters/index';
import progress from './progress/index';
import location from './location/index';
import highlights from './highlights/index';
import bookmarks from './bookmarks/index';

// Type definitions
export type Env = {
  // DB is now imported directly
  JWT_SECRET: string;
  AUTH_SECRET: string;
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

// Initialize secrets manager middleware (Placeholder or removed if using env vars directly)
// app.use('*', async (c, next) => {
//   // Vercel uses process.env
//   await next();
// });

// CORS configuration
const corsOrigins = [
  'http://localhost:3000',
  'https://somatic-canticles.pages.dev',
  'https://1319.tryambakam.space',
  // Allow all Pages preview deployments
  'https://*.somatic-canticles.pages.dev',
  // Vercel deployment
  'https://somatic-canticles-aleph0-1.vercel.app',
];

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: (origin) => {
    // Allow no origin (mobile apps, curl, etc.)
    if (!origin) return '*';

    // Check exact matches
    if (corsOrigins.includes(origin)) return origin;

    // Check wildcard patterns
    if (origin.endsWith('.somatic-canticles.pages.dev')) return origin;

    // Deny other origins
    return null;
  },
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
app.route('/api/v1/auth', auth);
app.route('/auth', auth); // Fallback for stripped prefix environments

// User routes
app.route('/api/user', user);
app.route('/user', user);

// Biorhythm routes
app.route('/api/biorhythm', biorhythm);
app.route('/biorhythm', biorhythm);

// Chapters routes
app.route('/api/chapters', chapters);
app.route('/chapters', chapters);

// Progress routes
app.route('/api/progress', progress);
app.route('/progress', progress);

// Location routes
app.route('/api/location', location);
app.route('/location', location);

// Highlights routes
app.route('/api/highlights', highlights);
app.route('/highlights', highlights);

// Bookmarks routes
app.route('/api/bookmarks', bookmarks);
app.route('/bookmarks', bookmarks);

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

import { Hono } from 'hono';
import type { Env, Variables } from '../index';
import { jwtAuth } from '../middleware/auth';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Import auth handlers
import { login, register, refresh, logout, me } from './main';
import { googleAuth, googleCallback, googleOAuthHandler } from './oauth';

// Auth routes
app.post('/login', login);
app.post('/register', register);
app.post('/refresh', refresh);
app.post('/logout', logout);

// Protected routes
app.get('/me', jwtAuth, me);

// OAuth routes
app.get('/oauth/google', googleAuth);
app.get('/oauth/google/callback', googleCallback);
app.post('/oauth/google', googleOAuthHandler);

export default app;

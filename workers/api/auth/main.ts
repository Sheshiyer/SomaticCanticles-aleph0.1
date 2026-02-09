import { Hono } from 'hono';
import type { Env } from '../index';

const app = new Hono<{ Bindings: Env }>();

// Main auth routes (login, register, refresh, etc.)
app.route('/', await import('./main.js').then(m => m.default));

// OAuth routes (Google, etc.)
app.route('/oauth', await import('./oauth.js').then(m => m.default));

export default app;

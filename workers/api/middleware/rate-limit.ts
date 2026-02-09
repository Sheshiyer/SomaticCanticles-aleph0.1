// Rate Limiting Middleware for Cloudflare Workers with D1
import type { MiddlewareHandler } from 'hono';
import type { Env } from '../index';
import type { D1Database } from '@cloudflare/workers-types';

// Rate limit configuration
interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
  blockDurationSeconds?: number;
}

// Default configurations for different actions
const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: {
    windowSeconds: 60,     // 1 minute window
    maxRequests: 5,        // 5 attempts
    blockDurationSeconds: 300, // Block for 5 minutes after limit
  },
  register: {
    windowSeconds: 300,    // 5 minute window
    maxRequests: 3,
    blockDurationSeconds: 600,
  },
  refresh: {
    windowSeconds: 60,
    maxRequests: 10,
    blockDurationSeconds: 60,
  },
  forgotPassword: {
    windowSeconds: 3600,   // 1 hour window
    maxRequests: 3,
    blockDurationSeconds: 3600,
  },
  default: {
    windowSeconds: 60,
    maxRequests: 60,
  },
};

// In-memory rate limiter for development (when D1 is not available)
// In production, use D1 or KV for distributed rate limiting
const memoryStore = new Map<string, {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil?: number;
}>();

/**
 * Create a rate limiting middleware
 * @param action - The action being rate limited (login, register, etc.)
 * @param config - Optional custom configuration
 */
export function rateLimit(
  action: string,
  config?: Partial<RateLimitConfig>
): MiddlewareHandler<{ Bindings: Env }> {
  return async (c, next) => {
    const db = c.env.DB;
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const identifier = `${action}:${ip}`;
    
    const defaultConfig = DEFAULT_CONFIGS[action] ?? DEFAULT_CONFIGS.default;
    const finalConfig: RateLimitConfig = {
      windowSeconds: config?.windowSeconds ?? defaultConfig!.windowSeconds,
      maxRequests: config?.maxRequests ?? defaultConfig!.maxRequests,
      blockDurationSeconds: config?.blockDurationSeconds ?? defaultConfig!.blockDurationSeconds,
    };

    const now = Math.floor(Date.now() / 1000);

    try {
      // Try to use D1 first
      if (db) {
        const rateLimit = await checkRateLimitD1(db, identifier, action, finalConfig, now);
        
        if (rateLimit.blocked) {
          const retryAfter = rateLimit.retryAfter ?? finalConfig.windowSeconds;
          c.header('Retry-After', String(retryAfter));
          return c.json({
            success: false,
            error: {
              code: 'AUTH_RATE_LIMITED',
              message: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
            },
          }, 429);
        }

        // Record the attempt
        await recordAttemptD1(db, identifier, action, now);
      } else {
        // Fallback to in-memory store for development
        const rateLimit = checkRateLimitMemory(identifier, finalConfig, now);
        
        if (rateLimit.blocked) {
          const retryAfter = rateLimit.retryAfter ?? finalConfig.windowSeconds;
          c.header('Retry-After', String(retryAfter));
          return c.json({
            success: false,
            error: {
              code: 'AUTH_RATE_LIMITED',
              message: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
            },
          }, 429);
        }

        recordAttemptMemory(identifier, finalConfig, now);
      }

      // Add rate limit headers
      c.header('X-RateLimit-Limit', String(finalConfig.maxRequests));
      c.header('X-RateLimit-Window', String(finalConfig.windowSeconds));

      await next();
    } catch (error) {
      // If rate limiting fails, log but don't block the request
      console.error('Rate limiting error:', error);
      await next();
    }
  };
}

/**
 * Check rate limit using D1 database
 */
async function checkRateLimitD1(
  db: D1Database,
  identifier: string,
  action: string,
  config: RateLimitConfig,
  now: number
): Promise<{ blocked: boolean; retryAfter?: number }> {
  const windowStart = now - config.windowSeconds;

  // Get or create rate limit record
  const record = await db.prepare(
    'SELECT * FROM rate_limits WHERE identifier = ? AND action = ?'
  ).bind(identifier, action).first();

  if (!record) {
    return { blocked: false };
  }

  const firstAttempt = Math.floor(new Date(record.first_attempt_at as string).getTime() / 1000);
  const lastAttempt = Math.floor(new Date(record.last_attempt_at as string).getTime() / 1000);
  const blockedUntil = record.blocked_until 
    ? Math.floor(new Date(record.blocked_until as string).getTime() / 1000) 
    : null;

  // Check if currently blocked
  if (blockedUntil && now < blockedUntil) {
    return { blocked: true, retryAfter: blockedUntil - now };
  }

  // Reset if outside window
  if (lastAttempt < windowStart) {
    await db.prepare(
      'DELETE FROM rate_limits WHERE identifier = ? AND action = ?'
    ).bind(identifier, action).run();
    return { blocked: false };
  }

  // Check if limit exceeded
  if ((record.attempts as number) >= config.maxRequests) {
    // Block the user
    const blockUntil = now + (config.blockDurationSeconds ?? config.windowSeconds);
    await db.prepare(
      'UPDATE rate_limits SET blocked_until = ? WHERE id = ?'
    ).bind(new Date(blockUntil * 1000).toISOString(), record.id).run();
    
    return { blocked: true, retryAfter: blockUntil - now };
  }

  return { blocked: false };
}

/**
 * Record an attempt in D1
 */
async function recordAttemptD1(
  db: D1Database,
  identifier: string,
  action: string,
  now: number
): Promise<void> {
  const existing = await db.prepare(
    'SELECT id, attempts FROM rate_limits WHERE identifier = ? AND action = ?'
  ).bind(identifier, action).first();

  if (existing) {
    await db.prepare(
      'UPDATE rate_limits SET attempts = attempts + 1, last_attempt_at = ? WHERE id = ?'
    ).bind(new Date(now * 1000).toISOString(), existing.id).run();
  } else {
    const id = crypto.randomUUID();
    await db.prepare(
      'INSERT INTO rate_limits (id, identifier, action, attempts, first_attempt_at, last_attempt_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      id,
      identifier,
      action,
      1,
      new Date(now * 1000).toISOString(),
      new Date(now * 1000).toISOString(),
      new Date(now * 1000).toISOString()
    ).run();
  }
}

/**
 * Check rate limit using in-memory store (development only)
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig,
  now: number
): { blocked: boolean; retryAfter?: number } {
  const record = memoryStore.get(identifier);

  if (!record) {
    return { blocked: false };
  }

  // Check if currently blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    return { blocked: true, retryAfter: record.blockedUntil - now };
  }

  // Reset if outside window
  if (record.lastAttempt < now - config.windowSeconds) {
    memoryStore.delete(identifier);
    return { blocked: false };
  }

  // Check if limit exceeded
  if (record.attempts >= config.maxRequests) {
    const blockUntil = now + (config.blockDurationSeconds ?? config.windowSeconds);
    record.blockedUntil = blockUntil;
    return { blocked: true, retryAfter: blockUntil - now };
  }

  return { blocked: false };
}

/**
 * Record an attempt in memory (development only)
 */
function recordAttemptMemory(
  identifier: string,
  config: RateLimitConfig,
  now: number
): void {
  const record = memoryStore.get(identifier);

  if (record) {
    record.attempts++;
    record.lastAttempt = now;
  } else {
    memoryStore.set(identifier, {
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
  }

  // Cleanup old entries periodically
  if (Math.random() < 0.01) { // 1% chance per request
    cleanupMemoryStore(config.windowSeconds, now);
  }
}

/**
 * Clean up old entries from memory store
 */
function cleanupMemoryStore(windowSeconds: number, now: number): void {
  const cutoff = now - windowSeconds * 2;
  for (const [key, record] of memoryStore.entries()) {
    if (record.lastAttempt < cutoff) {
      memoryStore.delete(key);
    }
  }
}

// Pre-configured rate limiters
export const loginRateLimit = rateLimit('login');
export const registerRateLimit = rateLimit('register');
export const refreshRateLimit = rateLimit('refresh');
export const forgotPasswordRateLimit = rateLimit('forgotPassword');

// Export for testing
export { memoryStore, DEFAULT_CONFIGS };

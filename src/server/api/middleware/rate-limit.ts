// Rate Limiting Middleware for Vercel
import type { MiddlewareHandler } from 'hono';
import type { Env } from '../index';
import { db } from '../../../db';
import { rateLimits } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

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
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || 'unknown';
    const identifier = `${action}:${ip}`;

    const defaultConfig = DEFAULT_CONFIGS[action] ?? DEFAULT_CONFIGS.default;
    const finalConfig: RateLimitConfig = {
      windowSeconds: config?.windowSeconds ?? defaultConfig!.windowSeconds,
      maxRequests: config?.maxRequests ?? defaultConfig!.maxRequests,
      blockDurationSeconds: config?.blockDurationSeconds ?? defaultConfig!.blockDurationSeconds,
    };

    const now = Math.floor(Date.now() / 1000);

    try {
      const rateLimit = await checkRateLimitDB(identifier, action, finalConfig, now);

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
      await recordAttemptDB(identifier, action, now);

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
 * Check rate limit using Postgres database
 */
async function checkRateLimitDB(
  identifier: string,
  action: string,
  config: RateLimitConfig,
  now: number
): Promise<{ blocked: boolean; retryAfter?: number }> {
  const windowStart = now - config.windowSeconds;

  // Get or create rate limit record
  const record = await db.query.rateLimits.findFirst({
    where: and(
      eq(rateLimits.identifier, identifier),
      eq(rateLimits.action, action)
    )
  });

  if (!record) {
    return { blocked: false };
  }

  // Parse timestamps (stored as text ISO strings in schema)
  const firstAttempt = Math.floor(new Date(record.firstAttemptAt || 0).getTime() / 1000);
  const lastAttempt = Math.floor(new Date(record.lastAttemptAt || 0).getTime() / 1000);
  const blockedUntil = record.blockedUntil
    ? Math.floor(new Date(record.blockedUntil).getTime() / 1000)
    : null;

  // Check if currently blocked
  if (blockedUntil && now < blockedUntil) {
    return { blocked: true, retryAfter: blockedUntil - now };
  }

  // Reset if outside window
  if (lastAttempt < windowStart) {
    await db.delete(rateLimits).where(
      and(
        eq(rateLimits.identifier, identifier),
        eq(rateLimits.action, action)
      )
    );
    return { blocked: false };
  }

  // Check if limit exceeded
  if ((record.attempts || 0) >= config.maxRequests) {
    // Block the user
    const blockUntil = now + (config.blockDurationSeconds ?? config.windowSeconds);
    await db.update(rateLimits)
      .set({ blockedUntil: new Date(blockUntil * 1000).toISOString() })
      .where(eq(rateLimits.id, record.id));

    return { blocked: true, retryAfter: blockUntil - now };
  }

  return { blocked: false };
}

/**
 * Record an attempt in Postgres
 */
async function recordAttemptDB(
  identifier: string,
  action: string,
  now: number
): Promise<void> {
  const existing = await db.query.rateLimits.findFirst({
    where: and(
      eq(rateLimits.identifier, identifier),
      eq(rateLimits.action, action)
    )
  });

  const nowISO = new Date(now * 1000).toISOString();

  if (existing) {
    await db.update(rateLimits)
      .set({
        attempts: (existing.attempts || 0) + 1,
        lastAttemptAt: nowISO
      })
      .where(eq(rateLimits.id, existing.id));
  } else {
    await db.insert(rateLimits).values({
      id: crypto.randomUUID(),
      identifier,
      action,
      attempts: 1,
      firstAttemptAt: nowISO,
      lastAttemptAt: nowISO,
      createdAt: new Date()
    });
  }
}

// Pre-configured rate limiters
export const loginRateLimit = rateLimit('login');
export const registerRateLimit = rateLimit('register');
export const refreshRateLimit = rateLimit('refresh');
export const forgotPasswordRateLimit = rateLimit('forgotPassword');

// Export constants for testing
export { DEFAULT_CONFIGS };

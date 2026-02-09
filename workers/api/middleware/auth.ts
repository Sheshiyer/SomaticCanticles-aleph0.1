// JWT Authentication Middleware
import type { MiddlewareHandler } from 'hono';
import type { Env, Variables } from '../index';
import { SecretsManager } from '../../lib/secrets';

// JWT payload structure
export interface JWTPayload {
  sub: string;        // User ID
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
  type: 'access';
}

// Extended context variables with user, secrets, and JWT payload
export interface AuthVariables extends Variables {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
  jwtPayload: JWTPayload;
  secrets?: SecretsManager;
}

/**
 * JWT verification middleware
 * Extracts and validates JWT from Authorization header
 * Attaches user info to context
 */
export const jwtAuth: MiddlewareHandler<{ Bindings: Env; Variables: AuthVariables }> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_MISSING_TOKEN',
        message: 'Authorization header is required'
      }
    }, 401);
  }

  // Extract Bearer token
  const [scheme, token] = authHeader.split(' ');
  
  if (scheme !== 'Bearer' || !token) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_INVALID_TOKEN_FORMAT',
        message: 'Authorization header must be in format: Bearer <token>'
      }
    }, 401);
  }

  try {
    // Get JWT secret from secrets manager or env
    const secrets = c.get('secrets');
    const jwtSecret = secrets 
      ? await secrets.getRequired('JWT_SECRET')
      : c.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('[jwtAuth] JWT_SECRET not configured');
      return c.json({
        success: false,
        error: {
          code: 'AUTH_CONFIG_ERROR',
          message: 'Authentication service misconfigured'
        }
      }, 500);
    }

    // Verify JWT using Web Crypto API (Cloudflare Workers compatible)
    const payload = await verifyJWT(token, jwtSecret);
    
    // Verify token type is 'access'
    if (payload.type !== 'access') {
      return c.json({
        success: false,
        error: {
          code: 'AUTH_WRONG_TOKEN_TYPE',
          message: 'Invalid token type. Use an access token.'
        }
      }, 401);
    }

    // Attach user to context
    const user = {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as 'user' | 'admin',
    };

    c.set('user', user);
    c.set('jwtPayload', payload as unknown as JWTPayload);

    await next();
  } catch (error) {
    if (error instanceof JWTExpiredError) {
      return c.json({
        success: false,
        error: {
          code: 'AUTH_TOKEN_EXPIRED',
          message: 'Token has expired. Please refresh your token.'
        }
      }, 401);
    }

    return c.json({
      success: false,
      error: {
        code: 'AUTH_INVALID_TOKEN',
        message: 'Invalid or malformed token'
      }
    }, 401);
  }
};

/**
 * Optional auth middleware - attaches user if token present, doesn't reject if missing
 */
export const optionalAuth: MiddlewareHandler<{ Bindings: Env; Variables: AuthVariables }> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader) {
    await next();
    return;
  }

  const [scheme, token] = authHeader.split(' ');
  
  if (scheme !== 'Bearer' || !token) {
    await next();
    return;
  }

  try {
    // Get JWT secret from secrets manager or env
    const secrets = c.get('secrets');
    const jwtSecret = secrets 
      ? await secrets.get('JWT_SECRET')
      : c.env.JWT_SECRET;
    
    if (!jwtSecret) {
      await next();
      return;
    }

    const payload = await verifyJWT(token, jwtSecret);
    
    if (payload.type === 'access') {
      c.set('user', {
        id: payload.sub as string,
        email: payload.email as string,
        role: payload.role as 'user' | 'admin',
      });
    }
  } catch {
    // Ignore errors for optional auth
  }

  await next();
};

/**
 * Admin role middleware - requires user to have admin role
 * Must be used after jwtAuth middleware
 */
export const requireAdmin: MiddlewareHandler<{ Bindings: Env; Variables: AuthVariables }> = async (c, next) => {
  const user = c.get('user');
  
  if (!user) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_UNAUTHORIZED',
        message: 'Authentication required'
      }
    }, 401);
  }

  if (user.role !== 'admin') {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_FORBIDDEN',
        message: 'Admin access required'
      }
    }, 403);
  }

  await next();
};

// Custom error classes
class JWTExpiredError extends Error {
  constructor() {
    super('JWT token has expired');
    this.name = 'JWTExpiredError';
  }
}

class JWTInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWTInvalidError';
  }
}

/**
 * Verify JWT using Web Crypto API
 * Compatible with Cloudflare Workers environment
 */
async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown>> {
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    throw new JWTInvalidError('Invalid JWT format');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  if (!headerB64 || !payloadB64 || !signatureB64) {
    throw new JWTInvalidError('Invalid JWT format');
  }

  // Decode header and payload
  const header = JSON.parse(base64UrlDecode(headerB64)) as { alg: string };
  const payload = JSON.parse(base64UrlDecode(payloadB64)) as { exp?: number; nbf?: number };

  // Verify algorithm
  if (header.alg !== 'HS256') {
    throw new JWTInvalidError('Unsupported algorithm');
  }

  // Verify signature
  const encoder = new TextEncoder();
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );

  const signature = base64UrlToArrayBuffer(signatureB64);
  const isValid = await crypto.subtle.verify('HMAC', key, signature, data);

  if (!isValid) {
    throw new JWTInvalidError('Invalid signature');
  }

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new JWTExpiredError();
  }

  // Check not before
  if (payload.nbf && payload.nbf > now) {
    throw new JWTInvalidError('Token not yet valid');
  }

  return payload;
}

/**
 * Base64URL decode to string
 */
function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const decoded = atob(base64 + padding);
  return decoded;
}

/**
 * Base64URL string to ArrayBuffer
 */
function base64UrlToArrayBuffer(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Export error classes for testing
export { JWTExpiredError, JWTInvalidError, verifyJWT };

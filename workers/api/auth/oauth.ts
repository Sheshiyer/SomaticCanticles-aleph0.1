// Google OAuth Handler for Somatic-Canticles
// Handles Google OAuth authentication and user linking

import type { Context } from 'hono';
import type { Env, Variables } from '../index';
import { generateAccessToken, generateRefreshToken } from '../../lib/crypto';

// Helper function to generate UUID
function generateUUID(): string {
  return crypto.randomUUID();
}

// Helper function to hash token for storage
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * GET /auth/oauth/google
 * Initiate Google OAuth flow
 */
export async function googleAuth(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return c.json({
      success: false,
      error: {
        code: 'OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth is not configured'
      }
    }, 500);
  }

  // Return the Google OAuth URL for the frontend to redirect to
  const redirectUri = `${c.req.url}/callback`;
  const scope = encodeURIComponent('email profile');
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  return c.json({
    success: true,
    data: { authUrl: googleAuthUrl }
  });
}

/**
 * GET /auth/oauth/google/callback
 * Handle Google OAuth callback
 */
export async function googleCallback(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const code = c.req.query('code');
  
  if (!code) {
    return c.json({
      success: false,
      error: {
        code: 'OAUTH_MISSING_CODE',
        message: 'Authorization code is required'
      }
    }, 400);
  }

  // TODO: Exchange code for tokens with Google
  // Then call the POST handler logic below
  
  return c.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Callback handling not yet implemented'
    }
  }, 501);
}

/**
 * POST /auth/oauth/google
 * Handle Google OAuth authentication (token exchange)
 * Creates new user or links to existing user
 */
export async function googleOAuthHandler(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const db = c.env.DB;
  
  try {
    const { email, name, providerAccountId, accessToken, idToken } = await c.req.json();

    if (!email || !providerAccountId) {
      return c.json({
        success: false,
        error: {
          code: 'OAUTH_MISSING_PARAMS',
          message: 'Email and provider account ID are required'
        }
      }, 400);
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    let user = await db.prepare(
      'SELECT id, email, role, birthdate, timezone, email_verified, google_id FROM users WHERE email = ?'
    ).bind(normalizedEmail).first();

    let userId: string;
    let isNewUser = false;

    if (user) {
      // User exists - check if Google OAuth is already linked
      userId = user.id as string;
      
      // If Google ID is not set, update it (linking account)
      if (!user.google_id) {
        await db.prepare(
          'UPDATE users SET google_id = ?, email_verified = 1, updated_at = ? WHERE id = ?'
        ).bind(providerAccountId, new Date().toISOString(), userId).run();
      }

      // Update email_verified if not already set
      if (!user.email_verified) {
        await db.prepare(
          'UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?'
        ).bind(new Date().toISOString(), userId).run();
      }
    } else {
      // Create new user
      isNewUser = true;
      userId = generateUUID();
      const now = new Date().toISOString();

      // Generate a random secure password for OAuth users
      const { hashPassword } = await import('../../lib/crypto');
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();
      const passwordHash = await hashPassword(randomPassword);

      await db.prepare(
        'INSERT INTO users (id, email, password_hash, google_id, role, email_verified, birthdate, timezone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        userId,
        normalizedEmail,
        passwordHash,
        providerAccountId,
        'user',
        1,
        null,
        'UTC',
        now,
        now
      ).run();

      // Initialize streaks for new user
      await db.prepare(
        'INSERT INTO streaks (id, user_id, streak_type, current_count, longest_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        generateUUID(),
        userId,
        'daily',
        0,
        0,
        now,
        now
      ).run();

      // Get the newly created user
      user = await db.prepare(
        'SELECT id, email, role, birthdate, timezone, email_verified FROM users WHERE id = ?'
      ).bind(userId).first();
    }

    // Generate tokens
    const newAccessToken = await generateAccessToken({
      sub: userId,
      email: normalizedEmail,
      role: 'user',
    }, c.env.JWT_SECRET);

    const refreshToken = await generateRefreshToken({
      sub: userId,
    }, c.env.JWT_SECRET);

    // Store refresh token
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.prepare(
      'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      generateUUID(),
      userId,
      tokenHash,
      expiresAt.toISOString(),
      c.req.header('CF-Connecting-IP') || null,
      c.req.header('User-Agent') || null
    ).run();

    return c.json({
      success: true,
      data: {
        user: {
          id: user!.id,
          email: user!.email,
          role: user!.role,
          birthdate: user!.birthdate,
          timezone: user!.timezone,
          emailVerified: true,
        },
        tokens: {
          accessToken: newAccessToken,
          refreshToken: refreshToken,
          expiresIn: 900,
          tokenType: 'Bearer',
        },
        isNewUser,
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    return c.json({
      success: false,
      error: {
        code: 'OAUTH_ERROR',
        message: 'Failed to authenticate with Google'
      }
    }, 500);
  }
}

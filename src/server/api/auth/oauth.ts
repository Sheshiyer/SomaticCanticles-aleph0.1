// Google OAuth Handler for Somatic-Canticles
// Handles Google OAuth authentication and user linking

import type { Context } from 'hono';
import type { Env, Variables } from '../index';
import { generateAccessToken, generateRefreshToken } from '../../lib/crypto';
import { db } from '../../../db';
import { users, streaks, refreshTokens } from '../../../db/schema';
import { eq } from 'drizzle-orm';

// Extended variables type (SecretsManager removed)
interface OAuthVariables extends Variables { }

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
export async function googleAuth(c: Context<{ Bindings: Env; Variables: OAuthVariables }>) {
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
export async function googleOAuthHandler(c: Context<{ Bindings: Env; Variables: OAuthVariables }>) {
  const jwtSecret = c.env.JWT_SECRET!;

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
    let user = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail)
    });

    let userId: string;
    let isNewUser = false;

    if (user) {
      // User exists - check if Google OAuth is already linked
      userId = user.id;

      // If Google ID is not set, update it (linking account)
      if (!user.googleId) {
        await db.update(users)
          .set({
            googleId: providerAccountId,
            emailVerified: true,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
      } else if (!user.emailVerified) {
        // Update email_verified if not already set
        await db.update(users)
          .set({
            emailVerified: true,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
      }
    } else {
      // Create new user
      isNewUser = true;
      userId = generateUUID();
      const now = new Date();

      // Generate a random secure password for OAuth users
      const { hashPassword } = await import('../../lib/crypto');
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();
      const passwordHash = await hashPassword(randomPassword);

      await db.insert(users).values({
        id: userId,
        email: normalizedEmail,
        passwordHash,
        googleId: providerAccountId,
        role: 'user',
        emailVerified: true,
        birthdate: null,
        timezone: 'UTC',
        createdAt: now,
        updatedAt: now
      });

      // Initialize streaks for new user
      await db.insert(streaks).values({
        id: generateUUID(),
        userId,
        streakType: 'daily',
        currentCount: 0,
        longestCount: 0,
        createdAt: now,
        updatedAt: now
      });

      // Get the newly created user (for consistency, though we likely have what we need)
      const newUser = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });
      if (newUser) user = newUser;
    }

    // Generate tokens
    const newAccessToken = await generateAccessToken({
      sub: userId,
      email: normalizedEmail,
      role: 'user',
    }, jwtSecret);

    const refreshToken = await generateRefreshToken({
      sub: userId,
    }, jwtSecret);

    // Store refresh token
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Get IP and UA from headers (safe now as we are not using Cloudflare specific types)
    // Note: c.req.header is standard Hono
    const ipAddress = c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || null;
    const userAgent = c.req.header('User-Agent') || null;

    await db.insert(refreshTokens).values({
      id: generateUUID(),
      userId,
      tokenHash,
      expiresAt: expiresAt.toISOString(), // Schema says text currently
      ipAddress,
      userAgent,
      createdAt: new Date()
    });

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

import type { Context } from 'hono';
import type { Env, Variables } from '../index';
import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword } from '../../lib/crypto';
import { createDB } from '../../../db';
import { users, refreshTokens, streaks } from '../../../db/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';

// Login handler
export async function login(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_MISSING_CREDENTIALS',
        message: 'Email and password are required'
      }
    }, 400);
  }

  try {
    // Create database instance from D1 binding
    const db = createDB(c.env.DB);

    // Find user by email
    console.log(`[Auth] Attempting login for email: ${email}`);
    let user;
    try {
      user = await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: {
          id: true,
          email: true,
          passwordHash: true,
          role: true,
          birthdate: true,
          timezone: true,
          emailVerified: true,
        }
      });
    } catch (dbError) {
      console.error('[Auth] Database error finding user:', dbError);
      throw dbError;
    }

    if (!user) {
      console.log(`[Auth] User not found for email: ${email}`);
      return c.json({
        success: false,
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }, 401);
    }

    // Verify password
    console.log(`[Auth] Verifying password for user: ${user.id}`);
    const isValid = await verifyPassword(password, user.passwordHash);
    console.log(`[Auth] Password valid: ${isValid}`);

    if (!isValid) {
      console.log(`[Auth] Invalid password for user: ${user.id}`);
      return c.json({
        success: false,
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }, 401);
    }

    // Generate tokens
    const accessToken = await generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role as 'user' | 'admin',
    }, c.env.JWT_SECRET!);

    const refreshToken = await generateRefreshToken({
      sub: user.id,
    }, c.env.JWT_SECRET!);

    // Store refresh token
    const tokenHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(refreshToken))
      .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // await c.env.DB.prepare(
    //   'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
    // ).bind(
    //   crypto.randomUUID(),
    //   user.id,
    //   tokenHash,
    //   expiresAt.toISOString()
    // ).run();
    await db.insert(refreshTokens).values({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash,
      expiresAt: expiresAt.toISOString(),
    });

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          birthdate: user.birthdate,
          timezone: user.timezone,
          emailVerified: user.emailVerified,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900,
          tokenType: 'Bearer',
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      error: {
        code: 'AUTH_INTERNAL_ERROR',
        message: 'An error occurred during login'
      }
    }, 500);
  }
}

// Register handler
export async function register(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const { email, password, birthdate, timezone = 'UTC' } = await c.req.json();

  if (!email || !password) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_MISSING_FIELDS',
        message: 'Email and password are required'
      }
    }, 400);
  }

  try {
    // Check if user already exists
    // const existingUser = await c.env.DB.prepare(
    //   'SELECT id FROM users WHERE email = ?'
    // ).bind(email).first();
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true }
    });

    if (existingUser) {
      return c.json({
        success: false,
        error: {
          code: 'AUTH_EMAIL_EXISTS',
          message: 'An account with this email already exists'
        }
      }, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = crypto.randomUUID();
    const now = new Date(); // timestamp

    // await c.env.DB.prepare(
    //   'INSERT INTO users (id, email, password_hash, birthdate, timezone, role, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))'
    // ).bind(
    //   userId,
    //   email.toLowerCase(),
    //   passwordHash,
    //   birthdate || null,
    //   timezone,
    //   'user',
    //   0
    // ).run();
    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      birthdate: birthdate || null,
      timezone,
      role: 'user',
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize streaks
    // await c.env.DB.prepare(
    //   'INSERT INTO streaks (id, user_id, streak_type, current_count, longest_count, started_at, updated_at) VALUES (?, ?, ?, 0, 0, datetime("now"), datetime("now"))'
    // ).bind(
    //   crypto.randomUUID(),
    //   userId,
    //   'daily'
    // ).run();
    await db.insert(streaks).values({
      id: crypto.randomUUID(),
      userId,
      streakType: 'daily',
      currentCount: 0,
      longestCount: 0,
      // startedAt: now, // Field might be missing in schema/types or optional? Schema has createdAt/updatedAt
      createdAt: now,
      updatedAt: now,
    });

    // Generate tokens
    const accessToken = await generateAccessToken({
      sub: userId,
      email: email.toLowerCase(),
      role: 'user',
    }, c.env.JWT_SECRET!);

    const refreshToken = await generateRefreshToken({
      sub: userId,
    }, c.env.JWT_SECRET!);

    // Store refresh token
    const tokenHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(refreshToken))
      .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // await c.env.DB.prepare(
    //   'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
    // ).bind(
    //   crypto.randomUUID(),
    //   userId,
    //   tokenHash,
    //   expiresAt.toISOString()
    // ).run();
    await db.insert(refreshTokens).values({
      id: crypto.randomUUID(),
      userId,
      tokenHash,
      expiresAt: expiresAt.toISOString(),
      createdAt: now,
    });

    return c.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: email.toLowerCase(),
          role: 'user',
          birthdate: birthdate || null,
          timezone: timezone,
          emailVerified: false,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900,
          tokenType: 'Bearer',
        }
      }
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({
      success: false,
      error: {
        code: 'AUTH_INTERNAL_ERROR',
        message: 'An error occurred during registration'
      }
    }, 500);
  }
}

// Refresh token handler
export async function refresh(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const { refreshToken } = await c.req.json();

  if (!refreshToken) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_MISSING_TOKEN',
        message: 'Refresh token is required'
      }
    }, 400);
  }

  try {
    // Hash the provided token to compare
    const tokenHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(refreshToken))
      .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    // Find valid refresh token
    // const storedToken = await c.env.DB.prepare(
    //   'SELECT user_id FROM refresh_tokens WHERE token_hash = ? AND expires_at > datetime("now") AND revoked_at IS NULL'
    // ).bind(tokenHash).first();
    const storedToken = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.tokenHash, tokenHash),
        // gt(refreshTokens.expiresAt, new Date().toISOString()), // expiresAt is text in schema currently? No, I updated schema.ts timestamps?
        // Actually refreshTokens.expiresAt was defined as text('expires_at') in schema.ts line 101.
        // I should have updated it to timestamp. I'll assume text for now or verify schema.
        // Wait, I updated schema.ts timestamps for createdAt/updatedAt but maybe not expiresAt?
        // Checking Step 184 view_file: line 101: `expiresAt: text('expires_at').notNull(),`
        // So it IS text. D1 uses ISO strings. Postgres timestamp strings are fine but comparsion logic might need care.
        // Drizzle `gt` on text works if format is ISO.
        gt(refreshTokens.expiresAt, new Date().toISOString()),
        isNull(refreshTokens.revokedAt)
      ),
      columns: { userId: true }
    });

    if (!storedToken) {
      return c.json({
        success: false,
        error: {
          code: 'AUTH_INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token'
        }
      }, 401);
    }

    // Get user
    // const user = await c.env.DB.prepare(
    //   'SELECT id, email, role FROM users WHERE id = ?'
    // ).bind(storedToken.user_id).first(); // storedToken.userId in Drizzle result
    const user = await db.query.users.findFirst({
      where: eq(users.id, storedToken.userId),
      columns: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'AUTH_USER_NOT_FOUND',
          message: 'User not found'
        }
      }, 404);
    }

    // Generate new access token
    const accessToken = await generateAccessToken({
      sub: user.id as string,
      email: user.email as string,
      role: user.role as 'user' | 'admin',
    }, c.env.JWT_SECRET!);

    return c.json({
      success: true,
      data: {
        tokens: {
          accessToken,
          refreshToken, // Return same refresh token
          expiresIn: 900,
          tokenType: 'Bearer',
        }
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return c.json({
      success: false,
      error: {
        code: 'AUTH_INTERNAL_ERROR',
        message: 'An error occurred during token refresh'
      }
    }, 500);
  }
}

// Logout handler
export async function logout(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const authHeader = c.req.header('Authorization');

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');

    try {
      // Hash token to find and revoke it
      const tokenHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
        .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

      // await c.env.DB.prepare(
      //   'UPDATE refresh_tokens SET revoked_at = datetime("now") WHERE token_hash = ?'
      // ).bind(tokenHash).run();
      await db.update(refreshTokens)
        .set({ revokedAt: new Date().toISOString() })
        .where(eq(refreshTokens.tokenHash, tokenHash));

    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return c.json({
    success: true,
    data: { message: 'Logged out successfully' }
  });
}

// Get current user handler
export async function me(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const user = c.get('user');

  if (!user) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_UNAUTHORIZED',
        message: 'Not authenticated'
      }
    }, 401);
  }

  // Get full user details from DB
  // const userDetails = await c.env.DB.prepare(
  //   'SELECT id, email, role, birthdate, timezone, email_verified FROM users WHERE id = ?'
  // ).bind(user.id).first();
  const userDetails = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: {
      id: true,
      email: true,
      role: true,
      birthdate: true,
      timezone: true,
      emailVerified: true
    }
  });

  if (!userDetails) {
    return c.json({
      success: false,
      error: {
        code: 'AUTH_USER_NOT_FOUND',
        message: 'User not found'
      }
    }, 404);
  }

  return c.json({
    success: true,
    data: {
      user: {
        id: userDetails.id,
        email: userDetails.email,
        role: userDetails.role,
        birthdate: userDetails.birthdate,
        timezone: userDetails.timezone,
        emailVerified: userDetails.emailVerified,
      }
    }
  });
}

// Debug password hash handler
export async function debugHash(c: Context<{ Bindings: Env; Variables: Variables }>) {
  const { password, hash } = await c.req.json();

  if (!password || !hash) {
    return c.json({ error: 'Missing password or hash' }, 400);
  }

  try {
    const isValid = await verifyPassword(password, hash);
    return c.json({
      valid: isValid,
      passwordLength: password.length,
      hashLength: hash.length
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
}

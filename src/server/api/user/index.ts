// User API Routes for Somatic-Canticles
// Handles user profile management

import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../index';
import { jwtAuth, type AuthVariables } from '../middleware/auth';
import { db } from '../../../db';
import { users, refreshTokens } from '../../../db/schema';
import { eq, sql, and } from 'drizzle-orm';

// Validation schemas
const updateProfileSchema = z.object({
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be in YYYY-MM-DD format')
    .optional(),
  timezone: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
});

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

/**
 * GET /user/profile
 * Get current user profile
 * Requires authentication
 */
app.get('/profile', jwtAuth, async (c) => {
  // const db = c.env.DB;
  const user = c.get('user');

  try {
    // const userData = await db.prepare(
    //   'SELECT id, email, role, birthdate, timezone, email_verified, created_at FROM users WHERE id = ?'
    // ).bind(user.id).first();
    const userData = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: {
        id: true,
        email: true,
        role: true,
        birthdate: true,
        timezone: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    if (!userData) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          birthdate: userData.birthdate,
          timezone: userData.timezone,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user profile'
      }
    }, 500);
  }
});

/**
 * PUT /user/profile
 * Update current user profile
 * Requires authentication
 * Allows updating: birthdate, timezone (not email/role)
 */
app.put('/profile', jwtAuth, async (c) => {
  // const db = c.env.DB;
  const user = c.get('user');

  try {
    const body = await c.req.json();

    // Validate request body
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: issues
        }
      }, 400);
    }

    const { birthdate, timezone } = result.data;

    // Use Drizzle update
    const updateData: any = {};
    if (birthdate !== undefined) updateData.birthdate = birthdate;
    if (timezone !== undefined) updateData.timezone = timezone;

    if (Object.keys(updateData).length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'NO_FIELDS_TO_UPDATE',
          message: 'No valid fields to update'
        }
      }, 400);
    }

    updateData.updatedAt = new Date(); // timestamp

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, user.id));

    // Fetch updated user
    // const userData = await db.prepare(
    //   'SELECT id, email, role, birthdate, timezone, email_verified, created_at FROM users WHERE id = ?'
    // ).bind(user.id).first();
    const userData = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: {
        id: true,
        email: true,
        role: true,
        birthdate: true,
        timezone: true,
        emailVerified: true,
        createdAt: true
      }
    });

    return c.json({
      success: true,
      data: {
        user: {
          id: userData!.id,
          email: userData!.email,
          role: userData!.role,
          birthdate: userData!.birthdate,
          timezone: userData!.timezone,
          emailVerified: userData!.emailVerified,
          createdAt: userData!.createdAt,
        }
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user profile'
      }
    }, 500);
  }
});

/**
 * POST /user/change-password
 * Change user password
 * Requires authentication
 */
app.post('/change-password', jwtAuth, async (c) => {
  const user = c.get('user');

  try {
    const body = await c.req.json();

    // Validate request body
    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: issues
        }
      }, 400);
    }

    const { currentPassword, newPassword } = result.data;

    // Get current password hash
    // const userData = await db.prepare(
    //   'SELECT password_hash FROM users WHERE id = ?'
    // ).bind(user.id).first();
    const userData = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { passwordHash: true }
    });

    if (!userData) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      }, 404);
    }

    // Import crypto functions
    const { verifyPassword, hashPassword } = await import('../../lib/crypto');

    // Verify current password
    const isValid = await verifyPassword(currentPassword, userData.passwordHash);

    if (!isValid) {
      return c.json({
        success: false,
        error: {
          code: 'INCORRECT_PASSWORD',
          message: 'Current password is incorrect'
        }
      }, 400);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    // await db.prepare(
    //   'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?'
    // ).bind(newPasswordHash, new Date().toISOString(), user.id).run();
    await db.update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date() // timestamp
      })
      .where(eq(users.id, user.id));

    // Revoke all refresh tokens for security
    await db.update(refreshTokens)
      .set({ revokedAt: new Date().toISOString() })
      .where(and(
        eq(refreshTokens.userId, user.id),
        sql`revoked_at IS NULL`
      ));

    return c.json({
      success: true,
      data: {
        message: 'Password changed successfully. Please sign in again with your new password.'
      }
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to change password'
      }
    }, 500);
  }
});

/**
 * DELETE /user/account
 * Delete user account
 * Requires authentication
 */
app.delete('/account', jwtAuth, async (c) => {
  // const db = c.env.DB;
  const user = c.get('user');

  try {
    // Delete user's refresh tokens, progress, etc.
    // With onDelete: 'cascade' on foreign keys in Postgres schema, deleting user should suffice?
    // Let's check schema.
    // users table: ...
    // other tables references(() => users.id, { onDelete: 'cascade' })
    // Yes, they have cascading deletes.
    // So just deleting user is enough. Drizzle schema confirms cascade.

    // Delete user
    await db.delete(users).where(eq(users.id, user.id));

    return c.json({
      success: true,
      data: {
        message: 'Account deleted successfully'
      }
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete account'
      }
    }, 500);
  }
});

export default app;

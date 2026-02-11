/**
 * Biorhythm API Endpoints
 * 
 * POST /biorhythm/calculate - Calculate biorhythm for a specific date
 * GET  /biorhythm/predict - Get 30-day prediction with peaks and critical days
 */

import { Hono, type Context } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../index';
import { jwtAuth, optionalAuth, type AuthVariables } from '../middleware/auth';
import {
  calculateBiorhythm,
  calculateAllCycles,
  isValidTimezone,
  CYCLE_LENGTHS,
  THRESHOLDS,
} from '../../lib/biorhythm/calculator';
import { getSunriseSunset } from '../../lib/location/sun';
import { db } from '../../../db';
import { users, biorhythmSnapshots } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// Validation schemas
const calculateSchema = z.object({
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be in YYYY-MM-DD format')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed <= new Date();
    }, 'Birthdate must be a valid date in the past'),
  targetDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Target date must be in YYYY-MM-DD format')
    .optional(),
  timezone: z.string().default('UTC'),
});

const predictSchema = z.object({
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be in YYYY-MM-DD format')
    .optional(),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),
  days: z.number().min(1).max(90).default(30),
  timezone: z.string().default('UTC'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Helper to get birthdate from authenticated user or request
async function getBirthdate(
  c: Context<{ Bindings: Env; Variables: AuthVariables }>,
  providedBirthdate?: string
): Promise<{ birthdate: string; userId?: string } | null> {
  const user = c.get('user');

  // If authenticated user
  if (user) {
    // const db = createDB(c.env.DB);
    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (userRecord?.birthdate) {
      return { birthdate: userRecord.birthdate, userId: user.id };
    }
  }

  // Use provided birthdate
  if (providedBirthdate) {
    return { birthdate: providedBirthdate, userId: user?.id };
  }

  return null;
}

/**
 * POST /biorhythm/calculate
 * Calculate biorhythm for a specific date
 * 
 * Request Body:
 * - birthdate: string (YYYY-MM-DD) - required if not authenticated with stored birthdate
 * - targetDate: string (YYYY-MM-DD) - optional, defaults to today
 * - timezone: string (IANA format) - optional, defaults to UTC
 * 
 * Response: { date, physical, emotional, intellectual, spiritual, peaks, criticalDays }
 */
app.post('/calculate', optionalAuth, zValidator('json', calculateSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    // Validate timezone
    if (!isValidTimezone(body.timezone)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_TIMEZONE',
          message: 'Invalid timezone provided',
        },
      }, 400);
    }

    // Get birthdate (from user profile or request)
    const birthdateInfo = await getBirthdate(c, body.birthdate);
    if (!birthdateInfo) {
      return c.json({
        success: false,
        error: {
          code: 'BIRTHDATE_REQUIRED',
          message: 'Birthdate is required. Either authenticate with a profile containing birthdate or provide birthdate in request body.',
        },
      }, 400);
    }

    // Calculate biorhythm
    const targetDate = body.targetDate || new Date().toISOString().split('T')[0]!;
    const result = calculateBiorhythm(
      birthdateInfo.birthdate,
      targetDate,
      body.timezone
    );

    return c.json({
      success: true,
      data: {
        ...result,
        birthdate: birthdateInfo.birthdate,
        timezone: body.timezone,
      },
    }, 200);

  } catch (error) {
    console.error('Biorhythm calculate error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid birthdate')) {
        return c.json({
          success: false,
          error: {
            code: 'INVALID_BIRTHDATE',
            message: error.message,
          },
        }, 400);
      }
      if (error.message.includes('Target date cannot be before birthdate')) {
        return c.json({
          success: false,
          error: {
            code: 'INVALID_DATE_RANGE',
            message: error.message,
          },
        }, 400);
      }
    }

    return c.json({
      success: false,
      error: {
        code: 'CALCULATION_ERROR',
        message: 'Failed to calculate biorhythm',
      },
    }, 500);
  }
});

/**
 * GET /biorhythm/predict
 * Get biorhythm prediction for multiple days
 * 
 * Query Parameters:
 * - birthdate: string (YYYY-MM-DD) - required if not authenticated
 * - startDate: string (YYYY-MM-DD) - optional, defaults to today
 * - days: number (1-90) - optional, defaults to 30
 * - timezone: string (IANA format) - optional, defaults to UTC
 * - latitude: number - optional, for sunrise/sunset data
 * - longitude: number - optional, for sunrise/sunset data
 * 
 * Response: Array of daily predictions with peaks and critical days
 */
app.get('/predict', optionalAuth, zValidator('query', predictSchema), async (c) => {
  try {
    const query = c.req.valid('query');

    // Validate timezone
    if (!isValidTimezone(query.timezone)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_TIMEZONE',
          message: 'Invalid timezone provided',
        },
      }, 400);
    }

    // Get birthdate (from user profile or request)
    const birthdateInfo = await getBirthdate(c, query.birthdate);
    if (!birthdateInfo) {
      return c.json({
        success: false,
        error: {
          code: 'BIRTHDATE_REQUIRED',
          message: 'Birthdate is required. Either authenticate with a profile containing birthdate or provide birthdate in query parameter.',
        },
      }, 400);
    }

    // Determine start date
    const startDate = query.startDate || new Date().toISOString().split('T')[0]!;

    // Calculate predictions
    const predictions = calculateAllCycles(
      birthdateInfo.birthdate,
      startDate,
      query.days,
      query.timezone
    );

    // Add sunrise/sunset data if coordinates provided
    let enrichedPredictions: Array<typeof predictions[0] & { sunrise?: string | null; sunset?: string | null }> = predictions;
    if (query.latitude !== undefined && query.longitude !== undefined) {
      try {
        enrichedPredictions = await Promise.all(
          predictions.map(async (day) => {
            const sunData = await getSunriseSunset(
              query.latitude!,
              query.longitude!,
              day.date
            );
            return {
              ...day,
              sunrise: sunData?.sunrise || null,
              sunset: sunData?.sunset || null,
            };
          })
        );
      } catch (sunError) {
        console.warn('Failed to fetch sun data:', sunError);
        // Continue without sun data
      }
    }

    // Store snapshot in database if user is authenticated
    if (birthdateInfo.userId) {
      try {
        // const db = createDB(c.env.DB);

        for (const day of enrichedPredictions) {
          await db.insert(biorhythmSnapshots).values({
            id: `${birthdateInfo.userId}-${day.date}`,
            userId: birthdateInfo.userId,
            date: day.date,
            physical: day.physical,
            emotional: day.emotional,
            intellectual: day.intellectual,
            spiritual: day.spiritual,
            physicalPeak: day.peaks.includes('physical'),
            emotionalPeak: day.peaks.includes('emotional'),
            intellectualPeak: day.peaks.includes('intellectual'),
            spiritualPeak: day.peaks.includes('spiritual'),
            sunriseTime: 'sunrise' in day ? (day.sunrise as string | null) || null : null,
            sunsetTime: 'sunset' in day ? (day.sunset as string | null) || null : null,
          }).onConflictDoUpdate({
            target: biorhythmSnapshots.id,
            set: {
              physical: day.physical,
              emotional: day.emotional,
              intellectual: day.intellectual,
              spiritual: day.spiritual,
              physicalPeak: day.peaks.includes('physical'),
              emotionalPeak: day.peaks.includes('emotional'),
              intellectualPeak: day.peaks.includes('intellectual'),
              spiritualPeak: day.peaks.includes('spiritual'),
              sunriseTime: 'sunrise' in day ? (day.sunrise as string | null) || null : null,
              sunsetTime: 'sunset' in day ? (day.sunset as string | null) || null : null,
            },
          });
        }
      } catch (dbError) {
        console.error('Failed to store biorhythm snapshot:', dbError);
        // Continue even if storage fails
      }
    }

    // Calculate summary statistics
    const peaks = {
      physical: enrichedPredictions.filter(d => d.peaks.includes('physical')).length,
      emotional: enrichedPredictions.filter(d => d.peaks.includes('emotional')).length,
      intellectual: enrichedPredictions.filter(d => d.peaks.includes('intellectual')).length,
      spiritual: enrichedPredictions.filter(d => d.peaks.includes('spiritual')).length,
    };

    const criticalDays = {
      physical: enrichedPredictions.filter(d => d.criticalDays.includes('physical')).length,
      emotional: enrichedPredictions.filter(d => d.criticalDays.includes('emotional')).length,
      intellectual: enrichedPredictions.filter(d => d.criticalDays.includes('intellectual')).length,
      spiritual: enrichedPredictions.filter(d => d.criticalDays.includes('spiritual')).length,
    };

    return c.json({
      success: true,
      data: {
        birthdate: birthdateInfo.birthdate,
        timezone: query.timezone,
        startDate,
        days: query.days,
        predictions: enrichedPredictions,
        summary: {
          totalDays: enrichedPredictions.length,
          peaks,
          criticalDays,
        },
      },
    }, 200);

  } catch (error) {
    console.error('Biorhythm predict error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Days must be between')) {
        return c.json({
          success: false,
          error: {
            code: 'INVALID_DAYS_RANGE',
            message: error.message,
          },
        }, 400);
      }
    }

    return c.json({
      success: false,
      error: {
        code: 'PREDICTION_ERROR',
        message: 'Failed to generate biorhythm prediction',
      },
    }, 500);
  }
});

/**
 * GET /biorhythm/cycles/info
 * Get information about biorhythm cycles
 */
app.get('/cycles/info', (c) => {
  return c.json({
    success: true,
    data: {
      cycles: {
        physical: {
          name: 'Physical',
          length: CYCLE_LENGTHS.physical,
          description: 'Represents physical strength, endurance, coordination, and overall vitality',
        },
        emotional: {
          name: 'Emotional',
          length: CYCLE_LENGTHS.emotional,
          description: 'Represents emotional stability, sensitivity, creativity, and mood',
        },
        intellectual: {
          name: 'Intellectual',
          length: CYCLE_LENGTHS.intellectual,
          description: 'Represents mental alertness, analytical ability, logic, and memory',
        },
        spiritual: {
          name: 'Spiritual',
          length: CYCLE_LENGTHS.spiritual,
          description: 'Represents intuition, spiritual awareness, and connection to higher consciousness',
        },
      },
      thresholds: {
        peak: THRESHOLDS.peak,
        critical: THRESHOLDS.critical,
      },
      formula: 'sin(2π × days_since_birth / cycle_length)',
    },
  }, 200);
});

/**
 * GET /biorhythm/today
 * Quick endpoint to get today's biorhythm for authenticated user
 */
app.get('/today', jwtAuth, async (c) => {
  try {
    const user = c.get('user');
    const timezone = c.req.query('timezone') || 'UTC';

    // const db = createDB(c.env.DB);
    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (!userRecord?.birthdate) {
      return c.json({
        success: false,
        error: {
          code: 'BIRTHDATE_NOT_SET',
          message: 'Please set your birthdate in your profile to use this feature',
        },
      }, 400);
    }

    const today = new Date().toISOString().split('T')[0]!;
    const result = calculateBiorhythm(userRecord.birthdate, today, timezone);

    return c.json({
      success: true,
      data: {
        ...result,
        birthdate: userRecord.birthdate,
        timezone,
      },
    }, 200);

  } catch (error) {
    console.error('Biorhythm today error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CALCULATION_ERROR',
        message: 'Failed to calculate today\'s biorhythm',
      },
    }, 500);
  }
});

export default app;

/**
 * Location API Endpoints
 * 
 * GET /location/sunrise - Get sunrise/sunset times for a location
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../index';
import { getSunriseSunset, getSunriseSunsetRange } from '../../lib/location/sun';

const app = new Hono<{ Bindings: Env }>();

// Validation schemas
const sunriseSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  days: z.number().min(1).max(30).optional(),
});

/**
 * GET /location/sunrise
 * Get sunrise and sunset times for a location
 * 
 * Query Parameters:
 * - lat: number (-90 to 90) - required
 * - lng: number (-180 to 180) - required
 * - date: string (YYYY-MM-DD) - optional, defaults to today
 * - days: number (1-30) - optional, number of days to fetch
 * 
 * Response: { sunrise, sunset, solarNoon, dayLength, cached }
 */
app.get('/sunrise', zValidator('query', sunriseSchema), async (c) => {
  try {
    const query = c.req.valid('query');

    const date = query.date || new Date().toISOString().split('T')[0]!;

    // If days parameter provided, return range
    if (query.days && query.days > 1) {
      const results = await getSunriseSunsetRange(
        query.lat,
        query.lng,
        date,
        query.days
      );

      return c.json({
        success: true,
        data: {
          latitude: query.lat,
          longitude: query.lng,
          startDate: date,
          days: query.days,
          results,
        },
      }, 200);
    }

    // Single day request
    const sunData = await getSunriseSunset(query.lat, query.lng, date);

    if (!sunData) {
      return c.json({
        success: false,
        error: {
          code: 'SUN_DATA_UNAVAILABLE',
          message: 'Unable to retrieve sunrise/sunset data for the specified location and date',
        },
      }, 503);
    }

    return c.json({
      success: true,
      data: {
        latitude: query.lat,
        longitude: query.lng,
        date,
        ...sunData,
      },
    }, 200);

  } catch (error) {
    console.error('Sunrise endpoint error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Latitude must be between')) {
        return c.json({
          success: false,
          error: {
            code: 'INVALID_LATITUDE',
            message: error.message,
          },
        }, 400);
      }
      if (error.message.includes('Longitude must be between')) {
        return c.json({
          success: false,
          error: {
            code: 'INVALID_LONGITUDE',
            message: error.message,
          },
        }, 400);
      }
      if (error.message.includes('Date must be in YYYY-MM-DD')) {
        return c.json({
          success: false,
          error: {
            code: 'INVALID_DATE_FORMAT',
            message: error.message,
          },
        }, 400);
      }
    }

    return c.json({
      success: false,
      error: {
        code: 'SUN_DATA_ERROR',
        message: 'Failed to retrieve sunrise/sunset data',
      },
    }, 500);
  }
});

/**
 * GET /location/timezones
 * List supported timezones
 */
app.get('/timezones', (c) => {
  // Return common timezone examples
  const timezones = [
    { id: 'UTC', name: 'Coordinated Universal Time', region: 'Global' },
    { id: 'America/New_York', name: 'Eastern Time', region: 'North America' },
    { id: 'America/Chicago', name: 'Central Time', region: 'North America' },
    { id: 'America/Denver', name: 'Mountain Time', region: 'North America' },
    { id: 'America/Los_Angeles', name: 'Pacific Time', region: 'North America' },
    { id: 'Europe/London', name: 'Greenwich Mean Time', region: 'Europe' },
    { id: 'Europe/Paris', name: 'Central European Time', region: 'Europe' },
    { id: 'Europe/Berlin', name: 'Central European Time', region: 'Europe' },
    { id: 'Asia/Tokyo', name: 'Japan Standard Time', region: 'Asia' },
    { id: 'Asia/Shanghai', name: 'China Standard Time', region: 'Asia' },
    { id: 'Asia/Singapore', name: 'Singapore Time', region: 'Asia' },
    { id: 'Asia/Dubai', name: 'Gulf Standard Time', region: 'Middle East' },
    { id: 'Australia/Sydney', name: 'Australian Eastern Time', region: 'Oceania' },
    { id: 'Pacific/Auckland', name: 'New Zealand Time', region: 'Oceania' },
  ];

  return c.json({
    success: true,
    data: {
      timezones,
      note: 'This is a sample of supported timezones. The API accepts any valid IANA timezone identifier.',
    },
  }, 200);
});

export default app;

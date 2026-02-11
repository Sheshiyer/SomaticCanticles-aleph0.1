/**
 * Sunrise/Sunset Calculation Module
 * 
 * Calculates sunrise and sunset times for a given location and date.
 * Uses the sunrise-sunset.org API with local caching in D1.
 */

import { db } from '../../../db';
import { sunCache } from '../../../db/schema';
import { eq } from 'drizzle-orm';


export interface SunriseSunsetData {
  /** ISO timestamp of sunrise in local time */
  sunrise: string | null;
  /** ISO timestamp of sunset in local time */
  sunset: string | null;
  /** ISO timestamp of solar noon in local time */
  solarNoon: string | null;
  /** Day length as HH:MM:SS string */
  dayLength: string | null;
  /** Whether data came from cache */
  cached: boolean;
}

export interface SunAPIResponse {
  results: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    day_length: number;
    civil_twilight_begin: string;
    civil_twilight_end: string;
    nautical_twilight_begin: string;
    nautical_twilight_end: string;
    astronomical_twilight_begin: string;
    astronomical_twilight_end: string;
  };
  status: string;
}

// Sunrise-Sunset.org API endpoint
const SUN_API_BASE = 'https://api.sunrise-sunset.org/json';

/**
 * Generate cache key for location+date
 */
function generateCacheKey(latitude: number, longitude: number, date: string): string {
  // Round coordinates to 4 decimal places for caching (~11m precision)
  const lat = Math.round(latitude * 10000) / 10000;
  const lng = Math.round(longitude * 10000) / 10000;
  return `${lat},${lng},${date}`;
}

/**
 * Check D1 cache for sun data (now Postgres)
 */
async function getCachedSunData(
  latitude: number,
  longitude: number,
  date: string
): Promise<SunriseSunsetData | null> {
  try {
    const cacheKey = generateCacheKey(latitude, longitude, date);

    const result = await db.query.sunCache.findFirst({
      where: eq(sunCache.id, cacheKey)
    });

    if (!result) {
      return null;
    }

    // Check if cache is older than 30 days
    const cachedAt = result.cachedAt;
    // cachedAt is Date in Postgres schema (timestamp), or null? 
    // Schema says timestamp().defaultNow(). It returns Date object in Drizzle/Postgres usually.
    if (!cachedAt) return null;

    const cacheDate = new Date(cachedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 30) {
      // Cache expired
      return null;
    }

    return {
      sunrise: result.sunrise,
      sunset: result.sunset,
      solarNoon: result.solarNoon,
      dayLength: result.dayLength,
      cached: true,
    };
  } catch (error) {
    console.error('Error reading sun cache:', error);
    return null;
  }
}

/**
 * Store sun data in cache
 */
async function cacheSunData(
  latitude: number,
  longitude: number,
  date: string,
  data: Omit<SunriseSunsetData, 'cached'>
): Promise<void> {
  try {
    const cacheKey = generateCacheKey(latitude, longitude, date);

    await db.insert(sunCache).values({
      id: cacheKey,
      latitude,
      longitude,
      date,
      sunrise: data.sunrise,
      sunset: data.sunset,
      solarNoon: data.solarNoon,
      dayLength: data.dayLength,
      cachedAt: new Date()
    }).onConflictDoUpdate({
      target: sunCache.id,
      set: {
        sunrise: data.sunrise,
        sunset: data.sunset,
        solarNoon: data.solarNoon,
        dayLength: data.dayLength,
        cachedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error caching sun data:', error);
    // Non-fatal
  }
}

/**
 * Format seconds to HH:MM:SS
 */
function secondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse 12-hour time string (e.g., "6:30:45 AM") to 24-hour format
 */
function parseTimeTo24Hour(timeStr: string): string {
  const match = timeStr.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return timeStr;

  let hours = parseInt(match[1]!, 10);
  const minutes = match[2]!;
  const seconds = match[3]!;
  const period = match[4]!.toUpperCase();

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
}

/**
 * Fetch sunrise/sunset data from API
 */
async function fetchSunDataFromAPI(
  latitude: number,
  longitude: number,
  date: string
): Promise<SunriseSunsetData | null> {
  try {
    const url = new URL(SUN_API_BASE);
    url.searchParams.set('lat', latitude.toString());
    url.searchParams.set('lng', longitude.toString());
    url.searchParams.set('date', date);
    url.searchParams.set('formatted', '0'); // Get raw time format

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Sun API returned ${response.status}`);
    }

    const data = await response.json() as SunAPIResponse;

    if (data.status !== 'OK') {
      throw new Error(`Sun API error: ${data.status}`);
    }

    return {
      sunrise: data.results.sunrise,
      sunset: data.results.sunset,
      solarNoon: data.results.solar_noon,
      dayLength: secondsToHMS(data.results.day_length),
      cached: false,
    };
  } catch (error) {
    console.error('Error fetching sun data:', error);
    return null;
  }
}

/**
 * Get sunrise and sunset times for a location and date
 * Uses cache if available, otherwise fetches from API
 * 
 * @param latitude - Latitude (-90 to 90)
 * @param longitude - Longitude (-180 to 180)
 * @param date - Date in YYYY-MM-DD format
 * @param db - D1 database instance for caching
 * @returns Sunrise/sunset data or null if unavailable
 */
export async function getSunriseSunset(
  latitude: number,
  longitude: number,
  date: string
): Promise<SunriseSunsetData | null> {
  // Validate inputs
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must be in YYYY-MM-DD format');
  }

  // Try cache first
  const cached = await getCachedSunData(latitude, longitude, date);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const data = await fetchSunDataFromAPI(latitude, longitude, date);

  if (data) {
    // Cache the result
    await cacheSunData(latitude, longitude, date, data);
  }

  return data;
}

/**
 * Get sun data for multiple dates
 */
/**
 * Get sun data for multiple dates
 */
export async function getSunriseSunsetRange(
  latitude: number,
  longitude: number,
  startDate: string,
  days: number
): Promise<Array<{ date: string } & SunriseSunsetData>> {
  const results: Array<{ date: string } & SunriseSunsetData> = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0]!;

    // Note: this serial execution is inefficient for many days, but fine for small range
    const sunData = await getSunriseSunset(latitude, longitude, dateStr!);

    if (sunData) {
      results.push({
        date: dateStr!,
        ...sunData,
      });
    }
  }

  return results;
}

/**
 * Calculate golden hour times (for photography/meditation purposes)
 */
export function calculateGoldenHours(sunrise: string, sunset: string): {
  morningGoldenHourStart: string;
  morningGoldenHourEnd: string;
  eveningGoldenHourStart: string;
  eveningGoldenHourEnd: string;
} {
  const sunriseDate = new Date(sunrise);
  const sunsetDate = new Date(sunset);

  // Golden hour is approximately 1 hour after sunrise and 1 hour before sunset
  const morningGoldenHourStart = new Date(sunriseDate.getTime());
  const morningGoldenHourEnd = new Date(sunriseDate.getTime() + 60 * 60 * 1000);

  const eveningGoldenHourStart = new Date(sunsetDate.getTime() - 60 * 60 * 1000);
  const eveningGoldenHourEnd = new Date(sunsetDate.getTime());

  return {
    morningGoldenHourStart: morningGoldenHourStart.toISOString(),
    morningGoldenHourEnd: morningGoldenHourEnd.toISOString(),
    eveningGoldenHourStart: eveningGoldenHourStart.toISOString(),
    eveningGoldenHourEnd: eveningGoldenHourEnd.toISOString(),
  };
}

/**
 * Check if it's currently day or night at a location
 */
export function isDaytime(sunrise: string, sunset: string, currentTime?: Date): boolean {
  const now = currentTime || new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);

  return now >= sunriseTime && now < sunsetTime;
}

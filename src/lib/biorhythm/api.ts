// Biorhythm API Client for Somatic-Canticles
// Handles all API calls related to biorhythm calculations

import type {
  BiorhythmData,
  PredictionData,
  CalculateBiorhythmRequest,
  GetPredictionRequest,
  BiorhythmResponse,
  PredictionResponse,
  BiorhythmApiError,
} from './types';

// Re-export types for convenience
export * from './types';

import { createClient } from '@/lib/supabase/client';

// ... imports ...

// Prefer internal Next.js API by default.
// Legacy worker API is used only for explicit localhost worker development.
const CONFIGURED_API_BASE = process.env.NEXT_PUBLIC_API_URL?.trim();
const API_BASE_URL =
  CONFIGURED_API_BASE && CONFIGURED_API_BASE.includes("localhost:8787")
    ? CONFIGURED_API_BASE
    : "/api";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCK_BIORHYTHM === "true";

/**
 * Helper function to make authenticated API requests
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as BiorhythmApiError;
  }

  return data as T;
}

// ============================================
// MOCK DATA FOR DEVELOPMENT
// ============================================

function generateMockBiorhythmData(birthdate: string, targetDate?: string): BiorhythmData {
  const date = targetDate || new Date().toISOString().split('T')[0];
  const birth = new Date(birthdate);
  const target = new Date(date);
  const daysSinceBirth = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate cycle values using sine waves
  const calculateCycle = (days: number, cycleLength: number): number => {
    return Math.sin((2 * Math.PI * days) / cycleLength);
  };

  return {
    date,
    physical: {
      date,
      value: calculateCycle(daysSinceBirth, 23),
      days: daysSinceBirth,
    },
    emotional: {
      date,
      value: calculateCycle(daysSinceBirth, 28),
      days: daysSinceBirth,
    },
    intellectual: {
      date,
      value: calculateCycle(daysSinceBirth, 33),
      days: daysSinceBirth,
    },
    spiritual: {
      date,
      value: calculateCycle(daysSinceBirth, 21),
      days: daysSinceBirth,
    },
  };
}

function generateMockPredictionData(startDate?: string, days: number = 30): PredictionData {
  const start = startDate || new Date().toISOString().split('T')[0];
  const startDateTime = new Date(start);
  const predictions: PredictionData['predictions'] = [];
  const peaks: PredictionData['peaks'] = {
    physical: [],
    emotional: [],
    intellectual: [],
    spiritual: [],
  };
  const criticalDays: PredictionData['criticalDays'] = {
    physical: [],
    emotional: [],
    intellectual: [],
    spiritual: [],
  };

  // Use a fixed birthdate for mock predictions
  const birthdate = new Date('1990-01-01');

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDateTime);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    const daysSinceBirth = Math.floor(
      (currentDate.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const physical = Math.sin((2 * Math.PI * daysSinceBirth) / 23);
    const emotional = Math.sin((2 * Math.PI * daysSinceBirth) / 28);
    const intellectual = Math.sin((2 * Math.PI * daysSinceBirth) / 33);
    const spiritual = Math.sin((2 * Math.PI * daysSinceBirth) / 21);

    predictions.push({
      date: dateStr,
      physical,
      emotional,
      intellectual,
      spiritual,
    });

    // Identify peaks (> 0.8)
    if (physical > 0.8) peaks.physical.push(dateStr);
    if (emotional > 0.8) peaks.emotional.push(dateStr);
    if (intellectual > 0.8) peaks.intellectual.push(dateStr);
    if (spiritual > 0.8) peaks.spiritual.push(dateStr);

    // Identify critical days (near zero)
    if (Math.abs(physical) < 0.1) criticalDays.physical.push(dateStr);
    if (Math.abs(emotional) < 0.1) criticalDays.emotional.push(dateStr);
    if (Math.abs(intellectual) < 0.1) criticalDays.intellectual.push(dateStr);
    if (Math.abs(spiritual) < 0.1) criticalDays.spiritual.push(dateStr);
  }

  const endDateTime = new Date(startDateTime);
  endDateTime.setDate(endDateTime.getDate() + days - 1);

  return {
    startDate: start,
    endDate: endDateTime.toISOString().split('T')[0],
    predictions,
    peaks,
    criticalDays,
  };
}

// ============================================
// BIORHYTHM API METHODS
// ============================================

/**
 * Calculate biorhythm cycles for a given birthdate
 * POST /biorhythm/calculate
 * 
 * @param birthdate - User's birthdate in ISO format (YYYY-MM-DD)
 * @param targetDate - Optional target date (defaults to today)
 * @returns Biorhythm data for all four cycles
 */
export async function calculateBiorhythm(
  birthdate: string,
  targetDate?: string,
  timezone?: string
): Promise<BiorhythmData> {
  if (USE_MOCKS) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Validate birthdate format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      throw {
        success: false,
        error: {
          code: 'BIORHYTHM_INVALID_BIRTHDATE',
          message: 'Birthdate must be in YYYY-MM-DD format',
        },
      } as BiorhythmApiError;
    }

    return generateMockBiorhythmData(birthdate, targetDate);
  }

  const body: CalculateBiorhythmRequest = {
    birthdate,
    ...(targetDate && { targetDate }),
    ...(timezone && { timezone }),
  };

  const response = await apiRequest<BiorhythmResponse>('/biorhythm/calculate', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return response.data;
}

/**
 * Get biorhythm predictions for a date range
 * GET /biorhythm/predict
 * 
 * @param startDate - Start date in ISO format (defaults to today)
 * @param days - Number of days to predict (defaults to 30)
 * @returns Prediction data including daily values, peaks, and critical days
 */
export async function getBiorhythmPrediction(
  startDate?: string,
  days: number = 30,
  options?: { birthdate?: string; timezone?: string }
): Promise<PredictionData> {
  if (USE_MOCKS) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    return generateMockPredictionData(startDate, days);
  }

  const params: GetPredictionRequest = {
    ...(startDate && { startDate }),
    ...(days !== 30 && { days }),
    ...(options?.birthdate && { birthdate: options.birthdate }),
    ...(options?.timezone && { timezone: options.timezone }),
  };

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const endpoint = `/biorhythm/predict${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<PredictionResponse>(endpoint, {
    method: 'GET',
  });

  return response.data;
}

/**
 * Handle API errors gracefully
 * Returns a user-friendly error message
 */
export function getBiorhythmErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'error' in error) {
    const apiError = error as BiorhythmApiError;
    return apiError.error?.message || 'An unexpected error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to fetch biorhythm data. Please try again later.';
}

/**
 * Check if an error is a biorhythm API error
 */
export function isBiorhythmApiError(error: unknown): error is BiorhythmApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'success' in error &&
    error.success === false &&
    'error' in error
  );
}

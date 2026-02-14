// Biorhythm Types for Somatic-Canticles Frontend

/**
 * Represents a single cycle value at a specific date
 */
export interface CycleValue {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Cycle value between -1 and 1 */
  value: number;
  /** Days since birth */
  days: number;
}

/**
 * Represents all four biorhythm cycles for a specific date
 */
export interface BiorhythmData {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Physical cycle: 23 days (red/octave) */
  physical: CycleValue;
  /** Emotional cycle: 28 days (purple/transform) */
  emotional: CycleValue;
  /** Intellectual cycle: 33 days (blue/architect) */
  intellectual: CycleValue;
  /** Spiritual cycle: 38 days (gold/solar) */
  spiritual: CycleValue;
}

/**
 * Represents a single day's prediction data
 */
export interface PredictionDay {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Physical cycle value (-1 to 1) */
  physical: number;
  /** Emotional cycle value (-1 to 1) */
  emotional: number;
  /** Intellectual cycle value (-1 to 1) */
  intellectual: number;
  /** Spiritual cycle value (-1 to 1) */
  spiritual: number;
}

/**
 * Represents the complete prediction data from the API
 */
export interface PredictionData {
  /** Start date of the prediction range */
  startDate: string;
  /** End date of the prediction range */
  endDate: string;
  /** Array of daily predictions */
  predictions: PredictionDay[];
  /** Peak days for each cycle */
  peaks: {
    physical: string[];
    emotional: string[];
    intellectual: string[];
    spiritual: string[];
  };
  /** Critical days (near zero crossings) for each cycle */
  criticalDays: {
    physical: string[];
    emotional: string[];
    intellectual: string[];
    spiritual: string[];
  };
}

/**
 * Request body for calculating biorhythm
 */
export interface CalculateBiorhythmRequest {
  /** User's birthdate in ISO format (YYYY-MM-DD) */
  birthdate: string;
  /** Optional target date (defaults to today) */
  targetDate?: string;
  /** Optional IANA timezone (defaults to UTC server-side) */
  timezone?: string;
}

/**
 * Request parameters for getting predictions
 */
export interface GetPredictionRequest {
  /** Start date in ISO format (defaults to today) */
  startDate?: string;
  /** Number of days to predict (defaults to 30) */
  days?: number;
  /** Optional IANA timezone (defaults to UTC server-side) */
  timezone?: string;
  /** Optional birthdate fallback if profile lookup is unavailable */
  birthdate?: string;
}

/**
 * API Response wrapper for biorhythm data
 */
export interface BiorhythmResponse {
  success: true;
  data: BiorhythmData;
}

/**
 * API Response wrapper for prediction data
 */
export interface PredictionResponse {
  success: true;
  data: PredictionData;
}

/**
 * API Error response
 */
export interface BiorhythmApiError {
  success: false;
  error: {
    code: BiorhythmErrorCode;
    message: string;
  };
}

/**
 * Biorhythm-specific error codes
 */
export type BiorhythmErrorCode =
  | 'BIORHYTHM_INVALID_BIRTHDATE'
  | 'BIORHYTHM_INVALID_DATE_RANGE'
  | 'BIORHYTHM_CALCULATION_ERROR'
  | 'BIORHYTHM_USER_NOT_FOUND'
  | 'BIORHYTHM_UNAUTHORIZED'
  | 'BIORHYTHM_RATE_LIMITED'
  | 'BIORHYTHM_INTERNAL_ERROR';

/**
 * Cycle configuration for UI display
 */
export interface CycleConfig {
  /** Cycle identifier */
  key: 'physical' | 'emotional' | 'intellectual' | 'spiritual';
  /** Display name */
  name: string;
  /** Color key matching power-number colors */
  color: 'octave' | 'transform' | 'architect' | 'solar';
  /** Hex color value */
  colorValue: string;
  /** Cycle length in days */
  length: number;
  /** Description of the cycle */
  description: string;
}

/**
 * Cycle configurations for the four biorhythm cycles
 */
export const CYCLE_CONFIGS: CycleConfig[] = [
  {
    key: 'physical',
    name: 'Physical',
    color: 'octave',
    colorValue: '#FF6B6B',
    length: 23,
    description: 'Strength, coordination, and physical well-being',
  },
  {
    key: 'emotional',
    name: 'Emotional',
    color: 'transform',
    colorValue: '#9B59B6',
    length: 28,
    description: 'Mood, sensitivity, and emotional awareness',
  },
  {
    key: 'intellectual',
    name: 'Intellectual',
    color: 'architect',
    colorValue: '#3498DB',
    length: 33,
    description: 'Mental clarity, logic, and analytical thinking',
  },
  {
    key: 'spiritual',
    name: 'Spiritual',
    color: 'solar',
    colorValue: '#F1C40F',
    length: 38,
    description: 'Intuition, creativity, and spiritual connection',
  },
];

/**
 * Get cycle configuration by key
 */
export function getCycleConfig(
  key: 'physical' | 'emotional' | 'intellectual' | 'spiritual'
): CycleConfig {
  const config = CYCLE_CONFIGS.find((c) => c.key === key);
  if (!config) {
    throw new Error(`Invalid cycle key: ${key}`);
  }
  return config;
}

/**
 * Format cycle value as percentage string
 */
export function formatCyclePercentage(value: number): string {
  const percentage = Math.round(value * 100);
  return `${percentage > 0 ? '+' : ''}${percentage}%`;
}

/**
 * Check if a cycle value is at peak (> 80%)
 */
export function isPeak(value: number): boolean {
  return value > 0.8;
}

/**
 * Check if a cycle value is critical (near zero, within 10%)
 */
export function isCritical(value: number): boolean {
  return Math.abs(value) < 0.1;
}

/**
 * Get status label for a cycle value
 */
export function getCycleStatus(value: number): 'peak' | 'high' | 'neutral' | 'low' | 'critical' {
  if (isPeak(value)) return 'peak';
  if (isCritical(value)) return 'critical';
  if (value > 0.3) return 'high';
  if (value < -0.3) return 'low';
  return 'neutral';
}

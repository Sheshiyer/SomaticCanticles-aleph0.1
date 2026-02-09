/**
 * Biorhythm Calculator Module
 * 
 * Calculates biorhythm cycles based on birthdate and target date.
 * Supports Physical (23d), Emotional (28d), Intellectual (33d), and Spiritual (21d) cycles.
 */

export interface BiorhythmValues {
  /** Physical cycle value (-1 to 1), 23-day period */
  physical: number;
  /** Emotional cycle value (-1 to 1), 28-day period */
  emotional: number;
  /** Intellectual cycle value (-1 to 1), 33-day period */
  intellectual: number;
  /** Spiritual cycle value (-1 to 1), 21-day period */
  spiritual: number;
}

export interface BiorhythmResult extends BiorhythmValues {
  /** ISO date string for the calculated day */
  date: string;
  /** Array of cycle names that are in peak state (> 0.8) */
  peaks: string[];
  /** Array of cycle names that are in critical state (near 0) */
  criticalDays: string[];
}

export interface DailyBiorhythm extends BiorhythmResult {
  /** Days since birth */
  daysSinceBirth: number;
}

// Cycle length constants
export const CYCLE_LENGTHS = {
  physical: 23,
  emotional: 28,
  intellectual: 33,
  spiritual: 21,
} as const;

// Threshold constants
export const THRESHOLDS = {
  /** Value above which a cycle is considered at peak */
  peak: 0.8,
  /** Absolute value below which a day is considered critical */
  critical: 0.1,
} as const;

/**
 * Calculate days between birthdate and target date, accounting for timezone
 * Uses midnight-to-midnight comparison in the target timezone
 */
export function getDaysBetween(
  birthdate: string | Date,
  targetDate: string | Date,
  timezone: string = 'UTC'
): number {
  // Parse dates if string provided
  const birth = typeof birthdate === 'string' ? new Date(birthdate) : new Date(birthdate);
  const target = typeof targetDate === 'string' ? new Date(targetDate) : new Date(targetDate);

  // Validate dates
  if (isNaN(birth.getTime())) {
    throw new Error('Invalid birthdate provided');
  }
  if (isNaN(target.getTime())) {
    throw new Error('Invalid target date provided');
  }

  // Normalize both dates to midnight in the target timezone
  const birthMidnight = normalizeToMidnight(birth, timezone);
  const targetMidnight = normalizeToMidnight(target, timezone);

  // Calculate difference in days
  const diffMs = targetMidnight.getTime() - birthMidnight.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Normalize a date to midnight in the specified timezone
 */
function normalizeToMidnight(date: Date, timezone: string): Date {
  try {
    // Create a formatter for the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Get the date parts in the target timezone
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;

    if (!year || !month || !day) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }

    // Create a new date at midnight UTC for that calendar day
    // This ensures consistent day counting
    return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
  } catch (error) {
    // Fallback: treat as UTC if timezone is invalid
    console.warn(`Invalid timezone "${timezone}", falling back to UTC`);
    const utcDate = new Date(date);
    return new Date(Date.UTC(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate()
    ));
  }
}

/**
 * Calculate a single biorhythm cycle value
 * Formula: sin(2π × days / cycle_length)
 * Result is in range [-1, 1]
 */
export function calculateCycle(daysSinceBirth: number, cycleLength: number): number {
  if (cycleLength <= 0) {
    throw new Error('Cycle length must be positive');
  }
  
  const radians = (2 * Math.PI * daysSinceBirth) / cycleLength;
  const value = Math.sin(radians);
  
  // Round to 6 decimal places to avoid floating point noise
  return Math.round(value * 1000000) / 1000000;
}

/**
 * Calculate all four biorhythm cycles for a given number of days since birth
 */
export function calculateAllCyclesFromDays(daysSinceBirth: number): BiorhythmValues {
  return {
    physical: calculateCycle(daysSinceBirth, CYCLE_LENGTHS.physical),
    emotional: calculateCycle(daysSinceBirth, CYCLE_LENGTHS.emotional),
    intellectual: calculateCycle(daysSinceBirth, CYCLE_LENGTHS.intellectual),
    spiritual: calculateCycle(daysSinceBirth, CYCLE_LENGTHS.spiritual),
  };
}

/**
 * Detect peaks and critical days from biorhythm values
 */
export function analyzeCycles(values: BiorhythmValues): { peaks: string[]; criticalDays: string[] } {
  const peaks: string[] = [];
  const criticalDays: string[] = [];

  for (const [cycle, value] of Object.entries(values)) {
    // Check for peak (value > 0.8)
    if (value > THRESHOLDS.peak) {
      peaks.push(cycle);
    }
    
    // Check for critical day (value near 0)
    if (Math.abs(value) < THRESHOLDS.critical) {
      criticalDays.push(cycle);
    }
  }

  return { peaks, criticalDays };
}

/**
 * Main function: Calculate biorhythm for a single date
 * 
 * @param birthdate - Birth date (ISO string or Date)
 * @param targetDate - Target date to calculate for (ISO string or Date), defaults to today
 * @param timezone - Timezone for date calculation (IANA format), defaults to 'UTC'
 * @returns Biorhythm values with peaks and critical days marked
 */
export function calculateBiorhythm(
  birthdate: string | Date,
  targetDate: string | Date = new Date(),
  timezone: string = 'UTC'
): BiorhythmResult {
  const daysSinceBirth = getDaysBetween(birthdate, targetDate, timezone);
  
  if (daysSinceBirth < 0) {
    throw new Error('Target date cannot be before birthdate');
  }

  const cycles = calculateAllCyclesFromDays(daysSinceBirth);
  const analysis = analyzeCycles(cycles);

  // Format the date string
  const target = typeof targetDate === 'string' ? new Date(targetDate) : new Date(targetDate);
  const dateStr = normalizeToMidnight(target, timezone).toISOString().split('T')[0]!;

  return {
    date: dateStr,
    ...cycles,
    ...analysis,
  };
}

/**
 * Calculate biorhythm cycles for a range of dates
 * 
 * @param birthdate - Birth date (ISO string or Date)
 * @param startDate - Start date for calculation range (ISO string or Date)
 * @param days - Number of days to calculate (default 30)
 * @param timezone - Timezone for date calculation (IANA format), defaults to 'UTC'
 * @returns Array of daily biorhythm calculations
 */
export function calculateAllCycles(
  birthdate: string | Date,
  startDate: string | Date = new Date(),
  days: number = 30,
  timezone: string = 'UTC'
): DailyBiorhythm[] {
  if (days < 1 || days > 365) {
    throw new Error('Days must be between 1 and 365');
  }

  const results: DailyBiorhythm[] = [];
  const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);

  for (let i = 0; i < days; i++) {
    const targetDate = new Date(start);
    targetDate.setUTCDate(targetDate.getUTCDate() + i);

    const daysSinceBirth = getDaysBetween(birthdate, targetDate, timezone);
    const cycles = calculateAllCyclesFromDays(daysSinceBirth);
    const analysis = analyzeCycles(cycles);

    results.push({
      date: targetDate.toISOString().split('T')[0]!,
      daysSinceBirth,
      ...cycles,
      ...analysis,
    });
  }

  return results;
}

/**
 * Get the phase description for a cycle value
 */
export function getCyclePhase(value: number): 'positive' | 'negative' | 'critical' | 'peak' {
  if (Math.abs(value) < THRESHOLDS.critical) return 'critical';
  if (value > THRESHOLDS.peak) return 'peak';
  if (value > 0) return 'positive';
  return 'negative';
}

/**
 * Get human-readable description of cycle state
 */
export function getCycleDescription(cycleName: string, value: number): string {
  const phase = getCyclePhase(value);
  
  const descriptions: Record<string, Record<string, string>> = {
    physical: {
      positive: 'High energy, good for physical activities',
      negative: 'Lower energy, prioritize rest and recovery',
      critical: 'Transition day - avoid strenuous activities',
      peak: 'Peak physical performance - ideal for challenges',
    },
    emotional: {
      positive: 'Emotional stability, good for relationships',
      negative: 'Emotional sensitivity, practice self-care',
      critical: 'Emotional transition - be patient with yourself',
      peak: 'Peak emotional awareness - deep connections possible',
    },
    intellectual: {
      positive: 'Mental clarity, good for problem-solving',
      negative: 'Mental fog, avoid complex decisions',
      critical: 'Intellectual transition - double-check your work',
      peak: 'Peak mental acuity - tackle difficult problems',
    },
    spiritual: {
      positive: 'Spiritual openness, good for meditation',
      negative: 'Inward focus, reflect and ground yourself',
      critical: 'Spiritual transition - be open to insights',
      peak: 'Peak spiritual awareness - profound insights possible',
    },
  };

  return descriptions[cycleName]?.[phase] || 'Unknown cycle state';
}

/**
 * Validate timezone string (basic validation)
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Format biorhythm value for display (percentage)
 */
export function formatAsPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

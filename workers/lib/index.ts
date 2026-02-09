// Library exports for Somatic-Canticles Workers

// Secrets management
export {
  SecretsManager,
  createSecretsManager,
  validateSecrets,
  generateSecureSecret,
  type SecretsEnv,
} from './secrets';

// Database
export { createDB, schema } from './db';

// Crypto utilities
export {
  generateRandomString,
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  generateSecureToken,
  hashToken,
  timingSafeEqual,
} from './crypto';

// Types
export type { DB } from './db';

// Biorhythm calculator
export {
  calculateBiorhythm,
  calculateAllCycles,
  calculateCycle,
  calculateAllCyclesFromDays,
  getDaysBetween,
  analyzeCycles,
  isValidTimezone,
  formatAsPercentage,
  getCyclePhase,
  CYCLE_LENGTHS,
  THRESHOLDS,
  type BiorhythmValues,
  type BiorhythmResult,
  type DailyBiorhythm,
} from './biorhythm/calculator';

// Location utilities
export {
  getSunriseSunset,
  getSunriseSunsetRange,
  calculateGoldenHours,
  isDaytime,
  type SunriseSunsetData,
  sunCache,
} from './location/sun';

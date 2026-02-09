import { describe, it, expect } from 'bun:test';
import {
  calculateBiorhythm,
  calculateAllCycles,
  calculateCycle,
  getDaysBetween,
  analyzeCycles,
  getCyclePhase,
  getCycleDescription,
  formatAsPercentage,
  CYCLE_LENGTHS,
  THRESHOLDS,
  type BiorhythmValues,
} from '../lib/biorhythm/calculator';

describe('Biorhythm Calculator', () => {
  const birthdate = '1990-01-01';

  describe('getDaysBetween', () => {
    it('should calculate days between dates correctly', () => {
      const days = getDaysBetween(birthdate, '1990-01-15');
      expect(days).toBe(14);
    });

    it('should handle timezone parameter', () => {
      const days = getDaysBetween(birthdate, '1990-01-15', 'America/New_York');
      expect(days).toBe(14);
    });

    it('should throw error for invalid birthdate', () => {
      expect(() => getDaysBetween('invalid', '1990-01-15')).toThrow('Invalid birthdate');
    });

    it('should throw error for invalid target date', () => {
      expect(() => getDaysBetween(birthdate, 'invalid')).toThrow('Invalid target date');
    });

    it('should handle same day', () => {
      const days = getDaysBetween(birthdate, birthdate);
      expect(days).toBe(0);
    });
  });

  describe('calculateCycle', () => {
    it('should calculate physical cycle (23 days)', () => {
      const value = calculateCycle(0, CYCLE_LENGTHS.physical);
      expect(value).toBe(0); // sin(0) = 0

      const day23 = calculateCycle(23, CYCLE_LENGTHS.physical);
      expect(day23).toBeCloseTo(0, 5); // Should be near 0 after full cycle
    });

    it('should calculate emotional cycle (28 days)', () => {
      const value = calculateCycle(7, CYCLE_LENGTHS.emotional);
      expect(value).toBe(1); // Peak at quarter cycle
    });

    it('should calculate intellectual cycle (33 days)', () => {
      const value = calculateCycle(16, CYCLE_LENGTHS.intellectual);
      expect(value).toBeCloseTo(0.998, 2); // Near peak at ~quarter
    });

    it('should throw error for zero cycle length', () => {
      expect(() => calculateCycle(10, 0)).toThrow('Cycle length must be positive');
    });

    it('should return values between -1 and 1', () => {
      for (let day = 0; day < 100; day++) {
        const physical = calculateCycle(day, CYCLE_LENGTHS.physical);
        expect(physical).toBeGreaterThanOrEqual(-1);
        expect(physical).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('calculateBiorhythm', () => {
    it('should calculate all four cycles', () => {
      const result = calculateBiorhythm(birthdate, '2024-01-15');
      
      expect(result).toHaveProperty('physical');
      expect(result).toHaveProperty('emotional');
      expect(result).toHaveProperty('intellectual');
      expect(result).toHaveProperty('spiritual');
      expect(result).toHaveProperty('peaks');
      expect(result).toHaveProperty('criticalDays');
      expect(result).toHaveProperty('date');
    });

    it('should detect peaks correctly', () => {
      // At day 5.75 of physical cycle (quarter way, should be peak)
      const result = calculateBiorhythm(birthdate, '1990-01-06');
      expect(result.physical).toBeGreaterThan(0.9);
    });

    it('should detect critical days (near 0)', () => {
      // Day 0 should be critical for all cycles
      const result = calculateBiorhythm(birthdate, birthdate);
      expect(result.physical).toBeCloseTo(0, 5);
    });

    it('should throw error for date before birthdate', () => {
      expect(() => calculateBiorhythm('2024-01-01', '1990-01-01')).toThrow();
    });

    it('should use default timezone UTC', () => {
      const result1 = calculateBiorhythm(birthdate, '2024-01-15');
      const result2 = calculateBiorhythm(birthdate, '2024-01-15', 'UTC');
      expect(result1.physical).toBe(result2.physical);
    });
  });

  describe('calculateAllCycles', () => {
    it('should calculate range of days', () => {
      const results = calculateAllCycles(birthdate, '2024-01-01', 7);
      expect(results).toHaveLength(7);
    });

    it('should have consecutive days', () => {
      const results = calculateAllCycles(birthdate, '2024-01-01', 3);
      expect(results[0].date).toBe('2024-01-01');
      expect(results[1].date).toBe('2024-01-02');
      expect(results[2].date).toBe('2024-01-03');
    });

    it('should throw error for invalid day range', () => {
      expect(() => calculateAllCycles(birthdate, '2024-01-01', 0)).toThrow('Days must be between 1 and 365');
      expect(() => calculateAllCycles(birthdate, '2024-01-01', 366)).toThrow('Days must be between 1 and 365');
    });

    it('should include daysSinceBirth in results', () => {
      const results = calculateAllCycles(birthdate, birthdate, 3);
      expect(results[0].daysSinceBirth).toBe(0);
      expect(results[1].daysSinceBirth).toBe(1);
      expect(results[2].daysSinceBirth).toBe(2);
    });
  });

  describe('analyzeCycles', () => {
    it('should detect peaks', () => {
      const values: BiorhythmValues = {
        physical: 0.9,
        emotional: 0.5,
        intellectual: 0.85,
        spiritual: 0.3,
      };
      const result = analyzeCycles(values);
      expect(result.peaks).toContain('physical');
      expect(result.peaks).toContain('intellectual');
      expect(result.peaks).not.toContain('spiritual');
    });

    it('should detect critical days', () => {
      const values: BiorhythmValues = {
        physical: 0.05,
        emotional: -0.02,
        intellectual: 0.5,
        spiritual: -0.08,
      };
      const result = analyzeCycles(values);
      expect(result.criticalDays).toContain('physical');
      expect(result.criticalDays).toContain('emotional');
      expect(result.criticalDays).toContain('spiritual');
      expect(result.criticalDays).not.toContain('intellectual');
    });
  });

  describe('getCyclePhase', () => {
    it('should return critical for values near 0', () => {
      expect(getCyclePhase(0.05)).toBe('critical');
      expect(getCyclePhase(-0.05)).toBe('critical');
    });

    it('should return peak for values above threshold', () => {
      expect(getCyclePhase(0.85)).toBe('peak');
    });

    it('should return positive for positive values', () => {
      expect(getCyclePhase(0.5)).toBe('positive');
    });

    it('should return negative for negative values', () => {
      expect(getCyclePhase(-0.5)).toBe('negative');
    });
  });

  describe('getCycleDescription', () => {
    it('should return description for each cycle', () => {
      const physical = getCycleDescription('physical', 0.5);
      expect(physical).toContain('energy');

      const emotional = getCycleDescription('emotional', 0.5);
      expect(emotional).toContain('Emotional');

      const intellectual = getCycleDescription('intellectual', 0.5);
      expect(intellectual).toContain('Mental');

      const spiritual = getCycleDescription('spiritual', 0.5);
      expect(spiritual).toContain('Spiritual');
    });

    it('should handle all phases', () => {
      const phases = ['positive', 'negative', 'critical', 'peak'];
      phases.forEach(phase => {
        const value = phase === 'peak' ? 0.9 : phase === 'critical' ? 0.05 : phase === 'positive' ? 0.5 : -0.5;
        const desc = getCycleDescription('physical', value);
        expect(desc).not.toBe('Unknown cycle state');
      });
    });
  });

  describe('formatAsPercentage', () => {
    it('should format as percentage', () => {
      expect(formatAsPercentage(0.5)).toBe('50%');
      expect(formatAsPercentage(-0.75)).toBe('-75%');
      expect(formatAsPercentage(0)).toBe('0%');
      expect(formatAsPercentage(1)).toBe('100%');
      expect(formatAsPercentage(-1)).toBe('-100%');
    });
  });
});

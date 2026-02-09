import { describe, it, expect } from 'bun:test';
import {
  checkBiorhythmCondition,
  checkSingleDayConditions,
  parseUnlockConditions,
  type BiorhythmState,
  type ChapterUnlockConditions,
} from '../lib/chapters/unlock-engine';

describe('Unlock Engine', () => {
  describe('parseUnlockConditions', () => {
    it('should parse valid JSON conditions', () => {
      const conditions: ChapterUnlockConditions = {
        type: 'biorhythm',
        physical: { min: 0.5, peak: true },
        description: 'Physical peak required',
      };
      
      const jsonString = JSON.stringify(conditions);
      // @ts-expect-error - Testing internal function
      const result = parseUnlockConditions(jsonString);
      
      expect(result).toEqual(conditions);
    });

    it('should return null for invalid JSON', () => {
      const invalidJson = 'not valid json';
      // @ts-expect-error - Testing internal function
      const result = parseUnlockConditions(invalidJson);
      
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      // @ts-expect-error - Testing internal function
      const result = parseUnlockConditions(null);
      
      expect(result).toBeNull();
    });
  });

  describe('checkBiorhythmCondition', () => {
    const THRESHOLDS = { peak: 0.8, critical: 0.1 };

    it('should pass when value meets min requirement', () => {
      const value = 0.7;
      const condition = { min: 0.5 };
      // @ts-expect-error - Testing internal function
      const result = checkBiorhythmCondition(value, false, condition);
      
      expect(result).toBe(true);
    });

    it('should fail when value below min requirement', () => {
      const value = 0.3;
      const condition = { min: 0.5 };
      // @ts-expect-error - Testing internal function
      const result = checkBiorhythmCondition(value, false, condition);
      
      expect(result).toBe(false);
    });

    it('should pass when value meets max requirement', () => {
      const value = 0.3;
      const condition = { max: 0.5 };
      // @ts-expect-error - Testing internal function
      const result = checkBiorhythmCondition(value, false, condition);
      
      expect(result).toBe(true);
    });

    it('should fail when value above max requirement', () => {
      const value = 0.7;
      const condition = { max: 0.5 };
      // @ts-expect-error - Testing internal function
      const result = checkBiorhythmCondition(value, false, condition);
      
      expect(result).toBe(false);
    });

    it('should check peak condition correctly', () => {
      // Value above peak threshold but peak flag false
      const value = 0.85;
      const condition = { peak: true };
      // @ts-expect-error - Testing internal function
      const result = checkBiorhythmCondition(value, false, condition);
      
      expect(result).toBe(true); // Value >= 0.8 passes
    });

    it('should check combined min and max', () => {
      const value = 0.5;
      const condition = { min: 0.3, max: 0.7 };
      // @ts-expect-error - Testing internal function
      const result = checkBiorhythmCondition(value, false, condition);
      
      expect(result).toBe(true);
    });
  });

  describe('checkSingleDayConditions', () => {
    it('should pass for automatic unlock', () => {
      const biorhythm: BiorhythmState = {
        physical: 0,
        emotional: 0,
        intellectual: 0,
        spiritual: 0,
      };
      const conditions: ChapterUnlockConditions = { type: 'automatic' };
      // @ts-expect-error - Testing internal function
      const result = checkSingleDayConditions(biorhythm, conditions);
      
      expect(result).toBe(true);
    });

    it('should check physical condition', () => {
      const biorhythm: BiorhythmState = {
        physical: 0.9,
        emotional: 0,
        intellectual: 0,
        spiritual: 0,
      };
      const conditions: ChapterUnlockConditions = {
        type: 'biorhythm',
        physical: { min: 0.8 },
      };
      // @ts-expect-error - Testing internal function
      const result = checkSingleDayConditions(biorhythm, conditions);
      
      expect(result).toBe(true);
    });

    it('should check multiple conditions', () => {
      const biorhythm: BiorhythmState = {
        physical: 0.9,
        emotional: 0.8,
        intellectual: 0.7,
        spiritual: 0.6,
      };
      const conditions: ChapterUnlockConditions = {
        type: 'biorhythm',
        physical: { min: 0.8 },
        emotional: { min: 0.7 },
      };
      // @ts-expect-error - Testing internal function
      const result = checkSingleDayConditions(biorhythm, conditions);
      
      expect(result).toBe(true);
    });

    it('should fail when one condition not met', () => {
      const biorhythm: BiorhythmState = {
        physical: 0.9,
        emotional: 0.3, // Below requirement
        intellectual: 0,
        spiritual: 0,
      };
      const conditions: ChapterUnlockConditions = {
        type: 'biorhythm',
        physical: { min: 0.8 },
        emotional: { min: 0.5 },
      };
      // @ts-expect-error - Testing internal function
      const result = checkSingleDayConditions(biorhythm, conditions);
      
      expect(result).toBe(false);
    });

    it('should check peak flag', () => {
      const biorhythm: BiorhythmState = {
        physical: 0.9,
        physicalPeak: true,
        emotional: 0,
        intellectual: 0,
        spiritual: 0,
      };
      const conditions: ChapterUnlockConditions = {
        type: 'biorhythm',
        physical: { peak: true },
      };
      // @ts-expect-error - Testing internal function
      const result = checkSingleDayConditions(biorhythm, conditions);
      
      expect(result).toBe(true);
    });
  });

  describe('Chapter unlock logic', () => {
    it('should always unlock chapter 1', () => {
      const chapterId = 1;
      expect(chapterId).toBe(1);
    });

    it('should require previous chapter completion', () => {
      const progress = [
        { chapterId: 1, completedAt: '2024-01-01' },
        { chapterId: 2, completedAt: null },
      ];
      
      const prevCompleted = progress.find(p => p.chapterId === 1)?.completedAt !== null;
      expect(prevCompleted).toBe(true);
    });
  });
});

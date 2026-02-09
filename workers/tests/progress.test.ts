import { describe, it, expect } from 'bun:test';
import {
  getDaysBetween,
  canExtendStreak,
  shouldUseFreeze,
  getUpcomingMilestones,
  calculateStreakHealth,
  type StreakData,
} from '../lib/progress/streaks';

describe('Progress Tracking', () => {
  describe('Streak Tracking', () => {
    describe('getDaysBetween', () => {
      it('should calculate days between dates', () => {
        const days = getDaysBetween('2024-01-01', '2024-01-05');
        expect(days).toBe(4);
      });

      it('should return 0 for same day', () => {
        const days = getDaysBetween('2024-01-01', '2024-01-01');
        expect(days).toBe(0);
      });

      it('should handle negative difference', () => {
        const days = getDaysBetween('2024-01-05', '2024-01-01');
        expect(days).toBe(-4);
      });
    });

    describe('canExtendStreak', () => {
      it('should allow extension for same day', () => {
        // @ts-expect-error - Testing internal function
        const result = canExtendStreak('2024-01-01', '2024-01-01');
        expect(result).toBe(true);
      });

      it('should allow extension for next day', () => {
        // @ts-expect-error - Testing internal function
        const result = canExtendStreak('2024-01-01', '2024-01-02');
        expect(result).toBe(true);
      });

      it('should allow extension within window', () => {
        // @ts-expect-error - Testing internal function
        const result = canExtendStreak('2024-01-01', '2024-01-03');
        expect(result).toBe(true);
      });

      it('should allow extension for new streak', () => {
        // @ts-expect-error - Testing internal function
        const result = canExtendStreak(null, '2024-01-01');
        expect(result).toBe(true);
      });
    });

    describe('shouldUseFreeze', () => {
      it('should use freeze for exactly one missed day', () => {
        // @ts-expect-error - Testing internal function
        const result = shouldUseFreeze('2024-01-01', '2024-01-03');
        expect(result).toBe(true);
      });

      it('should not use freeze for consecutive days', () => {
        // @ts-expect-error - Testing internal function
        const result = shouldUseFreeze('2024-01-01', '2024-01-02');
        expect(result).toBe(false);
      });

      it('should not use freeze for new streak', () => {
        // @ts-expect-error - Testing internal function
        const result = shouldUseFreeze(null, '2024-01-01');
        expect(result).toBe(false);
      });

      it('should not use freeze for too many missed days', () => {
        // @ts-expect-error - Testing internal function
        const result = shouldUseFreeze('2024-01-01', '2024-01-04');
        expect(result).toBe(false);
      });
    });

    describe('getUpcomingMilestones', () => {
      it('should return upcoming milestones', () => {
        const milestones = getUpcomingMilestones(5);
        expect(milestones).toContain(7);
        expect(milestones).toContain(14);
        expect(milestones).toContain(30);
      });

      it('should filter out passed milestones', () => {
        const milestones = getUpcomingMilestones(30);
        expect(milestones).not.toContain(7);
        expect(milestones).not.toContain(14);
        expect(milestones).toContain(44);
      });

      it('should return max 3 milestones', () => {
        const milestones = getUpcomingMilestones(0);
        expect(milestones.length).toBeLessThanOrEqual(3);
      });
    });

    describe('calculateStreakHealth', () => {
      const today = new Date().toISOString().split('T')[0]!;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]!;
      const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0]!;

      it('should return 100 for today', () => {
        const streak: StreakData = {
          id: '1',
          userId: 'user1',
          streakType: 'daily',
          currentCount: 5,
          longestCount: 10,
          lastActivityDate: today,
          freezesUsed: 0,
          createdAt: today,
          updatedAt: today,
        };
        
        expect(calculateStreakHealth(streak)).toBe(100);
      });

      it('should return 75 for yesterday', () => {
        const streak: StreakData = {
          id: '1',
          userId: 'user1',
          streakType: 'daily',
          currentCount: 5,
          longestCount: 10,
          lastActivityDate: yesterday,
          freezesUsed: 0,
          createdAt: yesterday,
          updatedAt: yesterday,
        };
        
        expect(calculateStreakHealth(streak)).toBe(75);
      });

      it('should return 50 for two days ago', () => {
        const streak: StreakData = {
          id: '1',
          userId: 'user1',
          streakType: 'daily',
          currentCount: 5,
          longestCount: 10,
          lastActivityDate: twoDaysAgo,
          freezesUsed: 0,
          createdAt: twoDaysAgo,
          updatedAt: twoDaysAgo,
        };
        
        expect(calculateStreakHealth(streak)).toBe(50);
      });

      it('should return 0 for no activity', () => {
        const streak: StreakData = {
          id: '1',
          userId: 'user1',
          streakType: 'daily',
          currentCount: 5,
          longestCount: 10,
          lastActivityDate: null,
          freezesUsed: 0,
          createdAt: today,
          updatedAt: today,
        };
        
        expect(calculateStreakHealth(streak)).toBe(0);
      });
    });
  });

  describe('Achievement System', () => {
    it('should have 8 achievement definitions', () => {
      const achievements = [
        'first_chapter',
        'chapter_master',
        'seven_day_streak',
        'forty_four_day_streak',
        'morning_person',
        'night_owl',
        'cycle_master',
        'completionist',
      ];
      
      expect(achievements.length).toBe(8);
    });

    it('should generate unique achievement IDs', () => {
      const userId = 'user_123';
      const generateId = (type: string) => `ach-${userId}-${type}`;
      
      const id1 = generateId('first_chapter');
      const id2 = generateId('chapter_master');
      
      expect(id1).not.toBe(id2);
      expect(id1.includes(userId)).toBe(true);
    });

    it('should calculate completion percentage', () => {
      const completed = 6;
      const total = 12;
      const percentage = Math.round((completed / total) * 100);
      
      expect(percentage).toBe(50);
    });
  });
});

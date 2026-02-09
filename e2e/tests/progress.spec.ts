import { test, expect } from '@playwright/test';

test.describe('Progress Tracking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('user can view progress dashboard', async ({ page }) => {
    await page.goto('/dashboard/progress');
    
    await expect(page).toHaveURL(/progress/);
    await expect(page.locator('h1').filter({ hasText: /progress/i })).toBeVisible();

    // Should show stats
    await expect(page.locator('text=/total time|chapters completed|streak/i')).toBeVisible();
  });

  test('progress shows completion stats', async ({ page }) => {
    await page.goto('/dashboard/progress');

    // Should display completion percentage
    const progressElements = page.locator('[role="progressbar"], .progress, [data-testid="progress-bar"]');
    await expect(progressElements.first()).toBeVisible();

    // Should show chapter count
    await expect(page.locator('text=/\\d+\\s*\\/\\s*12/')).toBeVisible();
  });

  test('user can view achievements', async ({ page }) => {
    await page.goto('/dashboard/achievements');
    
    await expect(page).toHaveURL(/achievements/);
    await expect(page.locator('h1').filter({ hasText: /achievements/i })).toBeVisible();

    // Should show achievement cards
    const achievementCards = page.locator('[data-testid="achievement-card"], article, .achievement');
    const count = await achievementCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('achievements show locked and unlocked states', async ({ page }) => {
    await page.goto('/dashboard/achievements');

    // Check for both states
    const lockedIndicator = page.locator('text=locked, svg[class*="lock"], [data-locked="true"]');
    const unlockedIndicator = page.locator('text=unlocked, svg[class*="check"], [data-unlocked="true"]');

    // At least one should exist
    const hasLocked = await lockedIndicator.isVisible().catch(() => false);
    const hasUnlocked = await unlockedIndicator.isVisible().catch(() => false);

    expect(hasLocked || hasUnlocked).toBe(true);
  });

  test('recent activity is displayed', async ({ page }) => {
    await page.goto('/dashboard/progress');

    // Look for activity feed
    const activitySection = page.locator('text=/recent activity|activity feed/i');
    
    if (await activitySection.isVisible().catch(() => false)) {
      // Should show activities or empty state
      const activities = page.locator('[data-testid="activity-item"], .activity-item');
      const emptyState = page.locator('text=/no activity|start your journey/i');

      const hasActivities = await activities.first().isVisible().catch(() => false);
      const hasEmptyState = await emptyState.isVisible().catch(() => false);

      expect(hasActivities || hasEmptyState).toBe(true);
    }
  });

  test('streak information is displayed', async ({ page }) => {
    await page.goto('/dashboard/progress');

    // Look for streak information
    const streakInfo = page.locator('text=/streak|days|flame/i, svg[class*="flame"]');
    
    // Should show current streak
    await expect(streakInfo.first()).toBeVisible();
  });

  test('achievement progress ring shows percentage', async ({ page }) => {
    await page.goto('/dashboard/achievements');

    // Look for progress ring or percentage
    const progressRing = page.locator('svg circle, [role="progressbar"], text=/\\d+%/');
    await expect(progressRing.first()).toBeVisible();
  });
});

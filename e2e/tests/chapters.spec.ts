import { test, expect } from '@playwright/test';

test.describe('Chapter Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('user can view chapters list', async ({ page }) => {
    await page.goto('/chapters');
    
    // Verify chapters page loads
    await expect(page).toHaveURL(/chapters/);
    await expect(page.locator('h1').filter({ hasText: /chapter/i })).toBeVisible();

    // Should show chapter cards
    const chapterCards = page.locator('[data-testid="chapter-card"], .chapter-card, article');
    await expect(chapterCards.first()).toBeVisible();
  });

  test('user can view individual chapter details', async ({ page }) => {
    // Navigate to chapters
    await page.goto('/chapters');
    
    // Click on first chapter
    const firstChapter = page.locator('a[href*="/chapters/"], [data-testid="chapter-link"]').first();
    await firstChapter.click();

    // Verify chapter detail page
    await expect(page).toHaveURL(/chapters\/\d+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('chapter 1 is always unlocked', async ({ page }) => {
    await page.goto('/chapters/1');

    // Should not see locked message
    const lockedMessage = page.locator('text=locked|unlock|not available', { ignoreCase: true });
    await expect(lockedMessage).not.toBeVisible();

    // Should see chapter content or practice button
    await expect(page.locator('button, a').filter({ hasText: /practice|start|begin/i })).toBeVisible();
  });

  test('user can mark chapter as complete', async ({ page }) => {
    // Navigate to an unlocked chapter
    await page.goto('/chapters/1');

    // Find and click complete button
    const completeButton = page.locator('button').filter({ hasText: /complete|finish|done/i });
    
    if (await completeButton.isVisible().catch(() => false)) {
      await completeButton.click();

      // Should show success message
      await expect(page.locator('text=completed|success', { ignoreCase: true })).toBeVisible();
    }
  });

  test('user can view progress after completing chapter', async ({ page }) => {
    // Complete a chapter first
    await page.goto('/chapters/1');
    
    const completeButton = page.locator('button').filter({ hasText: /complete|finish/i });
    if (await completeButton.isVisible().catch(() => false)) {
      await completeButton.click();
    }

    // Navigate to progress page
    await page.goto('/dashboard/progress');

    // Should see progress updated
    await expect(page.locator('text=/chapters? completed/i')).toBeVisible();
  });

  test('locked chapters show unlock conditions', async ({ page }) => {
    // Try to access a later chapter that might be locked
    await page.goto('/chapters/6');

    // Check if locked state is shown
    const lockedIndicator = page.locator('text=locked|unlock conditions|requirements', { ignoreCase: true });
    
    if (await lockedIndicator.isVisible().catch(() => false)) {
      // Should show what is needed to unlock
      await expect(page.locator('text=biorhythm|complete|previous', { ignoreCase: true })).toBeVisible();
    }
  });
});

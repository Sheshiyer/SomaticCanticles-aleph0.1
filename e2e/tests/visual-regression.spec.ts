import { test, expect } from '@playwright/test';

test.describe('Visual Regression Baseline', () => {
    test.beforeEach(async ({ page }) => {
        await page.setExtraHTTPHeaders({ 'x-e2e-bypass': 'true' });
        await page.addInitScript(() => { (window as any).__FORCE_API_NETWORK__ = true; });
    });

    test('Chapters Dashboard - Desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/chapters');
        // Wait for page to settle
        await page.waitForTimeout(1000);
        await expect(page).toHaveScreenshot('chapters-dashboard-desktop.png', {
            mask: [page.locator('[data-testid="user-profile"]')] // Mask dynamic content
        });
    });

    test('Chapters Dashboard - Mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/chapters');
        await page.waitForTimeout(1000);
        await expect(page).toHaveScreenshot('chapters-dashboard-mobile.png');
    });

    test('Chapter Reader - Focused', async ({ page }) => {
        await page.goto('/chapters/1/read');
        await page.keyboard.press('f'); // Enter focus mode
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot('chapter-reader-focus.png');
    });
});

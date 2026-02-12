import { test, expect } from '@playwright/test';

test('Connectivity Check', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Somatic Canticles/i);
});

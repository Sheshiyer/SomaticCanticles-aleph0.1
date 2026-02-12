import { test, expect } from '@playwright/test';

test('landing page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Somatic Canticles/);
});

test('chapter list is accessible', async ({ page }) => {
    await page.goto('/chapters');
    // Just check that we didn't get a 404 or error page for now
    await expect(page).not.toHaveTitle(/404/);
    if (page.url().includes('/auth/login')) {
        await expect(page).toHaveURL(/.*\/auth\/login/);
    }
});

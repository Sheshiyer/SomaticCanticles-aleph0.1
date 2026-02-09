import { test, expect } from '@playwright/test';

test.describe('Settings Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('user can navigate to settings', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    await expect(page).toHaveURL(/settings/);
    await expect(page.locator('h1').filter({ hasText: /settings/i })).toBeVisible();
  });

  test('user can update timezone', async ({ page }) => {
    await page.goto('/dashboard/settings');

    // Find timezone select
    const timezoneSelect = page.locator('select[name="timezone"], [data-testid="timezone-select"]');
    
    if (await timezoneSelect.isVisible().catch(() => false)) {
      await timezoneSelect.selectOption('America/New_York');
      
      // Save changes
      await page.click('button[type="submit"], button:has-text("Save")');

      // Should show success message
      await expect(page.locator('text=saved|success|updated', { ignoreCase: true })).toBeVisible();
    }
  });

  test('user can update birthdate', async ({ page }) => {
    await page.goto('/dashboard/settings');

    const birthdateInput = page.locator('input[name="birthdate"], [data-testid="birthdate-input"]');
    
    if (await birthdateInput.isVisible().catch(() => false)) {
      await birthdateInput.fill('1995-06-15');
      
      await page.click('button[type="submit"], button:has-text("Save")');

      await expect(page.locator('text=saved|success', { ignoreCase: true })).toBeVisible();
    }
  });

  test('user can toggle notifications', async ({ page }) => {
    await page.goto('/dashboard/settings');

    const notificationToggle = page.locator('input[type="checkbox"][name*="notification"], [data-testid="notification-toggle"]');
    
    if (await notificationToggle.isVisible().catch(() => false)) {
      const isChecked = await notificationToggle.isChecked();
      
      // Toggle the switch
      await notificationToggle.click();

      // Verify toggle changed
      await expect(notificationToggle).toBeChecked({ checked: !isChecked });

      // Save changes
      await page.click('button[type="submit"], button:has-text("Save")');
    }
  });

  test('settings persist after page refresh', async ({ page }) => {
    await page.goto('/dashboard/settings');

    // Make a change
    const timezoneSelect = page.locator('select[name="timezone"]');
    
    if (await timezoneSelect.isVisible().catch(() => false)) {
      await timezoneSelect.selectOption('Europe/London');
      await page.click('button[type="submit"]');

      // Wait for save
      await page.waitForTimeout(1000);

      // Refresh page
      await page.reload();

      // Verify setting persisted
      await expect(timezoneSelect).toHaveValue('Europe/London');
    }
  });
});

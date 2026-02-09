import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPass123!',
    birthdate: '1990-01-01',
  };

  test('signup flow - user can create an account', async ({ page }) => {
    // Navigate to signup
    await page.goto('/auth/register');
    await expect(page).toHaveURL(/\/auth\/register/);

    // Fill signup form
    await page.fill('[name="email"]', testUser.email);
    await page.fill('[name="password"]', testUser.password);
    await page.fill('[name="confirmPassword"]', testUser.password);
    await page.fill('[name="birthdate"]', testUser.birthdate);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or show success
    await expect(page).toHaveURL(/dashboard|login/, { timeout: 10000 });
  });

  test('login flow - user can sign in', async ({ page }) => {
    // Navigate to login
    await page.goto('/auth/login');
    await expect(page).toHaveURL(/\/auth\/login/);

    // Fill login form
    await page.fill('[name="email"]', testUser.email);
    await page.fill('[name="password"]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Verify logged in state
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('protected routes - redirects to login when not authenticated', async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies();

    // Try to access protected route
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('logout flow - user can sign out', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('[name="email"]', testUser.email);
    await page.fill('[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Click logout
    await page.click('[data-testid="logout-button"]');

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login|home/);
  });

  test('invalid credentials - shows error message', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'WrongPass123!');
    await page.click('button[type="submit"]');

    // Should show error
    await expect(page.locator('text=Invalid|error|failed', { ignoreCase: true })).toBeVisible();
  });

  test('complete flow: signup → login → dashboard', async ({ page }) => {
    const newUser = {
      email: `complete-${Date.now()}@example.com`,
      password: 'Complete123!',
      birthdate: '1995-05-15',
    };

    // Signup
    await page.goto('/auth/register');
    await page.fill('[name="email"]', newUser.email);
    await page.fill('[name="password"]', newUser.password);
    await page.fill('[name="confirmPassword"]', newUser.password);
    await page.fill('[name="birthdate"]', newUser.birthdate);
    await page.click('button[type="submit"]');

    // Login (if not auto-redirected)
    if (page.url().includes('/login')) {
      await page.fill('[name="email"]', newUser.email);
      await page.fill('[name="password"]', newUser.password);
      await page.click('button[type="submit"]');
    }

    // Verify dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    await expect(page.locator('h1, h2').filter({ hasText: /dashboard|welcome/i })).toBeVisible();
  });
});

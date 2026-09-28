import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('login');
  });

  test('should display login form', async ({ page }) => {
    // Verify login form elements are visible
    await expect(page.locator('#email-address')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Fill in login form
    await page.fill('#email-address', 'manager');
    await page.fill('#password', 'password');

    // Click login button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for navigation and verify successful login
    await page.waitForURL(/welcome|settings/);
    await expect(page).toHaveURL(/welcome|settings/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('#email-address', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');

    // Click login button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Invalid credentials should not navigate away from the login page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/login/);
  });

  test('should require email field', async ({ page }) => {
    // Leave email empty
    await page.fill('#password', 'password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check for validation message
    const emailInput = page.locator('#email-address');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should require password field', async ({ page }) => {
    // Leave password empty
    await page.fill('#email-address', 'user@example.com');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check for validation message
    const passwordInput = page.locator('#password');
    const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

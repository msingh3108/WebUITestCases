import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Version Details Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
    await page.goto('settings');
    await page.getByRole('button', { name: 'Version Details' }).evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/settings\/version/);
  });

  test('should display version and hash information', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Web UI Framework Version' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hash' })).toBeVisible();
  });

  test('should display Web UI Help and Third Party Notices links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Web UI Help' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Third Party Notices' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Font Awesome' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Font Awesome' })).toHaveAttribute('href', 'https://fontawesome.com');
  });
});

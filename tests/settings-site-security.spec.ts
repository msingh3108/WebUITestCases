import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Site Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
    await page.goto('settings');
    await page.getByRole('button', { name: 'Site Security' }).evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/settings\/site-security/);
  });

  test('should display Site Security page elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Site Security' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Policy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pages Delete Policy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up Delete Policy' })).toBeVisible();
    await expect(page.getByText('Choose a configuration on the left to get started')).toBeVisible();
  });

  test('should display Pages policy configuration when selected', async ({ page }) => {
    // Standard .click() hangs on this MUI list item's ripple animation; dispatch via the DOM instead
    await page.getByRole('button', { name: 'Pages Delete Policy' }).evaluate((el) => (el as HTMLElement).click());

    await expect(page.getByRole('button', { name: 'View Policy Summary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Policy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByText('Category', { exact: true })).toBeVisible();
    await expect(page.getByText('Web UI Pages', { exact: true }).first()).toBeVisible();
  });
});

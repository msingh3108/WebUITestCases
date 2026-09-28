import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Cache Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
    await page.goto('settings');
    await page.getByRole('button', { name: 'Cache Management' }).evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/settings\/cache-management/);
  });

  test('should display Cache Management page elements', async ({ page }) => {
    // Verify heading, tabs, and toolbar buttons
    await expect(page.getByRole('heading', { name: 'Cache Management' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Document Types' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'WorkView Applications' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Populate Cache' })).toBeVisible();
  });

  test('should switch between Document Types and WorkView Applications tabs', async ({ page }) => {
    const workViewTab = page.getByRole('tab', { name: 'WorkView Applications' });
    await workViewTab.click();
    await expect(workViewTab).toHaveAttribute('aria-selected', 'true');

    const documentTypesTab = page.getByRole('tab', { name: 'Document Types' });
    await documentTypesTab.click();
    await expect(documentTypesTab).toHaveAttribute('aria-selected', 'true');
  });
});

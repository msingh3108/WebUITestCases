import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Request Forms Settings Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
    await page.goto('settings');
    await page.getByRole('button', { name: 'Request Forms' }).evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/settings\/requests/);
  });

  test('should display Request Forms page elements', async ({ page }) => {
    // Verify heading, Add button, and empty-state message
    await expect(page.getByRole('heading', { name: 'Request Forms' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No Forms Configured' })).toBeVisible();
    await expect(page.getByText('Add a new request form using the toolbar')).toBeVisible();
  });

  test('should have an enabled Add button', async ({ page }) => {
    const addButton = page.getByRole('button', { name: 'Add' });
    await expect(addButton).toBeEnabled();
  });
});

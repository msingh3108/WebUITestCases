import { test, expect } from '../fixtures/testFixtures';

test.describe('My Document Settings Tests', () => {
  test.beforeEach(async ({ loginPage, settingsPage, page }) => {
      await loginPage.login(process.env.STANDARD_USERNAME ?? 'MANAGER', process.env.STANDARD_PASSWORD ?? 'password');
      await settingsPage.goToMyDocumentsConfiguration();
  });
  
  test.afterEach(async ({ loginPage,page }) => {
      // Logout after each test to ensure a clean state
      await loginPage.logout();
  });

  test('should display My Documents Configuration page elements', async ({ page }) => {
    // Verify heading and toolbar buttons are visible
    await expect(page.getByRole('heading', { name: 'My Documents Configuration' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Filter' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByText('Custom Query', { exact: true }).first()).toBeVisible();
  });

  test('should add a new filter when clicking New Filter', async ({ page }) => {
    // Standard .click() hangs on this MUI button's ripple animation; dispatch via the DOM instead
    await page.getByRole('button', { name: 'New Filter' }).evaluate((el) => (el as HTMLElement).click());

    // Verify the new filter's fields are displayed
    await expect(page.getByText('Section Label').first()).toBeVisible();
    await expect(page.getByText('Document Template String').first()).toBeVisible();
    await expect(page.getByText('Constraint Type', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Operator', { exact: true }).first()).toBeVisible();
  });
});

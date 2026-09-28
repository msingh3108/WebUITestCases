import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('My Document Settings Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
    await page.goto('settings');
    await page.getByRole('button', { name: 'My Document Settings' }).evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/settings\/my-documents-configuration/);
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

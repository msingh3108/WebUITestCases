import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Site Administration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
    await page.goto('settings');
    await page.getByRole('button', { name: 'Site Administration' }).evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/settings\/site-administration/);
  });

  test('should display Site Administration toolbar and warning', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Site Administration' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset the Web UI application cache' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByText(/client-side only toggles/)).toBeVisible();
  });

  test('should display Default Document Viewer Settings toggles', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'Enable System Tasks' }).first()).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Enable Ad Hoc Tasks In Default Route' }).first()).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Enable Revisions Icon' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Enable Delete Document Icon' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Enable Modify Keywords' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Display Print Button' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Enable Auto Expand Keywords' })).toBeVisible();
  });

  test('should display Default WorkView Viewer Settings toggles', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'Enable History' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Enable Save' })).toBeVisible();
  });

  test('should display Keyword Settings toggles and dropdown', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'Disable formatting on Numeric 9' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Disable formatting on Numeric 20' })).toBeVisible();
    await expect(page.getByText('Standalone Keyword Display Order').first()).toBeVisible();
  });

  test('should toggle a Document Viewer setting switch', async ({ page }) => {
    const printCheckbox = page.getByRole('checkbox', { name: 'Display Print Button' });
    const initialState = await printCheckbox.isChecked();

    await printCheckbox.click();
    await expect(printCheckbox).toBeChecked({ checked: !initialState });
  });
});

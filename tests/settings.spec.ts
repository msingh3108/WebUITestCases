import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Settings Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
  });

  test('should navigate to Settings via hamburger menu', async ({ page }) => {
    // Open the hamburger navigation menu
    const menuButton = page.locator('#nav-menu-button');
    await menuButton.click({ force: true });

    // Click Settings link in the side navigation
    const settingsLink = page.getByRole('link', { name: 'Settings' });
    await settingsLink.click();

    // Verify navigation to the settings page
    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByText('User Settings')).toBeVisible();
    await expect(page.getByText('Administrative Settings')).toBeVisible();
    await expect(page.getByText('Choose a setting on the left to edit')).toBeVisible();
  });

  test('should display all administrative setting options', async ({ page }) => {
    await page.goto('settings');

    // Verify each administrative setting option is visible
    await expect(page.getByRole('button', { name: 'My Document Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pages Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Request Forms' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Theme Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Site Administration' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cache Management' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Site Security' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Version Details' })).toBeVisible();
  });

  test('should navigate to Theme Settings section', async ({ page }) => {
    await page.goto('settings');

    // Standard .click() hangs on this MUI list item's ripple animation; dispatch via the DOM instead
    await page.getByRole('button', { name: 'Theme Settings' }).evaluate((el) => (el as HTMLElement).click());

    // Verify navigation to the theme settings sub-page
    await expect(page).toHaveURL(/settings\/theming/);
    await expect(page.getByRole('heading', { name: 'Theme Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply Theme to Site' })).toBeVisible();
  });

  test('should navigate to Pages Settings > Welcome and display its configuration', async ({ page }) => {
    await page.goto('settings');

    // Standard .click() hangs on this MUI list item's ripple animation; dispatch via the DOM instead
    await page.getByRole('button', { name: 'Pages Settings' }).evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/settings\/pages-configuration/);

    // Select the "Welcome" drawer link from the Pages Settings list
    await page
      .getByRole('button', { name: 'Welcome Cannot delete feature page link' })
      .evaluate((el) => (el as HTMLElement).click());

    // Verify the Welcome page's configuration is displayed
    await expect(page.getByText('Page ID:Welcome')).toBeVisible();
    await expect(page.getByText('Page Url:/welcome')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Link Name' })).toHaveValue('Welcome');
    await expect(page.getByRole('checkbox', { name: 'Include in drawer' })).toBeChecked();
  });
});

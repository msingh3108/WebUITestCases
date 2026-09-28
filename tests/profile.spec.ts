import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Profile Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, 'manager', 'password');
  });

  test('should navigate to Profile via hamburger menu', async ({ page }) => {
    // Open the hamburger navigation menu
    const menuButton = page.locator('#nav-menu-button');
    await menuButton.click({ force: true });

    // Click Profile link in the side navigation
    const profileLink = page.getByRole('link', { name: 'Profile' });
    await profileLink.click();

    // Verify navigation to the profile settings page
    await expect(page).toHaveURL(/settings\/my-account/);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
  });

  test('should display personal information on Profile page', async ({ page }) => {
    const menuButton = page.locator('#nav-menu-button');
    await menuButton.click({ force: true });

    const profileLink = page.getByRole('link', { name: 'Profile' });
    await profileLink.click();

    // Verify personal information section is displayed
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible();
    await expect(page.getByText('Name', { exact: true })).toBeVisible();
    await expect(page.getByText('Email', { exact: true })).toBeVisible();
  });

  test.describe('Theming', () => {
    test.beforeEach(async ({ page }) => {
      const menuButton = page.locator('#nav-menu-button');
      await menuButton.click({ force: true });

      const profileLink = page.getByRole('link', { name: 'Profile' });
      await profileLink.click();
    });

    test('should display Theming section with Theme and Light/Dark Mode controls', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Theming' })).toBeVisible();
      await expect(page.getByText('Canvas', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: /Light.?Dark Mode/i })).toBeVisible();
    });

    test('should open the Light/Dark Mode menu when clicking the theme control', async ({ page }) => {
      // Standard .click() hangs on this MUI button's ripple animation; dispatch via the DOM instead
      await page.getByRole('button', { name: /Light.?Dark Mode/i }).evaluate((el) => (el as HTMLElement).click());

      // Verify the theme preference menu is displayed with all three options
      await expect(page.getByRole('heading', { name: 'Light/Dark Mode', exact: true })).toBeVisible();
      await expect(page.getByText('Update your light/dark mode preference')).toBeVisible();
      // Note: these MUI toggle buttons have leftover aria-labels ("left aligned"/"centered"/"right aligned")
      // that override their visible text as the accessible name, so match on visible text instead.
      await expect(page.getByRole('button').filter({ hasText: 'Light Mode' })).toBeVisible();
      await expect(page.getByRole('button').filter({ hasText: 'System Default' })).toBeVisible();
      await expect(page.getByRole('button').filter({ hasText: 'Dark Mode' })).toBeVisible();
    });

    test('should default to Light Mode selected', async ({ page }) => {
      await page.getByRole('button', { name: /Light.?Dark Mode/i }).evaluate((el) => (el as HTMLElement).click());

      const lightOption = page.getByRole('button', { name: 'left aligned' });
      await expect(lightOption).toHaveAttribute('aria-pressed', 'true');
    });

    test('should switch to Dark Mode and reflect the change in the header toggle', async ({ page }) => {
      await page.getByRole('button', { name: /Light.?Dark Mode/i }).evaluate((el) => (el as HTMLElement).click());

      const darkOption = page.getByRole('button', { name: 'right aligned' });
      await darkOption.evaluate((el) => (el as HTMLElement).click());

      // Verify the option is now selected and the header's theme toggle reflects Dark mode
      await expect(darkOption).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByRole('button', { name: 'Dark mode', exact: true })).toHaveAttribute('aria-pressed', 'true');

      // Revert back to Light Mode so the shared account is left in its default state
      const lightOption = page.getByRole('button', { name: 'left aligned' });
      await lightOption.evaluate((el) => (el as HTMLElement).click());
      await expect(lightOption).toHaveAttribute('aria-pressed', 'true');
    });

    test('should switch to System Default mode', async ({ page }) => {
      await page.getByRole('button', { name: /Light.?Dark Mode/i }).evaluate((el) => (el as HTMLElement).click());

      const systemOption = page.getByRole('button', { name: 'centered' });
      await systemOption.evaluate((el) => (el as HTMLElement).click());
      await expect(systemOption).toHaveAttribute('aria-pressed', 'true');

      // Revert back to Light Mode so the shared account is left in its default state
      const lightOption = page.getByRole('button', { name: 'left aligned' });
      await lightOption.evaluate((el) => (el as HTMLElement).click());
      await expect(lightOption).toHaveAttribute('aria-pressed', 'true');
    });

    test('should navigate back to Account Settings using the back button', async ({ page }) => {
      await page.getByRole('button', { name: /Light.?Dark Mode/i }).evaluate((el) => (el as HTMLElement).click());
      await expect(page.getByRole('heading', { name: 'Light/Dark Mode', exact: true })).toBeVisible();

      // The back button has no accessible name; target it via its unique class
      await page.locator('.back-button').evaluate((el) => (el as HTMLElement).click());

      // Verify we're back on the main Account Settings / Personal Information view
      await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Light/Dark Mode', exact: true })).not.toBeVisible();
    });
  });
});

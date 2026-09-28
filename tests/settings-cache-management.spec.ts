import { test, expect} from '../fixtures/testFixtures';

test.describe('Cache Management Tests', () => {
  test.beforeEach(async ({ loginPage, settingsPage, page }) => {
    await loginPage.login(process.env.STANDARD_USERNAME ?? 'MANAGER', process.env.STANDARD_PASSWORD ?? 'password');
    await settingsPage.goToCacheManagement();
  });

  test.afterEach(async ({ loginPage,page }) => {
    // Logout after each test to ensure a clean state
    await loginPage.logout();
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

import { test, expect} from '../fixtures/testFixtures';

test.describe('Page Builder Tests', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.login(process.env.STANDARD_USERNAME ?? 'MANAGER', process.env.STANDARD_PASSWORD ?? 'password');
  });

  test('should navigate to Page Builder via hamburger menu', async ({ page }) => {
    // Open the hamburger navigation menu
    const menuButton = page.locator('#nav-menu-button');
    await menuButton.click({ force: true });

    // Click Page Builder link in the side navigation
    const pageBuilderLink = page.getByRole('link', { name: 'Page Builder' });
    await pageBuilderLink.click();

    // Verify navigation to the Page Builder (pages designer) page
    await expect(page).toHaveURL(/pages-designer/);
    await expect(page.getByRole('heading', { name: 'No page selected' })).toBeVisible();
  });

  test.describe('Page Builder workspace', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('pages-designer');
      await page.waitForTimeout(5000);
    });

    test('should display the toolbar and empty state when no page is selected', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'New Page' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Delete Page' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'No page selected' })).toBeVisible();
      await expect(page.getByText('Choose or create a page to get started')).toBeVisible();
    });

    test('should list the existing pages under the Pages section', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Date Test' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'PSMyPage' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'PSWorkFlowPage' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'WV Document' })).toBeVisible();
    });

    test('should display available Controls to add to a page', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Controls' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Filter Component' })).toBeVisible();
      await expect(page.getByText('Auto Query')).toBeVisible();
      await expect(page.getByText('Form', { exact: true })).toBeVisible();
      await expect(page.getByText('Keyword Search')).toBeVisible();
      await expect(page.getByText('Search Results')).toBeVisible();
      await expect(page.getByText('Viewer', { exact: true })).toBeVisible();
    });

    test('should filter the Controls list using the Filter Component search box', async ({ page }) => {
      const filterBox = page.getByRole('textbox', { name: 'Filter Component' });
      await filterBox.fill('Viewer');

      // Only the matching control remains visible, non-matching ones are filtered out
      await expect(page.getByText('Viewer', { exact: true })).toBeVisible();
      await expect(page.getByText('Auto Query')).not.toBeVisible();
      await expect(page.getByText('Keyword Search')).not.toBeVisible();
    });

    test('should collapse and expand the Pages list section', async ({ page }) => {
      const pagesToggle = page.getByRole('button', { name: 'Pages' });
      const dateTestPage = page.getByRole('button', { name: 'Date Test' });

      await expect(dateTestPage).toBeVisible();

      // Collapse the Pages section
      await pagesToggle.click();
      await expect(dateTestPage).not.toBeVisible();

      // Expand it back
      await pagesToggle.click();
      await expect(dateTestPage).toBeVisible();
    });

    test('should hide and show the left panel', async ({ page }) => {
      const toggleButton = page.getByRole('button', { name: /^(Hide|Show) Left Panel$/ });

      await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();

      // Hide the left panel
      await page.getByRole('button', { name: 'Hide Left Panel' }).click();
      await expect(page.getByRole('button', { name: 'Pages' })).not.toBeVisible();
      await expect(toggleButton).toHaveAccessibleName('Show Left Panel');

      // Show it again
      await page.getByRole('button', { name: 'Show Left Panel' }).click();
      await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();
    });

    test('should select a page and display its components and layout properties', async ({ page }) => {
      // Standard .click() hangs on this MUI list item's ripple animation; dispatch via the DOM instead
      await page.getByRole('button', { name: 'Date Test' }).evaluate((el) => (el as HTMLElement).click());

      // Verify the page loads with its heading, toolbar actions, and assigned components
      await expect(page).toHaveURL(/activePageId=Date_Test/);
      await expect(page.getByRole('heading', { name: 'Date Test' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Copy Page' })).toBeVisible();
      await expect(page.getByText('Auto Query')).toBeVisible();
      await expect(page.getByText('Form', { exact: true })).toBeVisible();
      await expect(page.getByText('Viewer', { exact: true })).toBeVisible();

      // Verify the Layout Properties panel is displayed for the selected page
      await expect(page.getByRole('combobox', { name: 'Layout Type' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Enable Page Toolbar' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Enable Sidebar' })).toBeVisible();
    });

    test('should toggle the Layout Properties panel for a selected page', async ({ page }) => {
      await page.getByRole('button', { name: 'Date Test' }).evaluate((el) => (el as HTMLElement).click());

      const layoutTypeCombo = page.getByRole('combobox', { name: 'Layout Type' });
      await expect(layoutTypeCombo).toBeVisible();

      // Collapse the Layout Properties panel
      await page.getByRole('button', { name: 'Layout Properties' }).click();
      await expect(layoutTypeCombo).not.toBeVisible();

      // Expand it back
      await page.getByRole('button', { name: 'Layout Properties' }).click();
      await expect(layoutTypeCombo).toBeVisible();
    });
  });
});

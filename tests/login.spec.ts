import { test, expect } from '../fixtures/testFixtures';
import { getBearerToken, updateTestInExecution } from '../utils/jiraUtils';

type TestResult = { jiraKey: string; status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted' };

test.describe('Login Tests', () => {
  const groupResults: TestResult[] = [];
  test.beforeEach(async ({ page }) => {
    // Login before each test
     await page.goto('login');
  });

  // Teardown
  test.afterEach(async ({}, testInfo) => {
    const jiraKey = testInfo.annotations.find(a => a.type === 'Jira')?.description;
    if (jiraKey) {
      groupResults.push({ jiraKey, status: testInfo.status ?? 'skipped' });
    }
  });

  // Update Jira Test Execution with results of this group
  test.afterAll(async () => {
    if (process.env.UPDATE_JIRA_TESTS !== 'true' || groupResults.length === 0) return;
    const executionKey = process.env.TEST_EXECUTION_ID;
    if (!executionKey) return;
    try {
      const token = await getBearerToken(
        process.env.XRAY_CLIENT_ID ?? '',
        process.env.XRAY_CLIENT_SECRET ?? ''
      );
      for (const { jiraKey, status } of groupResults) {
        await updateTestInExecution(token, executionKey, jiraKey, status);
      }
      console.log(`[Xray] Group 'Web Client Gallery Tests' update complete.`);
    } catch (err) {
      console.error('[Xray] Group update failed:', err);
    }
  });

  test('Should login with valid credentials @Smoke', async ({ loginPage, page }) => {
    test.info().annotations.push({ type: 'Jira', description: '' });

    await test.step('Login with valid credentials', async () => {
      await loginPage.login(process.env.STANDARD_USERNAME ?? 'MANAGER', process.env.STANDARD_PASSWORD ?? 'password');
    });

    await test.step('Verify successful login', async () => {
      await page.waitForURL(/welcome|settings/);
      await expect(page).toHaveURL(/welcome|settings/);
      await loginPage.logout();
    });
  });

  test('Should validate required fields and display error for invalid credentials @Smoke', async ({ loginPage, page }) => {
    test.info().annotations.push({ type: 'Jira', description: '' });

    const expectedErrorMessage = 'Invalid email or password. If you have forgotten your password, please try the forgot password link.';

    await test.step('Leave email field blank and attempt login', async () => {
      await loginPage.usernameInput.fill('');
      await loginPage.passwordInput.fill(process.env.STANDARD_PASSWORD ?? 'password');
      await loginPage.loginButton.click();
      // email input should be invalid
      const isInvalidEmail = await loginPage.usernameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalidEmail).toBe(true);
      // get error message
      const errorMessage1 = await loginPage.errorMessage();
      expect(errorMessage1).toBe(expectedErrorMessage);
    });

    await test.step('Leave password field blank and attempt login', async () => {
      await loginPage.usernameInput.fill(process.env.STANDARD_USERNAME ?? 'MANAGER');
      await loginPage.passwordInput.fill('');
      await loginPage.loginButton.click();
      // password input should be invalid
      const isInvalidPassword = await loginPage.passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalidPassword).toBe(true);
      // get error message
      const errorMessage2 = await loginPage.errorMessage();
      expect(errorMessage2).toBe(expectedErrorMessage);
    });

    await test.step('Login with invalid credentials', async () => {
      await loginPage.login('invalid@example.com', 'invalidpassword');
      // error message should be displayed for invalid credentials
      const errorMessage3 = await loginPage.errorMessage();
      expect(errorMessage3).toBe(expectedErrorMessage);
      // should not navigate away from the login page
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/login/);
    });

  });

});

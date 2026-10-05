import { test, expect } from '../fixtures/testFixtures';
import { getBearerToken, updateTestInExecution } from '../utils/jiraUtils';

type TestResult = { jiraKey: string; status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted' };

test.describe('Profile Tests', () => {
  const groupResults: TestResult[] = [];
  test.beforeEach(async ({ loginPage, page }) => {
    // Login before each test
    await loginPage.login(process.env.STANDARD_USERNAME ?? 'MANAGER', process.env.STANDARD_PASSWORD ?? 'password');
  });

  // Teardown
  test.afterEach(async ({loginPage}, testInfo) => {
    await loginPage.logout();
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
      console.log(`[Xray] Group 'Profile Tests' update complete.`);
    } catch (err) {
      console.error('[Xray] Group update failed:', err);
    }
  });

  test('Should display personal information on Profile page @Smoke', async ({ commonPageUtils, profilePage, page }) => {
    test.info().annotations.push({ type: 'Jira', description: '' });
    
    const expectedName = 'Purbita Sur';
    const expectedEmail = 'purbitasur@xyz.com';
    const expectedTheme = 'Canvas';

    await test.step('Go to Profile page', async () => {
      await commonPageUtils.openMenuByName('Profile');
    });

    await test.step('Open My Account section and validate field values', async () => {
      const name = await profilePage.getFieldValue('Name');
      const email = await profilePage.getFieldValue('Email');
      const theme = await profilePage.getFieldValue('Theme');
      const lightDarkMode = await profilePage.getFieldValue('Light/Dark Mode');
      console.log(`Name: ${name}, Email: ${email}, Theme: ${theme}, Light/Dark Mode: ${lightDarkMode}`);
      expect(name).toBe(expectedName);
      expect(email).toBe(expectedEmail);
      expect(theme).toBe(expectedTheme);
      expect(['Light', 'Dark']).toContain(lightDarkMode);
    });
  });

  test('Should be able to change theme from Profile page @Smoke', async ({ commonPageUtils, profilePage, page }) => {
    test.info().annotations.push({ type: 'Jira', description: '' });

    await test.step('Go to Profile page', async () => {
      await commonPageUtils.openMenuByName('Profile');
    });

    await test.step('Go to Profile Page and change theme to Light', async () => {
      const newTheme = await profilePage.changeTheme('Light Mode');
      expect(newTheme).toBe('Light');
    });

    await test.step('Go to Profile Page and change theme to Dark', async () => {
      const newTheme = await profilePage.changeTheme('Dark Mode');
      expect(newTheme).toBe('Dark');
    });
  });

  test('Should be able to navigate to Profile Page from User Menu @Smoke', async ({ commonPageUtils, profilePage, page }) => {
    test.info().annotations.push({ type: 'Jira', description: '' });
    
    const expectedName = 'Purbita Sur';
    const expectedEmail = 'purbitasur@xyz.com';
    const expectedTheme = 'Canvas';

    await test.step('Go to My Account from User Menu', async () => {
      await commonPageUtils.selectOptionFromUserMenu('My Account');
    });

    await test.step('Validate field values in My Account section', async () => {
      const name = await profilePage.getFieldValue('Name');
      const email = await profilePage.getFieldValue('Email');
      const theme = await profilePage.getFieldValue('Theme');
      const lightDarkMode = await profilePage.getFieldValue('Light/Dark Mode');
      console.log(`Name: ${name}, Email: ${email}, Theme: ${theme}, Light/Dark Mode: ${lightDarkMode}`);
      expect(name).toBe(expectedName);
      expect(email).toBe(expectedEmail);
      expect(theme).toBe(expectedTheme);
      expect(['Light', 'Dark']).toContain(lightDarkMode);
    });
  });

});

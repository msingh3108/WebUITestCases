import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { CommonPageUtils } from '../pages/CommonPageUtils';


type PageFixtures = {
  page: Page;
  loginPage: LoginPage;
  settingsPage: SettingsPage;
  profilePage: ProfilePage;
  commonPageUtils: CommonPageUtils;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  settingsPage: async ({ page }, use) => {
    const settingsPage = new SettingsPage(page);
    await use(settingsPage);
  },
  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await use(profilePage);
  },
  commonPageUtils: async ({ page }, use) => {
    const commonPageUtils = new CommonPageUtils(page);
    await use(commonPageUtils);
  }

});

export { expect } from '@playwright/test';

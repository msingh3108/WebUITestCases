import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  readonly settingsLink = this.page.getByRole('link', {name: 'Settings'});

  constructor(page: Page) {
    super(page);
  }

  async goToCacheManagement() {

    await this.settingsLink.click();
    await this.page.getByRole('button', { name: 'Cache Management' }).evaluate((el) => (el as HTMLElement).click());
    await this.page.waitForURL(/settings\/cache-management/);
  }

  async goToMyDocumentsConfiguration() {

    await this.settingsLink.click();
    await this.page.getByRole('button', { name: 'My Document Settings' }).evaluate((el) => (el as HTMLElement).click());
    await this.page.waitForURL(/settings\/my-documents-configuration/);
  }

}
import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

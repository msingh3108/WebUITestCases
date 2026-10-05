import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly hamBurgerMenu = this.page.getByRole('button', {name: 'Open navigation menu'});
  readonly themeButton = this.page.locator(`//div[@class='field-label' and text()='Light/Dark Mode']`);
  readonly backButton = this.page.locator(`//button[contains(@class,'back-button')]`);

  constructor(page: Page) {
    super(page);
  }

  async getFieldValue(fieldName: string) {
    return (await (this.page.locator(`//div[@class='field-label' and text()='${fieldName}']/following-sibling::div`).innerText())).trim();
  }

  async changeTheme(theme: string) {
    await this.themeButton.click()
    await this.page.locator(`//div[text()='${theme}']`).click();
    await this.backButton.click();
    const themeValue = await this.getFieldValue('Light/Dark Mode');
    return themeValue;
  }
}
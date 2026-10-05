import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CommonPageUtils extends BasePage {
  readonly settingsLink = this.page.getByRole('link', {name: 'Settings'});
  readonly hamBurgerMenu = this.page.getByRole('button', {name: 'Open navigation menu'});

  constructor(page: Page) {
    super(page);
  }

  async openHamBurgerMenu() {
    await this.hamBurgerMenu.click();
  }

  async openMenuByName(menuName: string) {
    await this.page.getByRole('link', { name: menuName }).click();
  }

  async selectOptionFromUserMenu(optionName: string) {
    await this.page.getByRole('button', { name: 'User account menu' }).click();
    await this.page.getByRole('menuitem').filter({ hasText: optionName }).click();
  }
}
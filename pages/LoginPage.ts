import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput = this.page.getByRole('textbox', { name: 'Email Address' });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
  readonly loginButton = this.page.getByRole('button', { name: 'Sign In' });

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {

    await this.page.goto('login');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout()
  {
    await this.page.getByRole('button', { name: 'User account menu' }).click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await this.page.waitForTimeout(2000);
  }
}
import { Page } from '@playwright/test';

export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('login');
  await page.fill('#email-address', email);
  await page.fill('#password', password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/welcome|settings/);
}

export async function logout(page: Page) {
  await page.click('button:has-text("Logout")');
  await page.waitForNavigation();
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Check if user menu or logout button exists
    await page.waitForSelector('button:has-text("Logout")', { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

export async function navigateToUrl(page: Page, url: string) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  return response?.status();
}

export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [selector, value] of Object.entries(fields)) {
    await page.fill(selector, value);
  }
}

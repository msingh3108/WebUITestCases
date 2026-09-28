import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Tests share one live "manager" login; run serially to avoid session conflicts on the real backend
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  
  use: {
    baseURL: 'https://hyl-066478.onbase.net/WebUIFramework/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

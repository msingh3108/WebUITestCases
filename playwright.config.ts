import { defineConfig , devices} from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const timestamp = Date.now().toString(); // Generate a timestamp for the report folder name
export default defineConfig({
  testDir: './tests',
  timeout: 0,
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reporter: [
    ['html', { outputFolder: `playwright-report/${timestamp}`}],
    ['list'],
  ],
  use: {
    baseURL: process.env.WEBUI_BASE_URL ?? 'https://your-hra-app-url.com',
    actionTimeout: 60_000,
    navigationTimeout: 60_000,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video:  {mode:'off',
      size: { width: 1280, height: 720 },
      show: {
        actions: {
          duration: 500,
          position: 'top',
          fontSize: 17,
        },
        test: {
          level: 'step',
          position: 'bottom-left',
          fontSize: 15,
        }
      }
    },
  },
  expect: {
    timeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: {width: 1536, height: 826},
        //launchOptions: { args: ['--start-maximized'] },
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: {
          width: 1536,
          height: 826
        },
        launchOptions: {},
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: {
          width: 1536,
          height: 826
        },
      },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  outputDir: 'test-results',
});

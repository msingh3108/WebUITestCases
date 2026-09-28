# Testing Project

A Playwright + TypeScript testing project for URL navigation and login test cases.

## Project Structure

```
├── tests/
│   ├── login.spec.ts           # Login functionality tests
│   └── helpers.ts              # Test utility functions
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## Installation

All dependencies are already installed. To reinstall:

```bash
npm install -D @playwright/test typescript @types/node ts-node
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in a specific file:
```bash
npx playwright test tests/login.spec.ts
```

Run tests with UI mode (interactive):
```bash
npx playwright test --ui
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

Generate test report:
```bash
npx playwright show-report
```

## Test Coverage

### Login Tests (`tests/login.spec.ts`)
- Login form display
- Successful login with valid credentials
- Error handling with invalid credentials
- Email field validation
- Password field validation

## Test Helpers

Use the helper functions from `tests/helpers.ts`:

- `loginUser(page, email, password)` - Performs login
- `logout(page)` - Performs logout
- `isLoggedIn(page)` - Checks if user is authenticated
- `navigateToUrl(page, url)` - Navigate to URL and return status
- `fillForm(page, fields)` - Fill form with multiple fields

## Configuration

Edit `playwright.config.ts` to:
- Change base URL: Update `use.baseURL`
- Add different browsers: Modify `projects` array
- Change test directory: Update `testDir`
- Adjust timeouts and retries: Modify top-level options

## Writing New Tests

Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  // Your test code here
});
```

## Troubleshooting

- **Port already in use**: Change `webServer.url` in playwright.config.ts
- **Tests timeout**: Increase `timeout` in playwright.config.ts
- **Chrome not found**: Run `npx playwright install`

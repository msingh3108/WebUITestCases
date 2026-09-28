---
name: add-playwright-test-case
description: 'Use when adding, updating, or removing Playwright test cases (*.spec.ts) in this project. Ensures every new test case is documented in test-cases.html with a serial number, page, and summary, and keeps the stats/Test Execution Details in sync. Trigger phrases: "add a test case", "create test cases", "new test", "update test-cases.html".'
---

# Add Playwright Test Case

## When to Use
- Adding a new test (`test(...)`) to any file in `tests/*.spec.ts`
- Adding a brand new `*.spec.ts` file
- Editing an existing test in a way that changes its steps/assertions
- Removing a test case

## Procedure

1. **Write/update the test** in the relevant `tests/<name>.spec.ts` file (or create a new spec file). Reuse helpers from [tests/helpers.ts](../../../tests/helpers.ts) (e.g. `loginUser`) where applicable.
2. **Verify selectors against the real page** before trusting them — this app (OnBase WebUIFramework) uses MUI components, so generic selectors like `input[type="email"]` or `button[type="submit"]` usually don't match. Inspect the live page (browser tools or `run_playwright_code`) to confirm real `id`/role/text selectors.
   - MUI toggle switches in Settings pages (e.g. Site Administration) are `role="checkbox"`, not `role="switch"` — verify with a snapshot before assuming.
   - Standard `.click()` hangs indefinitely on some MUI `List`/`ListItemButton` items (their ripple animation seems to block Playwright's stability check). If a click times out, use `.evaluate((el) => (el as HTMLElement).click())` instead, which reliably works.
   - A button's accessible name can differ from its visible text (e.g. a `title` attribute overrides it — the "Reset Cache" button's accessible name is actually "Reset the Web UI application cache"). Confirm the accessible name via a snapshot rather than guessing from visible text.
3. **Run the test** (e.g. `npx playwright test tests/<file>.spec.ts --reporter=list`) and confirm it passes before documenting it as "Ready". If it fails, mark it "Pending" in the HTML until fixed.
4. **Update [test-cases.html](../../../test-cases.html)**:
   - Add a new `<tr>` row to the matching section's table (or create a new `<div class="section">` if it's a new spec file), continuing the serial number sequence (`S.No`) across the whole document — never restart numbering per file.
   - Each row's summary cell uses `<strong>Test name</strong>` plus a `<ul class="details-list">` of concrete steps/assertions (not vague descriptions — mirror the actual `page.` calls and `expect()` checks).
   - Set the status badge: `status-ready` if the test currently passes, `status-pending` if not yet passing.
   - Update the header stats: `Total Test Cases` count and `Test Pages` count (number of distinct `*.spec.ts` files).
   - Update the "Test Execution Details" table's `Test Files` row to list all spec files.
5. **Add an npm script** in [package.json](../../../package.json) for the new spec file if one doesn't already exist, following the pattern `test:<name>": "playwright test tests/<name>.spec.ts"`.

## Notes
- Keep serial numbers globally sequential across all sections in test-cases.html (do not reuse or skip numbers).
- Never document a test as "Ready" without actually running it first.
- All tests share one live "manager" login against a real backend. `playwright.config.ts` runs with `workers: 1` / `fullyParallel: false` because concurrent logins under the same account can invalidate each other's sessions (causes random `page.waitForURL` timeouts in `loginUser`). Keep it serial — do not re-enable parallelism.
- Full serial runs of the whole suite take several minutes; when running `npm test`, expect it to run in the background and check back rather than assuming a quick timeout means failure.

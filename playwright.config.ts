import { defineConfig, devices } from '@playwright/test';

/**
 * Root Playwright config — shared defaults for all e2e projects.
 * Each project config imports and spreads this via:
 *   import baseConfig from '../../playwright.config';
 *   export default defineConfig({ ...baseConfig, ... });
 */
export default defineConfig({
  testDir: './src',
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

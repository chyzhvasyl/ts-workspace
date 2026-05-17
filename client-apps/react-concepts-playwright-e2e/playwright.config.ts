import { defineConfig } from '@playwright/test';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

import baseConfig from '../../playwright.config';

const baseURL = process.env['BASE_URL'] ?? 'http://localhost:4200';

export default defineConfig({
  ...baseConfig,
  ...nxE2EPreset(__filename, { testDir: './src' }),
  globalSetup: './src/global-setup.ts',
  globalTeardown: './src/global-teardown.ts',
  use: {
    ...baseConfig.use,
    baseURL,
  },
  webServer: {
    command: 'npx nx run react-concepts:serve',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    cwd: workspaceRoot,
  },
});

import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    specPattern: 'client-apps/react-concepts-cypress-e2e/src/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'client-apps/react-concepts-cypress-e2e/src/support/e2e.ts',
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

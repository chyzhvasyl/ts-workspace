/**
 * Global setup — runs once before all tests.
 * Use this for: auth state, DB seeding, shared cookies, etc.
 *
 * Example — save auth state to reuse across tests:
 * const browser = await chromium.launch();
 * const page = await browser.newPage();
 * await page.goto(process.env['BASE_URL'] ?? 'http://localhost:4200');
 * await page.context().storageState({ path: 'playwright/.auth/user.json' });
 * await browser.close();
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async function globalSetup(): Promise<void> {}

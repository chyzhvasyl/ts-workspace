/**
 * Global teardown — runs once after all tests.
 * Use this for: DB cleanup, temp file removal, etc.
 *
 * Example — clean up auth state:
 * await fs.rm('playwright/.auth', { recursive: true, force: true });
 */
export default async function globalTeardown(): Promise<void> {}

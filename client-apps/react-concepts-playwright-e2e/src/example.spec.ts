import { test, expect } from '@playwright/test';

test.describe('React App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('This is the generated root route.')).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation');

    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Page 2' })).toBeVisible();
  });

  test('should navigate to page 2', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation');

    await nav.getByRole('link', { name: 'Page 2' }).click();
    await expect(page.getByText('Click here to go back to root page.')).toBeVisible();
  });
});

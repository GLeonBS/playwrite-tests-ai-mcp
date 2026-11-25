// @ts-check
const { test, expect } = require('@playwright/test');

const APP_PATH = '/vanilla-js-web-app-example/';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_PATH);
  });

  test('loads with the expected title', async ({ page }) => {
    await expect(page).toHaveURL(/\/vanilla-js-web-app-example\/$/);
    await expect(page).toHaveTitle('TDD Frontend Example');
  });

  test('shows the form fields and submit button', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Image Title' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Image URL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Form' })).toBeVisible();
  });

  test('renders the three default cards', async ({ page }) => {
    await expect(page.getByRole('main').getByRole('article')).toHaveCount(3);
    await expect(page.getByRole('heading', { level: 4 })).toHaveText([
      'AI Alien',
      'Predator Night Vision',
      'ET Bilu',
    ]);
    await expect(page.getByRole('img', { name: 'Image of an AI Alien' })).toBeVisible();
  });
});

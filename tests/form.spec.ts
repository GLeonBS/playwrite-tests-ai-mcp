import { test, expect, type Page } from '@playwright/test';

const APP_PATH = '/vanilla-js-web-app-example/';

const titleInput = (page: Page) => page.getByRole('textbox', { name: 'Image Title' });
const urlInput = (page: Page) => page.getByRole('textbox', { name: 'Image URL' });
const submitButton = (page: Page) => page.getByRole('button', { name: 'Submit Form' });
const cards = (page: Page) => page.getByRole('main').getByRole('article');

test.beforeEach(async ({ page }) => {
  // Start every test from an empty store so results never depend on earlier runs
  await page.addInitScript(() => localStorage.removeItem('tdd-ew-db'));
  await page.goto(APP_PATH);
  await expect(cards(page)).toHaveCount(3);
});

test.describe('Submitting the form', () => {
  test('adds a new card to the list and resets the form', async ({ page }) => {
    const title = `MCP Generated Card ${Date.now()}`;
    const imageUrl = 'https://playwright.dev/img/playwright-logo.svg';

    await titleInput(page).fill(title);
    await urlInput(page).fill(imageUrl);
    await submitButton(page).click();

    await expect(cards(page)).toHaveCount(4);
    const newCard = cards(page).last();
    await expect(newCard.getByRole('heading', { level: 4 })).toHaveText(title);
    await expect(newCard.getByRole('img', { name: `Image of an ${title}` })).toHaveAttribute('src', imageUrl);

    await expect(titleInput(page)).toHaveValue('');
    await expect(urlInput(page)).toHaveValue('');
    await expect(titleInput(page)).toBeFocused();
  });

  test('keeps submitted cards when the page is opened again', async ({ page }) => {
    const title = `Persisted Card ${Date.now()}`;

    await titleInput(page).fill(title);
    await urlInput(page).fill('https://img.com/erick.png');
    await submitButton(page).click();
    await expect(cards(page)).toHaveCount(4);

    // Open the app in a new tab of the same context: it shares localStorage,
    // but doesn't run this page's init script that clears the store
    const fresh = await page.context().newPage();
    await fresh.goto(APP_PATH);
    await expect(cards(fresh)).toHaveCount(4);
    await expect(cards(fresh).last().getByRole('heading', { level: 4 })).toHaveText(title);
  });
});

test.describe('Form validation', () => {
  test('shows both error messages when the form is empty', async ({ page }) => {
    await submitButton(page).click();

    await expect(page.getByText('Please type a title for the image.')).toBeVisible();
    await expect(page.getByText('Please type a valid URL')).toBeVisible();
    await expect(titleInput(page)).toBeFocused();
    await expect(cards(page)).toHaveCount(3);
  });

  test('shows only the URL error when the URL is invalid', async ({ page }) => {
    await titleInput(page).fill('Only Title');
    await urlInput(page).fill('not-a-url');
    await submitButton(page).click();

    await expect(page.getByText('Please type a valid URL')).toBeVisible();
    await expect(page.getByText('Please type a title for the image.')).toBeHidden();
    await expect(urlInput(page)).toBeFocused();
    await expect(urlInput(page)).toHaveValue('not-a-url');
    await expect(cards(page)).toHaveCount(3);
  });

  test('shows only the title error when the title is empty', async ({ page }) => {
    await urlInput(page).fill('https://img.com/erick.png');
    await submitButton(page).click();

    await expect(page.getByText('Please type a title for the image.')).toBeVisible();
    await expect(page.getByText('Please type a valid URL')).toBeHidden();
    await expect(titleInput(page)).toBeFocused();
    await expect(cards(page)).toHaveCount(3);
  });
});

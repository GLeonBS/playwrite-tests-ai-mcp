// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const projects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
];

// Local only: real Google Chrome, headed (not used in CI)
if (!process.env.CI) {
  projects.push({
    name: 'chrome',
    use: { ...devices['Desktop Chrome'], channel: 'chrome', headless: false },
  });
}

module.exports = defineConfig({
  testDir: './tests',
  timeout: 5_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://erickwendel.github.io',
    trace: 'on-first-retry',
  },
  projects,
});

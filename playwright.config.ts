import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * Resolve the base URL for the run. When an external URL is provided (a
 * Netlify deploy-preview in CI, or Endform's cloud runners), tests run against
 * that already-deployed site and we must NOT boot a local `npm run dev` server.
 * Only start the local webServer when no external base URL was provided
 * (local development default).
 *
 * - PLAYWRIGHT_TEST_BASE_URL: what our GitHub Actions preview workflow sets.
 * - BASE_URL: what the Endform docs/workflow use.
 * - ENDFORM=true: set automatically on Endform's remote runners; belt-and-
 *   braces so we never try to spawn a dev server there.
 */
// Trim: a base URL sourced from a file/CI step can carry a trailing newline or
// surrounding whitespace, which would produce an invalid baseURL and break the
// webServer-skip condition.
const externalBaseURL = (process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.BASE_URL)?.trim() || undefined
const isEndform = process.env.ENDFORM === 'true'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [['blob'], ['line']] : [['html', { open: 'never' }], ['line']],
  captureGitInfo: { commit: true, diff: true },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: externalBaseURL || 'http://localhost:3001',

    /* Keep a Playwright trace for every failed test (not just retries) so
     * failures are debuggable after the fact. On Endform this surfaces as a
     * clickable trace link on the failed test attempt in the dashboard; with
     * 'on-first-retry' a test that fails without retrying produces no trace.
     * See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.CI ? { channel: 'chrome' } : {}),
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests.
   * Skipped when an external base URL is set (Netlify preview in CI, Endform
   * cloud runners), so we don't boot or race a local dev server. */
  webServer: (externalBaseURL || isEndform)
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3001',
        reuseExistingServer: !process.env.CI,
      },
})

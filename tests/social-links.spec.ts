import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, isMobile }) => {
  await page.goto('/');

  if(isMobile){
      await page.getByRole('button', { name: 'open menu' }).click();
    }
})

test.describe('social links in header', () => {
  test('twitter link in header works', async ({ page }) => {
    await page.context().route('https://twitter.com/**', route => route.fulfill({
      body: '<html><body><h1>Twitter</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('banner').getByRole('link', { name: 'twitter' }).click()
    ]);
    await expect(page1).toHaveURL('https://twitter.com/debs_obrien');
  });

  test('linkedIn link in header works', async ({ page }) => {
    await page.context().route('https://www.linkedin.com/**', route => route.fulfill({
      body: '<html><body><h1>LinkedIn</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('banner').getByRole('link', { name: 'linkedIn' }).click()
    ]);
    await expect(page1).toHaveURL('https://www.linkedin.com/in/debbie-o-brien-1a199975/');
  });

  test('GitHub link in header works', async ({ page }) => {
    await page.context().route('https://github.com/**', route => route.fulfill({
      body: '<html><body><h1>GitHub</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('banner').getByRole('link', { name: 'github' }).click()
    ]);
    await expect(page1).toHaveURL('https://github.com/debs-obrien');
  });

  test('youTube link in header works', async ({ page }) => {
    await page.context().route('https://www.youtube.com/**', route => route.fulfill({
      body: '<html><body><h1>YouTube</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('banner').getByRole('link', { name: 'youTube' }).click()
    ]);
    await expect(page1).toHaveURL('https://www.youtube.com/c/DebbieOBrien');
  });
});

test.describe('social links in footer', () => {
  test('twitter link in footer works', async ({ page }) => {
    await page.context().route('https://twitter.com/**', route => route.fulfill({
      body: '<html><body><h1>Twitter</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('contentinfo').getByRole('link', { name: 'twitter' }).click()
    ]);
    await expect(page1).toHaveURL('https://twitter.com/debs_obrien');
  });

  test('linkedIn link in footer works', async ({ page }) => {
    await page.context().route('https://www.linkedin.com/**', route => route.fulfill({
      body: '<html><body><h1>LinkedIn</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('contentinfo').getByRole('link', { name: 'linkedIn' }).click()
    ]);
    await expect(page1).toHaveURL('https://www.linkedin.com/in/debbie-o-brien-1a199975/');
  });

  test('GitHub link in footer works', async ({ page }) => {
    await page.context().route('https://github.com/**', route => route.fulfill({
      body: '<html><body><h1>GitHub</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('contentinfo').getByRole('link', { name: 'github' }).click()
    ]);
    await expect(page1).toHaveURL('https://github.com/debs-obrien');
  });

  test('youTube link in footer works', async ({ page }) => {
    await page.context().route('https://www.youtube.com/**', route => route.fulfill({
      body: '<html><body><h1>YouTube</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('contentinfo').getByRole('link', { name: 'youTube' }).click()
    ]);
    await expect(page1).toHaveURL('https://www.youtube.com/c/DebbieOBrien');
  });

  test('dev to link in footer works', async ({ page }) => {
    await page.context().route('https://dev.to/**', route => route.fulfill({
      body: '<html><body><h1>Dev to</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('contentinfo').getByRole('link', { name: 'dev to' }).click()
    ]);
    await expect(page1).toHaveURL('https://dev.to/debs_obrien');
  });

  test('twitch link in footer works', async ({ page }) => {
    await page.context().route('https://www.twitch.tv/**', route => route.fulfill({
      body: '<html><body><h1>Twitch</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('contentinfo').getByRole('link', { name: 'twitch' }).click()
    ]);
    await expect(page1).toHaveURL('https://www.twitch.tv/debs_obrien');
  });

  test('buy me a coffee link in footer works', async ({ page }) => {
    await page.context().route('https://www.buymeacoffee.com/**', route => route.fulfill({
      body: '<html><body><h1>buy me a coffee</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByRole('contentinfo').getByRole('link', { name: 'buy me a coffee' }).click()
    ]);
    await expect(page1).toHaveURL('https://www.buymeacoffee.com/debbieobrien');
  });
});


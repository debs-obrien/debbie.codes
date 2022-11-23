import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

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
  await page.context().route('https://www.youTube.com/**', route => route.fulfill({
    body: '<html><body><h1>YouTube</h1></body></html>'
  }));

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByRole('banner').getByRole('link', { name: 'youTube' }).click()
  ]);
  await expect(page1).toHaveURL('https://www.youtube.com/c/DebbieOBrien');
});

test.skip('social links in footer work', async ({ page }) => {
  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('contentinfo').getByRole('link', { name: 'twitter' }).click()
  ]);
  await expect(page1).toHaveURL('https://twitter.com/debs_obrien');

  const LinkedIn = await page.getByRole('contentinfo').getByRole('link', { name: 'linkedIn' });
  await expect(LinkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/debbie-o-brien-1a199975/');

  const youTube = await page.getByRole('contentinfo').getByRole('link', { name: 'youTube' });
  await expect(youTube).toHaveAttribute('href', 'https://www.youtube.com/c/DebbieOBrien');

  const [page4] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'twitch' }).click()
  ]);
  await expect(page4).toHaveURL('https://www.twitch.tv/debs_obrien');

  const [page5] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('contentinfo').getByRole('link', { name: 'github' }).click()
  ]);
  await expect(page5).toHaveURL('https://github.com/debs-obrien');

  const [page6] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('contentinfo').getByRole('link', { name: 'dev to' }).click()
  ]);
  await expect(page6).toHaveURL('https://dev.to/debs_obrien');

  const [page7] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('contentinfo').getByRole('link', { name: 'speaker profile' }).click()
  ]);
  await expect(page7).toHaveURL('https://noti.st/debbie');

  const [page8] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('contentinfo').getByRole('link', { name: 'buy me a coffee' }).click()
  ]);
  await expect(page8).toHaveURL('https://www.buymeacoffee.com/debbieobrien');
});

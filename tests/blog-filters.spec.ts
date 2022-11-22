import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/blog');
})

test('tag links to page with posts on architecture', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /architecture/i }).click();
  await page.getByRole('heading', { name: /blog posts on architecture/i }).click();
});

test('tag links to page with posts on dev rel', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /dev rel/i }).click();
  await page.getByRole('heading', { name: /blog posts on dev rel/i }).click();
});

test('tag links to page with posts on jamstack', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /jamstack/i }).click();
  await page.getByRole('heading', { name: /blog posts on jamstack/i }).click();
});

test('tag links to page with posts on lifestyle', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /lifestyle/i }).click();
  await page.getByRole('heading', { name: /blog posts on lifestyle/i }).click();
});

test('tag links to page with posts on mentoring', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /mentoring/i }).click();
  await expect(page.getByRole('heading', { name: /blog posts on mentoring/i })).toBeVisible();
});

test('tag links to page with posts on motivation', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /motivation/i }).click();
  await page.getByRole('heading', { name: /blog posts on motivation/i }).click();
});

test('tag links to page with posts on nuxt', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /nuxt/i }).click();
  await page.getByRole('heading', { name: /blog posts on nuxt/i }).click();
});

test('tag links to page with posts on performance', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /performance/i }).click();
  await page.getByRole('heading', { name: /blog posts on performance/i }).click();
});

test('tag links to page with posts on playwright', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /playwright/i }).click();
  await page.getByRole('heading', { name: /blog posts on playwright/i }).click();
});

test('tag links to page with posts on react', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /react/i }).click();
  await page.getByRole('heading', { name: /blog posts on react/i }).click();
});

test('tag links to page with posts on testing', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /testing/i }).click();
  await page.getByRole('heading', { name: /blog posts on testing/i }).click();
});

test('tag links to page with posts on typescript', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /typescript/i }).click();
  await page.getByRole('heading', { name: /blog posts on typescript/i }).click();
});

test('tag links to page with posts on vs code', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /vs code/i }).click();
  await page.getByRole('heading', { name: /blog posts on vs code/i }).click();
});

test('tag links to page with posts on vue', async ({ page }) => {
  await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /vue/i }).click();
  await page.getByRole('heading', { name: /blog posts on vue/i }).click();
});

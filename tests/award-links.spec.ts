import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, isMobile }) => {
  await page.goto('/');

  if(isMobile){
    await page.getByRole('button', { name: 'open menu' }).click();
  }
})

test('google gde link in home page works', async ({ page }) => {
  await page.context().route('https://developers.google.com/**', route => route.fulfill({
    body: '<html><body><h1>Google GDE</h1></body></html>'
  }));

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByRole('link', { name: 'Google GDE' }).click()
  ]);
  await expect(page1).toHaveURL('https://developers.google.com/community/experts/directory/profile/profile-debbie-o-brien');
});

test('microsoft mvp link in home page works', async ({ page }) => {
  await page.context().route('https://mvp.microsoft.com/**', route => route.fulfill({
    body: '<html><body><h1>Microsoft MVP</h1></body></html>'
  }));

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByRole('link', { name: 'Former Microsoft MVP' }).click()
  ]);
  await expect(page1).toHaveURL('https://mvp.microsoft.com/en-us');
});

test('GitHub Star link in home page works', async ({ page }) => {
  await page.context().route('https://stars.github.com/alumni/**', route => route.fulfill({
    body: '<html><body><h1>Github Star</h1></body></html>'
  }));

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByRole('link', { name: 'GitHub Star Alumni' }).click()
  ]);
  await expect(page1).toHaveURL('https://stars.github.com/alumni/');
});

test('Cloudinary MDE link in home page works', async ({ page }) => {
  await page.context().route('https://cloudinary.com/**', route => route.fulfill({
    body: '<html><body><h1>Cloudinary MDE</h1></body></html>'
  }));

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByRole('link', { name: 'Cloudinary MDE' }).click()
  ]);
  await expect(page1).toHaveURL('https://cloudinary.com/mde');
});

test('Auth0 Ambassador link in home page works', async ({ page }) => {
  await page.context().route('https://auth0.com/**', route => route.fulfill({
    body: '<html><body><h1>Auth0 Ambassador</h1></body></html>'
  }));

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByRole('link', { name: 'Auth0 Ambassador' }).click()
  ]);
  await expect(page1).toHaveURL('https://auth0.com/ambassador-program/');
});

test('Nuxt Ambassador link in home page works', async ({ page }) => {
  await page.context().route('https://nuxtjs.org/**', route => route.fulfill({
    body: '<html><body><h1>Nuxt Ambassador</h1></body></html>'
  }));

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByRole('link', { name: 'Nuxt Ambassador' }).click()
  ]);
  await expect(page1).toHaveURL('https://nuxtjs.org/teams/');
});


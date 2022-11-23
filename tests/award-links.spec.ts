import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test.skip('home contains award links', async ({ page }) => {
  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Google GDE' }).click()
  ]);
  await expect(page1).toHaveURL('https://developers.google.com/community/experts/directory/profile/profile-debbie-o-brien');

  const [page2] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Former Microsoft MVP' }).click()
  ]);
  await expect(page2).toHaveURL('https://mvp.microsoft.com/en-us');

  const [page3] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'GitHub Star Alumni' }).click()
  ]);
  await expect(page3).toHaveURL('https://stars.github.com/alumni/');

  const [page4] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Cloudinary MDE' }).click()
  ]);
  await expect(page4).toHaveURL('https://cloudinary.com/mde');

  const [page5] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Auth0 Ambassador' }).click()
  ]);
  await expect(page5).toHaveURL('https://auth0.com/ambassador-program');

  const [page6] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Nuxt Ambassador' }).click()
  ]);
  await expect(page6).toHaveURL('https://nuxtjs.org/teams/');
});

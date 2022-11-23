import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
  await page.getByRole('link', { name: 'Challenging Yourself Cycle all around the island of Mallorca for a total of 235km with an expected cycling time of 9.5 hours at a speed of 25km per hour. Just the thoughts of that is scary enough. Was I able for it? Had I trained enough for it? Probably not. But I was determined to give it a go.' }).click();
});

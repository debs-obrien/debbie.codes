import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('/')
})

test('contains main heading', async ({ page }) => {
  const heading = page.locator('h1:has-text("Debbie O\'Brien")')
  await expect(heading).toBeVisible()
})

test('contains job title', async ({ page }) => {
  const jobTitle = page.locator('text=Senior Program Manager at Microsoft')
  await expect(jobTitle).toBeVisible()
})

// test('contains intro', async ({ page }) => {
//   const intro = page.locator('text=Microsoft MVP | GitHub Star | Google GDE')
//   await expect(intro).toBeVisible()
// })

test('shows minimum number of posts', async ({ page }) => {
  const posts = await page.locator('data-test-id=posts').count()
  await expect(posts).toBeGreaterThanOrEqual(3)
})

test('shows minimum number of talks', async ({ page }) => {
  const talks = await page.locator('data-test-id=talks').count()
  await expect(talks).toBeGreaterThanOrEqual(3)
})

test('shows minimum number of courses', async ({ page }) => {
  const courses = await page.locator('data-test-id=courses').count()
  await expect(courses).toBeGreaterThanOrEqual(3)
})

test('shows minimum number of interviews', async ({ page }) => {
  const interviews = await page.locator('data-test-id=interviews').count()
  await expect(interviews).toBeGreaterThanOrEqual(3)
})

test('recent posts link', async ({ page }) => {
  await page.locator('text=Recent Blog Posts').click()
  await expect(page).toHaveURL('/blog')
})

test('recent talks link', async ({ page }) => {
  await page.locator('text=Recent Talks').click()
  await expect(page).toHaveURL('/resources/conference-talks')
})

test('recent interviews link', async ({ page }) => {
  await page.locator('text=Recent Interviews').click()
  await expect(page).toHaveURL('/resources/interviews')
})

test('recent courses link', async ({ page }) => {
  await page.locator('text=Recent Courses').click()
  await expect(page).toHaveURL('/resources/courses')
})

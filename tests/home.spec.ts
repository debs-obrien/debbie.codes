import { test, expect } from '@playwright/test'

test('home page', async ({ page }) => {
  // Go to /
  await page.goto('/')

  await page.locator("h1 text=Debbie O'Brien")

  // Click text=Debbie O'Brien Microsoft MVP | GitHub Star | Google GDE Cloudinary MDE | Auth0 A >> img[alt="Debbie O\'Brien"]
  await page.locator(
    'text=Debbie O\'Brien Microsoft MVP | GitHub Star | Google GDE Cloudinary MDE | Auth0 A >> img[alt="Debbie O\\\'Brien"]'
  )

  // Click h1:has-text("Debbie O'Brien")
  await page.locator('h1:has-text("Debbie O\'Brien")')

  // Click text=Microsoft MVP | GitHub Star | Google GDE Cloudinary MDE | Auth0 Ambassador | Nux
  await page.locator(
    'text=Microsoft MVP | GitHub Star | Google GDE Cloudinary MDE | Auth0 Ambassador | Nux'
  )

  // Click text=Recent Blog Posts
  await page.locator('text=Recent Blog Posts')
  const posts = await page.locator('data-test-id=posts').count()
  await expect(posts).toBeGreaterThanOrEqual(3)

  //await page.locator('.image')

  // Click text=Recent Talks
  await page.locator('text=Recent Talks')
  const talks = await page.locator('data-test-id=talks').count()
  await expect(talks).toBeGreaterThanOrEqual(3)
  //await page.locator('.video')

  // Click text=Recent Courses
  await page.locator('text=Recent Courses')
  const courses = await page.locator('data-test-id=courses').count()
  await expect(courses).toBeGreaterThanOrEqual(3)

  //await page.locator('.image')
})

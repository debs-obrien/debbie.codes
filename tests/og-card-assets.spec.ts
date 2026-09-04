import { expect, test } from '@playwright/test'

test.describe('OG / social card assets', () => {
  for (const path of ['/x-card.png', '/twitter-card.png'] as const) {
    test(`${path} returns 200 image`, async ({ request }) => {
      const response = await request.get(path)
      expect(response.status(), `${path} should return 200`).toBe(200)
      expect(response.headers()['content-type'] ?? '').toMatch(/image\/png/i)
    })
  }
})

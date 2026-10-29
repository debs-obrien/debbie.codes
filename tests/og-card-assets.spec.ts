import { expect, test } from './fixtures';

test.describe('OG / social card assets', () => {
  for (const path of ['/x-card.jpg', '/twitter-card.jpg'] as const) {
    test(`${path} returns 200 JPEG under 300KB`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status(), `${path} should return 200`).toBe(200);
      expect(response.headers()['content-type'] ?? '').toMatch(/image\/jpeg/i);
      const body = await response.body();
      expect(body.byteLength, `${path} should be under 300KB`).toBeLessThan(300 * 1024);
    });
  }
});

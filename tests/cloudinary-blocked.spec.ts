import { expect, isCloudinaryBandwidthRequest, test } from './fixtures'

test.describe('Cloudinary bandwidth guard', () => {
  test('detects direct and proxied Cloudinary URLs', () => {
    expect(isCloudinaryBandwidthRequest('https://res.cloudinary.com/debsobrien/image/upload/x')).toBe(true)
    expect(isCloudinaryBandwidthRequest('http://127.0.0.1:8000/_ipx/f_webp&q_80/https://res.cloudinary.com/x')).toBe(true)
    expect(isCloudinaryBandwidthRequest('https://debbie.codes/.netlify/images?q=80&url=https:%2F%2Fres.cloudinary.com%2Fx')).toBe(true)
    expect(isCloudinaryBandwidthRequest('https://debbie.codes/.netlify/images?url=%2Fimages%2Fblog%2Fcovers%2Fx.png')).toBe(false)
    expect(isCloudinaryBandwidthRequest('https://debbie.codes/images/blog/covers/x.png')).toBe(false)
  })

  test('page loads do not download real Cloudinary media bytes', async ({ page }) => {
    // Route fulfill still reports the original URL with status 200, so ignore
    // tiny placeholder bodies and only fail on real (large) payloads.
    const leaked: Array<{ url: string, bytes: number }> = []
    page.on('response', async (response) => {
      const url = response.url()
      if (!isCloudinaryBandwidthRequest(url) || !response.ok())
        return
      try {
        const body = await response.body()
        // Placeholder PNG is <1KB; anything larger is a real origin fetch.
        if (body.byteLength > 2048)
          leaked.push({ url, bytes: body.byteLength })
      }
      catch {
        // Body unavailable (redirect/opaque) — ignore
      }
    })

    await page.goto('/')
    await page.goto('/blog/work-life-balance')
    await page.goto('/blog/testing-color-mode')
    await page.goto('/blog/nuxt-lite-youtube-embeds')

    expect(
      leaked,
      `unexpected Cloudinary downloads:\n${leaked.map(l => `${l.bytes}B ${l.url}`).join('\n')}`,
    ).toEqual([])
  })
})

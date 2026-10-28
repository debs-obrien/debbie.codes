import { expect, isCloudinaryBandwidthRequest, test } from './fixtures'

test.describe('Cloudinary bandwidth guard', () => {
  test('detects direct and proxied Cloudinary URLs', () => {
    expect(isCloudinaryBandwidthRequest('https://res.cloudinary.com/debsobrien/image/upload/x')).toBe(true)
    expect(isCloudinaryBandwidthRequest('http://127.0.0.1:8000/_ipx/f_webp&q_80/https://res.cloudinary.com/x')).toBe(true)
    expect(isCloudinaryBandwidthRequest('https://debbie.codes/.netlify/images?q=80&url=https:%2F%2Fres.cloudinary.com%2Fx')).toBe(true)
    expect(isCloudinaryBandwidthRequest('https://debbie.codes/.netlify/images?url=%2Fimages%2Fblog%2Fcovers%2Fx.png')).toBe(false)
    expect(isCloudinaryBandwidthRequest('https://debbie.codes/images/blog/covers/x.png')).toBe(false)
  })

  test('page loads do not download res.cloudinary.com bytes', async ({ page }) => {
    const cloudinaryGets: string[] = []
    page.on('response', (response) => {
      if (response.url().includes('res.cloudinary.com') && response.ok())
        cloudinaryGets.push(response.url())
    })

    await page.goto('/')
    await page.goto('/blog/work-life-balance')
    await page.goto('/blog/testing-color-mode')
    await page.goto('/blog/nuxt-lite-youtube-embeds')

    expect(cloudinaryGets, `unexpected Cloudinary downloads:\n${cloudinaryGets.join('\n')}`).toEqual([])
  })
})

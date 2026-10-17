import { chromium, expect, test } from '@playwright/test'
import { webmcpTools } from '../utils/webmcp/tools'

const expected = Object.values(webmcpTools).map(t => t.name).sort()
const listVideos = webmcpTools.listVideos

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('registers list-videos with schema and readOnly hint', async ({ page }) => {
  await expect.poll(async () => (await page.webmcp.tools()).map(t => t.name).sort()).toEqual(expected)

  const tool = (await page.webmcp.tools()).find(t => t.name === 'list-videos')
  expect(tool).toBeTruthy()
  expect(tool!.name.length).toBeLessThanOrEqual(30)
  expect(tool!.description.length).toBeLessThanOrEqual(500)
  expect(tool!.description).toBe(listVideos.description)
  expect(tool!.inputSchema).toEqual(listVideos.inputSchema)
  expect(tool!.annotations?.readOnly).toBe(true)
})

test('list-videos returns real videos that match /videos', async ({ page }) => {
  await expect.poll(async () => (await page.webmcp.tools()).length).toBeGreaterThan(0)

  const result: any = await page.webmcp.callTool('list-videos', { tag: 'playwright', limit: 3 })
  expect(result.error).toBeUndefined()
  expect(result.videos.length).toBeGreaterThan(0)
  expect(result.videos.length).toBeLessThanOrEqual(3)
  expect(JSON.stringify(result).length).toBeLessThanOrEqual(1500)

  for (const video of result.videos) {
    expect(video).toEqual(expect.objectContaining({
      title: expect.any(String),
      date: expect.any(String),
      link: expect.stringMatching(/^https:\/\/www\.youtube\.com\/watch\?v=/),
      tags: expect.any(Array),
    }))
    expect(video).toHaveProperty('conference')
    expect(video).toHaveProperty('host')
    expect(video.tags.map((t: string) => t.toLowerCase())).toContain('playwright')
  }

  await page.goto('/videos')
  await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0)
  const pageText = await page.locator('main').innerText()
  for (const video of result.videos)
    expect(pageText).toContain(video.title)
})

test('bad input returns an error sentence, not an exception', async ({ page }) => {
  await expect.poll(async () => (await page.webmcp.tools()).length).toBeGreaterThan(0)

  const result: any = await page.webmcp.callTool('list-videos', { tag: 'definitely-not-a-tag' })
  expect(result.error).toMatch(/No videos matched tag 'definitely-not-a-tag'/)
  expect(result.videos).toBeUndefined()
})

test('output stays under about 1,500 characters', async ({ page }) => {
  await expect.poll(async () => (await page.webmcp.tools()).length).toBeGreaterThan(0)

  const result: any = await page.webmcp.callTool('list-videos', { limit: 10 })
  expect(result.error).toBeUndefined()
  expect(result.videos.length).toBeGreaterThan(0)
  expect(JSON.stringify(result).length).toBeLessThanOrEqual(1500)
})

test('page load without WebMCP fetches no WebMCP code or content dump', async ({ baseURL }) => {
  const browser = await chromium.launch({
    ...(process.env.CI ? { channel: 'chrome' as const } : {}),
  })
  const page = await browser.newPage()
  const urls: string[] = []
  page.on('request', (req) => {
    urls.push(req.url())
  })

  await page.goto(baseURL || 'http://127.0.0.1:8000/')
  await page.waitForLoadState('networkidle')

  const hasModelContext = await page.evaluate(() => {
    const mc = (document as any).modelContext ?? (navigator as any).modelContext
    return Boolean(mc && typeof mc.registerTool === 'function')
  })
  expect(hasModelContext).toBe(false)

  const suspicious = urls.filter(u =>
    /webmcp/i.test(u)
    || /sql_dump/i.test(u)
    || /__nuxt_content/i.test(u),
  )
  expect(suspicious).toEqual([])

  await browser.close()
})

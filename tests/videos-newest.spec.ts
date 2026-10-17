import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { expect, test } from '@playwright/test'
import { HIDDEN_YOUTUBE_VIDEO_IDS } from '../utils/videos'

const isEndform = process.env.ENDFORM === 'true'
const videosDir = join('content', 'videos')

type VideoFrontmatter = {
  title: string
  date: string
  video: string
  featured: boolean
  featuredOrder: number
}

function frontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match)
    return undefined
  return match[1].trim().replace(/^["']|["']$/g, '')
}

/** Derive visible videos from content/videos (excludes hard-banned YouTube IDs). */
function loadVisibleVideosFromContent(): VideoFrontmatter[] {
  if (!existsSync(videosDir))
    return []

  const videos: VideoFrontmatter[] = []
  for (const file of readdirSync(videosDir)) {
    if (!file.endsWith('.md'))
      continue
    const raw = readFileSync(join(videosDir, file), 'utf8')
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch)
      continue
    const block = fmMatch[1]
    const videoId = frontmatterValue(block, 'video')?.trim()
    const title = frontmatterValue(block, 'title')
    const date = frontmatterValue(block, 'date')
    if (!videoId || !title || !date)
      continue
    if (HIDDEN_YOUTUBE_VIDEO_IDS.has(videoId))
      continue

    const featuredRaw = frontmatterValue(block, 'featured')
    const featuredOrderRaw = frontmatterValue(block, 'featuredOrder')
    videos.push({
      title,
      date: date.slice(0, 10),
      video: videoId,
      featured: featuredRaw === 'true',
      featuredOrder: featuredOrderRaw ? Number(featuredOrderRaw) : 99,
    })
  }
  return videos
}

test.describe('Videos newest entries from content', () => {
  test('Featured and Latest reflect newest content dates', async ({ page }) => {
    test.skip(
      isEndform || !existsSync(videosDir),
      'content/videos is not available on Endform runners (no repo checkout)',
    )

    const all = loadVisibleVideosFromContent()
    expect(all.length, 'expected video markdown under content/videos').toBeGreaterThan(0)

    // Same selection rules as pages/videos/index.vue
    const featured = [...all]
      .filter(v => v.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, 3)
    const featuredIds = new Set(featured.map(v => v.video))
    const latestPool = all
      .filter(v => !featuredIds.has(v.video))
      .sort((a, b) => b.date.localeCompare(a.date))

    await page.goto('/videos')
    await expect(page.getByRole('heading', { name: 'Latest', level: 2 })).toBeVisible()

    const featuredRegion = page.getByRole('region', { name: 'Featured' })
    const latestRegion = page.getByRole('region', { name: 'Latest' })

    await test.step('Featured shows content featured videos in featuredOrder', async () => {
      await expect(featuredRegion.getByRole('article')).toHaveCount(3)
      for (let i = 0; i < featured.length; i++) {
        await expect(featuredRegion.getByRole('article').nth(i).getByRole('heading')).toHaveText(
          featured[i].title,
        )
      }
    })

    await test.step('Latest leads with newest non-featured content by date', async () => {
      const latestArticles = latestRegion.getByRole('article')
      await expect(latestArticles).toHaveCount(24)

      const newestDate = latestPool[0]?.date
      expect(newestDate).toBeTruthy()
      const newestTitles = latestPool.filter(v => v.date === newestDate).map(v => v.title)

      // All same-date newest entries appear at the top of Latest (order among ties may vary).
      const topTitles: string[] = []
      for (let i = 0; i < newestTitles.length; i++) {
        topTitles.push((await latestArticles.nth(i).getByRole('heading').innerText()).trim())
      }
      expect(new Set(topTitles)).toEqual(new Set(newestTitles))

      // Datetimes in Latest are non-increasing (newest first).
      const datetimes: string[] = []
      const sample = Math.min(8, await latestArticles.count())
      for (let i = 0; i < sample; i++) {
        const dt = await latestArticles.nth(i).locator('time').getAttribute('datetime')
        expect(dt, `article ${i} should have <time datetime>`).toBeTruthy()
        datetimes.push(dt!)
      }
      for (let i = 1; i < datetimes.length; i++) {
        expect(
          datetimes[i - 1]! >= datetimes[i]!,
          `Latest dates should be newest-first: ${datetimes[i - 1]} then ${datetimes[i]}`,
        ).toBe(true)
      }
      expect(datetimes[0]).toBe(newestDate)
    })
  })
})

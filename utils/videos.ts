/**
 * Curated filter chips for /videos (designer lock).
 * Agents → existing `ai` tag (agent/AI-agent content). Grok Bot → `grok-bot`.
 */
export const videoFilterChips = [
  { label: 'All', to: '/videos', slug: null },
  { label: 'Playwright', to: '/videos/tags/playwright', slug: 'playwright' },
  { label: 'MCP', to: '/videos/tags/mcp', slug: 'mcp' },
  { label: 'Agents', to: '/videos/tags/ai', slug: 'ai' },
  { label: 'Nuxt', to: '/videos/tags/nuxt', slug: 'nuxt' },
  { label: 'Grok Bot', to: '/videos/tags/grok-bot', slug: 'grok-bot' },
] as const

/** Hard ban: never surface these YouTube IDs anywhere on /videos. */
export const HIDDEN_YOUTUBE_VIDEO_IDS = new Set([
  'A8Gu-ayw6dM',
  'yi8b55MLLlg',
])

export function isVisibleVideo(video: { video?: string } | null | undefined) {
  if (!video?.video)
    return false
  return !HIDDEN_YOUTUBE_VIDEO_IDS.has(video.video.trim())
}

export function filterVisibleVideos<T extends { video?: string }>(videos: T[] | null | undefined): T[] {
  if (!videos)
    return []
  return videos.filter(isVisibleVideo)
}

type TopRowVideo = {
  video?: string
  date?: string
  featured?: boolean
  featuredOrder?: number
}

/**
 * Top row on /videos: card 1 is newest visible by date (with a Latest label in the UI),
 * cards 2–3 are featured in featuredOrder. If the newest is featured, it stays first as
 * Latest and the row fills with remaining featured (then next-newest) without duplicates.
 */
export function buildVideosTopRow<T extends TopRowVideo>(
  visibleVideos: T[] | null | undefined,
  size = 3,
): T[] {
  if (!visibleVideos?.length)
    return []

  const byDate = [...visibleVideos].sort((a, b) =>
    String(b.date ?? '').localeCompare(String(a.date ?? '')),
  )
  const newest = byDate[0]
  if (!newest?.video)
    return []

  const featured = [...visibleVideos]
    .filter(v => v.featured && v.video)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))

  const top: T[] = [newest]
  const used = new Set<string>([newest.video])

  for (const video of featured) {
    if (top.length >= size)
      break
    const id = video.video!
    if (used.has(id))
      continue
    top.push(video)
    used.add(id)
  }

  if (top.length < size) {
    for (const video of byDate) {
      if (top.length >= size)
        break
      const id = video.video
      if (!id || used.has(id))
        continue
      top.push(video)
      used.add(id)
    }
  }

  return top
}

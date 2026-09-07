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

import { queryCollection } from '@nuxt/content/server'

const siteUrl = 'https://debbie.codes'

/** Static routes backed by pages/ (and nav) — not invented. */
const staticRoutes = [
  '/',
  '/about',
  '/speaking',
  '/videos',
  '/podcasts',
  '/courses',
  '/blog',
  '/now',
  '/contact',
]

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;')
}

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, '-')
}

function collectTags(items: { tags?: string[] }[]) {
  const tags = new Set<string>()
  for (const item of items) {
    for (const tag of item.tags || []) {
      const normalized = normalizeTag(tag)
      if (normalized)
        tags.add(normalized)
    }
  }
  return tags
}

export default defineEventHandler(async (event) => {
  const urls = new Set<string>(staticRoutes)

  const posts = await queryCollection(event, 'blog')
    .select('path', 'published', 'tags')
    .all()

  for (const post of posts) {
    if (post.published === false || !post.path)
      continue
    urls.add(post.path)
  }

  const [videos, podcasts, courses] = await Promise.all([
    queryCollection(event, 'videos').select('tags').all(),
    queryCollection(event, 'podcasts').select('tags').all(),
    queryCollection(event, 'courses').select('tags').all(),
  ])

  for (const tag of collectTags(posts))
    urls.add(`/blog/tags/${tag}`)
  for (const tag of collectTags(videos))
    urls.add(`/videos/tags/${tag}`)
  for (const tag of collectTags(podcasts))
    urls.add(`/podcasts/tags/${tag}`)
  for (const tag of collectTags(courses))
    urls.add(`/courses/tags/${tag}`)

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...urls].sort().map(path => [
      '  <url>',
      `    <loc>${escapeXml(`${siteUrl}${path === '/' ? '' : path}`)}</loc>`,
      '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
  ].join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return body
})

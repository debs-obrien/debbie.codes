/**
 * Build-time sitemap for static Netlify hosting.
 * Writes public/sitemap.xml so /sitemap.xml is a plain static asset —
 * never a Netlify Function that can 500 when SQLite/content is unavailable.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const siteUrl = 'https://debbie.codes'

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

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;')
}

function normalizeTag(tag) {
  return String(tag).trim().toLowerCase().replace(/\s+/g, '-')
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    return {}
  const fm = match[1]
  const out = {}

  const published = fm.match(/^published:\s*(true|false)\s*$/m)
  if (published)
    out.published = published[1] === 'true'

  const tagsMatch = fm.match(/^tags:\s*\[([^\]]*)\]\s*$/m)
  if (tagsMatch) {
    out.tags = tagsMatch[1]
      .split(',')
      .map(t => t.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return out
}

function listMarkdown(dir) {
  try {
    return readdirSync(dir)
      .filter(name => name.endsWith('.md'))
      .map(name => ({
        slug: name.replace(/\.md$/, ''),
        raw: readFileSync(join(dir, name), 'utf8'),
      }))
  }
  catch {
    return []
  }
}

function collectTags(items) {
  const tags = new Set()
  for (const item of items) {
    for (const tag of item.tags || []) {
      const normalized = normalizeTag(tag)
      if (normalized)
        tags.add(normalized)
    }
  }
  return tags
}

export function generateSitemap() {
  const urls = new Set(staticRoutes)

  const posts = listMarkdown(join(root, 'content/blog')).map(({ slug, raw }) => {
    const fm = parseFrontmatter(raw)
    return { slug, path: `/blog/${slug}`, ...fm }
  })

  for (const post of posts) {
    if (post.published === false)
      continue
    urls.add(post.path)
  }

  const videos = listMarkdown(join(root, 'content/videos')).map(({ raw }) => parseFrontmatter(raw))
  const podcasts = listMarkdown(join(root, 'content/podcasts')).map(({ raw }) => parseFrontmatter(raw))
  const courses = listMarkdown(join(root, 'content/courses')).map(({ raw }) => parseFrontmatter(raw))

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

  const outPath = join(root, 'public/sitemap.xml')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, body)
  return { outPath, count: urls.size }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isDirectRun) {
  const { outPath, count } = generateSitemap()
  console.log(`Wrote ${count} URLs to ${outPath}`)
}

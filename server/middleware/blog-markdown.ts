import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { createError, defineEventHandler, getRequestURL, setHeader } from 'h3'
import { parseBlogFrontmatter, renderBlogMarkdownFile } from '../../utils/llms-markdown'

const SITE = 'https://debbie.codes'

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function asTags(value: unknown) {
  if (!Array.isArray(value))
    return [] as string[]
  const tags: string[] = []
  for (const tag of value) {
    const normalized = String(tag).trim().toLowerCase().replace(/\s+/g, '-')
    if (normalized && !tags.includes(normalized))
      tags.push(normalized)
  }
  return tags
}

/**
 * Serve /blog/<slug>.md as text/markdown for agents.
 * Implemented as middleware (not a Nitro *.md route) because `/blog/:slug.md`
 * also matched HTML `/blog/:slug` routes in Nitro 2 / Nuxt 4.
 */
export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname.replace(/\/$/, '')
  const match = pathname.match(/^\/blog\/([^/]+)\.md$/)
  if (!match)
    return

  const slug = match[1]
  if (!slug || slug.includes('..'))
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })

  const file = join(process.cwd(), 'content/blog', `${slug}.md`)
  if (!existsSync(file))
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })

  const raw = readFileSync(file, 'utf8')
  const fm = parseBlogFrontmatter(raw)
  if (fm.published === false)
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })

  const title = asString(fm.title)
  const date = asString(fm.date)
  if (!title || !date)
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })

  const body = renderBlogMarkdownFile({
    title,
    date,
    description: asString(fm.description),
    url: `${SITE}/blog/${slug}`,
    tags: asTags(fm.tags),
    raw,
  })

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})

/**
 * Unit checks for Accept: text/markdown negotiation + Vercel Build Output route.
 * Run: npm run test:vercel-routes
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  blogHtmlSlug,
  MARKDOWN_NOT_FOUND,
  prefersMarkdown,
  quality,
} from '../utils/blog-accept-markdown.ts'
import { VERCEL_BLOG_MARKDOWN_ACCEPT } from './vercel-build-config.mjs'

describe('prefersMarkdown (Netlify edge parity)', () => {
  it('requires an explicit text/markdown token (not */* alone)', () => {
    expect(prefersMarkdown('*/*')).toBe(false)
    expect(prefersMarkdown('text/html,application/xhtml+xml,*/*;q=0.8')).toBe(false)
  })

  it('accepts bare text/markdown', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true)
  })

  it('rejects text/markdown;q=0', () => {
    expect(prefersMarkdown('text/markdown;q=0, */*;q=1')).toBe(false)
    expect(quality('text/markdown;q=0, */*;q=1', 'text/markdown')).toBe(0)
  })

  it('rejects when HTML is preferred over markdown', () => {
    expect(prefersMarkdown('text/html, text/markdown;q=0.5')).toBe(false)
  })

  it('accepts when markdown q >= html q', () => {
    expect(prefersMarkdown('text/markdown, text/html;q=0.9')).toBe(true)
  })
})

describe('blogHtmlSlug', () => {
  it('matches HTML blog slugs only', () => {
    expect(blogHtmlSlug('/blog/webmcp-on-my-site')).toBe('webmcp-on-my-site')
    expect(blogHtmlSlug('/blog/webmcp-on-my-site/')).toBe('webmcp-on-my-site')
  })

  it('rejects .md paths and nested segments', () => {
    expect(blogHtmlSlug('/blog/webmcp-on-my-site.md')).toBeNull()
    expect(blogHtmlSlug('/blog/tags/nuxt')).toBeNull()
    expect(blogHtmlSlug('/blog/page/1')).toBeNull()
  })
})

describe('vercel blog markdown accept route', () => {
  const re = new RegExp(VERCEL_BLOG_MARKDOWN_ACCEPT.src)

  it('matches html slugs and excludes .md', () => {
    expect(re.test('/blog/webmcp-on-my-site')).toBe(true)
    expect(re.test('/blog/webmcp-on-my-site.md')).toBe(false)
    expect(VERCEL_BLOG_MARKDOWN_ACCEPT.dest).toBe('/__fallback')
  })
})

describe('markdown 404 body', () => {
  it('matches live size (~146 B) with discovery links', () => {
    expect(MARKDOWN_NOT_FOUND.length).toBe(146)
    expect(MARKDOWN_NOT_FOUND).toContain('https://debbie.codes/llms.txt')
    expect(MARKDOWN_NOT_FOUND).toContain('https://debbie.codes/sitemap.xml')
  })
})

describe('built Vercel output (when present)', () => {
  const configPath = join(process.cwd(), '.vercel/output/config.json')
  const mdPath = join(process.cwd(), '.vercel/output/static/blog/webmcp-on-my-site.md')

  it('accept route excludes .md and catch-all is static 404', () => {
    let config
    try {
      config = JSON.parse(readFileSync(configPath, 'utf8'))
    }
    catch {
      // No local vercel build in this run — skip rather than fail CI unit job.
      return
    }
    const md = config.routes.find(
      r => r && r.dest === '/__fallback' && typeof r.src === 'string' && r.src.includes('blog'),
    )
    expect(md, 'missing blog Accept → __fallback route').toBeTruthy()
    expect(new RegExp(md.src).test('/blog/webmcp-on-my-site')).toBe(true)
    expect(new RegExp(md.src).test('/blog/webmcp-on-my-site.md')).toBe(false)

    const static404 = config.routes.find(r => r && r.dest === '/404.html' && r.status === 404)
    expect(static404).toBeTruthy()
  })

  it('prerendered markdown body exists for Accept fallback to fetch', () => {
    let body
    try {
      body = readFileSync(mdPath, 'utf8')
    }
    catch {
      return
    }
    expect(body.startsWith('# ')).toBe(true)
    expect(body).toContain('Canonical: https://debbie.codes/blog/webmcp-on-my-site')
    expect(body.length).toBeGreaterThan(1000)
  })
})

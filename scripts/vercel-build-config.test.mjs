/**
 * Unit checks for Vercel Build Output trailing-slash route order.
 * Run: npm run test:vercel-routes
 */
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  assertAliasRedirectsBeforeSlashStrip,
  findTrailingSlashStripIndex,
  isThemed404Html,
  patchVercelBuildConfig,
  spa404FromDonorHtml,
  VERCEL_TRAILING_SLASH_STRIP,
} from './vercel-build-config.mjs'

describe('assertAliasRedirectsBeforeSlashStrip', () => {
  it('passes when /talks/ and /resources/ 301s sit before the slash strip', () => {
    const routes = [
      { src: '/talks/', status: 301, headers: { Location: '/speaking' } },
      { src: '/resources/', status: 301, headers: { Location: '/' } },
      { src: '/talks', status: 301, headers: { Location: '/speaking' } },
      { ...VERCEL_TRAILING_SLASH_STRIP },
      { handle: 'filesystem' },
    ]
    const result = assertAliasRedirectsBeforeSlashStrip(routes)
    expect(result.ok).toBe(true)
    expect(findTrailingSlashStripIndex(routes)).toBe(3)
  })

  it('fails when slash strip precedes /talks/', () => {
    const routes = [
      { ...VERCEL_TRAILING_SLASH_STRIP },
      { src: '/talks/', status: 301, headers: { Location: '/speaking' } },
      { src: '/resources/', status: 301, headers: { Location: '/' } },
    ]
    const result = assertAliasRedirectsBeforeSlashStrip(routes)
    expect(result.ok).toBe(false)
    expect(result.issues.some(i => i.includes('/talks/'))).toBe(true)
  })
})

describe('patchVercelBuildConfig', () => {
  it('inserts 301 slash strip, markdown Accept fallback, and static 404 catch-all', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'vercel-cfg-'))
    const staticDir = join(dir, 'static')
    await writeFile(join(dir, 'config.json'), `${JSON.stringify({
      version: 3,
      trailingSlash: false,
      routes: [
        { src: '/talks/', status: 301, headers: { Location: '/speaking' } },
        { src: '/resources/', status: 301, headers: { Location: '/' } },
        { src: '/talks', status: 301, headers: { Location: '/speaking' } },
        { src: '/blog.html', headers: { 'X-Frame-Options': 'DENY' } },
        { handle: 'filesystem' },
        { src: '/(.*)', dest: '/__fallback' },
      ],
    }, null, 2)}\n`)
    // ensureStatic404 needs the static dir
    const { mkdir } = await import('node:fs/promises')
    await mkdir(staticDir, { recursive: true })

    await patchVercelBuildConfig({
      options: { preset: 'vercel', output: { dir } },
    })

    const config = JSON.parse(await readFile(join(dir, 'config.json'), 'utf8'))
    expect('trailingSlash' in config).toBe(false)
    const stripIdx = findTrailingSlashStripIndex(config.routes)
    expect(stripIdx).toBeGreaterThanOrEqual(0)
    expect(config.routes[stripIdx].status).toBe(301)

    const talksIdx = config.routes.findIndex(r => r.src === '/talks/')
    expect(talksIdx).toBeLessThan(stripIdx)

    const md = config.routes.find(r => r.src === '^/blog/([\\w-]+)$' && r.dest === '/__fallback')
    expect(md).toBeTruthy()
    // Must not match /blog/<slug>.md (static file path).
    expect(new RegExp(md.src).test('/blog/webmcp-on-my-site')).toBe(true)
    expect(new RegExp(md.src).test('/blog/webmcp-on-my-site.md')).toBe(false)

    const static404 = config.routes.find(r => r.dest === '/404.html' && r.status === 404)
    expect(static404).toBeTruthy()
    expect(config.routes.some(r => r.src === '/(.*)' && r.dest === '/__fallback')).toBe(false)

    const check = assertAliasRedirectsBeforeSlashStrip(config.routes)
    expect(check.ok).toBe(true)
  })

  it('synthesizes a themed SPA 404 from index.html when Nitro omitted one', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'vercel-404-'))
    const staticDir = join(dir, 'static')
    const { mkdir } = await import('node:fs/promises')
    await mkdir(staticDir, { recursive: true })

    const donor = `<!DOCTYPE html><html><head><meta charset="utf-8">`
      + `<meta name="robots" content="index, follow">`
      + `<title>Home</title>`
      + `<style>.hamburger li{width:35px}.mobile-menu{display:block}</style>`
      + `<link rel="stylesheet" href="/_nuxt/entry.ABC.css">`
      + `${'<!-- pad -->'.repeat(200)}</head>`
      + `<body><div id="__nuxt"><h1>Home SSR</h1></div>`
      + `<script type="application/json" data-ssr="true" id="__NUXT_DATA__">`
      + `[{"serverRendered":1},true]</script></body></html>`
    await writeFile(join(staticDir, 'index.html'), donor)
    await writeFile(join(dir, 'config.json'), `${JSON.stringify({
      version: 3,
      routes: [{ handle: 'filesystem' }, { src: '/(.*)', dest: '/__fallback' }],
    }, null, 2)}\n`)

    await patchVercelBuildConfig({
      options: { preset: 'vercel', output: { dir } },
    })

    const html = await readFile(join(staticDir, '404.html'), 'utf8')
    expect(isThemed404Html(html)).toBe(true)
    expect(html).toMatch(/noindex/)
    expect(html).toMatch(/hamburger/)
    expect(html).toMatch(/id="__nuxt"><\/div>/)
    expect(html).not.toMatch(/Home SSR/)
  })
})

describe('spa404FromDonorHtml / isThemed404Html', () => {
  it('rejects the minimal stub', () => {
    const stub = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
      + '<meta name="robots" content="noindex, nofollow">'
      + '<title>Page not found · Debbie Codes</title></head>'
      + '<body><h1>Page not found</h1></body></html>\n'
    expect(isThemed404Html(stub)).toBe(false)
  })

  it('marks a synthesized donor shell as themed', () => {
    const donor = `<!DOCTYPE html><html><head>`
      + `<meta name="robots" content="index, follow"><title>X</title>`
      + `<style>.hamburger{}</style><link href="/_nuxt/entry.css">`
      + `${'x'.repeat(2500)}</head>`
      + `<body><div id="__nuxt">body</div></body></html>`
    const html = spa404FromDonorHtml(donor)
    expect(isThemed404Html(html)).toBe(true)
    expect(html).toMatch(/noindex, nofollow/)
    expect(html).not.toMatch(/<title/)
  })
})

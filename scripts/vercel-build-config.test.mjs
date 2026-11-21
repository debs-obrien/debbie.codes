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
  patchVercelBuildConfig,
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

    const md = config.routes.find(r => r.src === '^/blog/([^/]+)$' && r.dest === '/__fallback')
    expect(md).toBeTruthy()

    const static404 = config.routes.find(r => r.dest === '/404.html' && r.status === 404)
    expect(static404).toBeTruthy()
    expect(config.routes.some(r => r.src === '/(.*)' && r.dest === '/__fallback')).toBe(false)

    const check = assertAliasRedirectsBeforeSlashStrip(config.routes)
    expect(check.ok).toBe(true)
  })
})

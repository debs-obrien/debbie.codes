#!/usr/bin/env node
/**
 * Unit checks for Vercel Build Output trailing-slash route order.
 * Run: node --test scripts/vercel-build-config.test.mjs
 */
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
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
    assert.equal(result.ok, true, result.issues.join('; '))
    assert.equal(findTrailingSlashStripIndex(routes), 3)
  })

  it('fails when slash strip precedes /talks/', () => {
    const routes = [
      { ...VERCEL_TRAILING_SLASH_STRIP },
      { src: '/talks/', status: 301, headers: { Location: '/speaking' } },
      { src: '/resources/', status: 301, headers: { Location: '/' } },
    ]
    const result = assertAliasRedirectsBeforeSlashStrip(routes)
    assert.equal(result.ok, false)
    assert.ok(result.issues.some(i => i.includes('/talks/')))
  })
})

describe('patchVercelBuildConfig', () => {
  it('inserts 301 slash strip after alias redirects and deletes trailingSlash key', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'vercel-cfg-'))
    const configPath = join(dir, 'config.json')
    await writeFile(configPath, `${JSON.stringify({
      version: 3,
      trailingSlash: false,
      routes: [
        { src: '/talks/', status: 301, headers: { Location: '/speaking' } },
        { src: '/resources/', status: 301, headers: { Location: '/' } },
        { src: '/talks', status: 301, headers: { Location: '/speaking' } },
        { src: '/blog.html', headers: { 'X-Frame-Options': 'DENY' } },
        { handle: 'filesystem' },
      ],
    }, null, 2)}\n`)

    await patchVercelBuildConfig({
      options: { preset: 'vercel', output: { dir } },
    })

    const config = JSON.parse(await readFile(configPath, 'utf8'))
    assert.equal('trailingSlash' in config, false)
    const stripIdx = findTrailingSlashStripIndex(config.routes)
    assert.ok(stripIdx >= 0, 'strip route inserted')
    assert.equal(config.routes[stripIdx].status, 301)
    assert.equal(config.routes[stripIdx].headers.Location, '/$1')

    const talksIdx = config.routes.findIndex(r => r.src === '/talks/')
    const resourcesIdx = config.routes.findIndex(r => r.src === '/resources/')
    assert.ok(talksIdx < stripIdx, `/talks/ (${talksIdx}) before strip (${stripIdx})`)
    assert.ok(resourcesIdx < stripIdx, `/resources/ (${resourcesIdx}) before strip (${stripIdx})`)

    const header = config.routes.find(r => r.src === '/blog.html')
    assert.equal(header.continue, true)

    const check = assertAliasRedirectsBeforeSlashStrip(config.routes)
    assert.equal(check.ok, true, check.issues.join('; '))
  })
})

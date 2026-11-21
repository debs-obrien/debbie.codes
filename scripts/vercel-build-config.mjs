/**
 * Patch Nitro's `.vercel/output/config.json` after the vercel preset writes it.
 *
 * Why this exists:
 * - Top-level `trailingSlash` in Build Output config is ignored. Docs say use
 *   real routes (see https://vercel.com/docs/build-output-api/features).
 * - Do NOT set `trailingSlash` in vercel.json — the platform turns that into
 *   early 308 strip routes that run before our alias redirects, so `/talks/`
 *   becomes 308→`/talks` then 301→`/speaking` (two hops). Netlify is one 301.
 * - Insert official `^/(.*)/$` → `/$1` **301** after the last status redirect
 *   (so `/talks/` → `/speaking` and `/resources/` → `/` still win) and before
 *   remaining routes / filesystem.
 * - Header-only routes need `continue: true` (vercel.json headers always set it).
 * - Accept: text/markdown on `/blog/<slug>` rewrites to the prerendered `.md`
 *   copy (Netlify edge function parity).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/** Official convertTrailingSlash(false) pattern; 301 to match Netlify. */
export const VERCEL_TRAILING_SLASH_STRIP = {
  src: '^/(.*)/$',
  status: 301,
  headers: { Location: '/$1' },
}

/** Netlify edge `header.accept: text/markdown` + rewrite to `.md`. */
export const VERCEL_BLOG_MARKDOWN_ACCEPT = {
  src: '^/blog/([^/]+)$',
  has: [
    {
      type: 'header',
      key: 'accept',
      // PCRE on Vercel; avoid (?i) so local JS simulators can compile it too.
      value: '.*[Tt]ext/[Mm]arkdown.*',
    },
  ],
  dest: '/blog/$1.md',
  check: true,
  headers: {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Vary': 'Accept',
    'X-Robots-Tag': 'noindex',
    'Cache-Control': 'public, max-age=3600',
  },
}

/**
 * Index of the trailing-slash strip route, or -1.
 * @param {Array<Record<string, unknown>>} routes
 */
export function findTrailingSlashStripIndex(routes) {
  return routes.findIndex(
    r => r && r.src === VERCEL_TRAILING_SLASH_STRIP.src && r.status === 301,
  )
}

/**
 * Assert alias redirects that end in `/` appear before the generic slash strip,
 * so `/talks/` and `/resources/` land on their final targets in one 301 hop.
 * @param {Array<Record<string, unknown>>} routes
 * @returns {{ ok: boolean, issues: string[] }}
 */
export function assertAliasRedirectsBeforeSlashStrip(routes) {
  /** @type {string[]} */
  const issues = []
  const stripIdx = findTrailingSlashStripIndex(routes)
  if (stripIdx === -1) {
    issues.push('missing trailing-slash strip route ^/(.*)/$ 301')
    return { ok: false, issues }
  }

  const required = [
    { src: '/talks/', location: '/speaking' },
    { src: '/resources/', location: '/' },
  ]
  for (const { src, location } of required) {
    const idx = routes.findIndex(r => r && r.src === src && r.status === 301)
    if (idx === -1) {
      issues.push(`missing alias redirect ${src} → ${location}`)
      continue
    }
    const loc = rLocation(routes[idx])
    if (loc !== location)
      issues.push(`${src} Location is ${loc || '(none)'}, want ${location}`)
    if (idx > stripIdx)
      issues.push(`${src} redirect at index ${idx} is after slash strip at ${stripIdx}`)
  }

  // No platform-style 308 trailing-slash strip should remain.
  const has308Strip = routes.some(
    r => r && r.status === 308 && typeof r.src === 'string' && /\/\.\*\)?\/\$|\/\$/.test(r.src),
  )
  if (has308Strip)
    issues.push('found status 308 trailing-slash style route (remove vercel.json trailingSlash)')

  return { ok: issues.length === 0, issues }
}

function rLocation(route) {
  const h = route?.headers
  if (!h || typeof h !== 'object')
    return ''
  return h.Location || h.location || ''
}

/**
 * @param {import('nitropack').Nitro} nitro
 */
export async function patchVercelBuildConfig(nitro) {
  const preset = String(nitro.options.preset || '')
  if (!preset.startsWith('vercel'))
    return

  const configPath = resolve(nitro.options.output.dir, 'config.json')
  const config = JSON.parse(await readFile(configPath, 'utf8'))
  if (!Array.isArray(config.routes))
    config.routes = []

  // Never leave a dead trailingSlash key; vercel.json must not set it either.
  delete config.trailingSlash

  // Match vercel.json convertHeaders: header-only routes must continue.
  for (const route of config.routes) {
    if (!route || route.handle)
      continue
    const headerOnly = route.headers
      && route.status == null
      && route.dest == null
      && !route.middlewarePath
    if (headerOnly)
      route.continue = true
  }

  const fsIdx = config.routes.findIndex(r => r && r.handle === 'filesystem')
  const beforeFs = fsIdx === -1 ? config.routes.length : fsIdx

  // After the last redirect/status route in the pre-filesystem section so
  // `/talks/` and `/resources/` (and every other alias) stay ahead of the strip.
  let insertAt = 0
  for (let i = 0; i < beforeFs; i++) {
    if (config.routes[i]?.status != null)
      insertAt = i + 1
  }

  const hasStrip = findTrailingSlashStripIndex(config.routes) !== -1
  if (!hasStrip)
    config.routes.splice(insertAt, 0, { ...VERCEL_TRAILING_SLASH_STRIP })

  const hasMd = config.routes.some(
    r => r && r.src === VERCEL_BLOG_MARKDOWN_ACCEPT.src && r.dest === '/blog/$1.md',
  )
  if (!hasMd) {
    // Prefer markdown Accept rewrite before trailing-slash strip and filesystem.
    const stripIdx = findTrailingSlashStripIndex(config.routes)
    const mdAt = stripIdx === -1 ? insertAt : stripIdx
    config.routes.splice(mdAt, 0, { ...VERCEL_BLOG_MARKDOWN_ACCEPT })
  }

  const check = assertAliasRedirectsBeforeSlashStrip(config.routes)
  if (!check.ok) {
    console.warn(
      `[vercel-build-config] trailing-slash route order issues:\n${check.issues.map(i => `  - ${i}`).join('\n')}`,
    )
  }

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`)
}

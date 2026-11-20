/**
 * Patch Nitro's `.vercel/output/config.json` after the vercel preset writes it.
 *
 * Why this exists:
 * - Top-level `trailingSlash` in Build Output config is ignored. Docs say use
 *   `getTransformedRoutes({ trailingSlash: false })`, which emits real routes
 *   (see https://vercel.com/docs/build-output-api/features).
 * - Earlier inject placed the strip route just before `filesystem`, after
 *   Nitro header routes that lack `continue: true`. On the real platform those
 *   headers terminate the none-phase match, so the strip never ran (preview
 *   still 200). vercel.json `headers` always set `continue: true`; we mirror that.
 * - Insert the official strip pattern after the last status redirect (so
 *   `/resources/` → `/` still wins) and before remaining routes / filesystem.
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

  // After the last redirect/status route in the pre-filesystem section.
  let insertAt = 0
  for (let i = 0; i < beforeFs; i++) {
    if (config.routes[i]?.status != null)
      insertAt = i + 1
  }

  const hasStrip = config.routes.some(
    r => r && r.src === VERCEL_TRAILING_SLASH_STRIP.src && r.status === 301,
  )
  if (!hasStrip)
    config.routes.splice(insertAt, 0, { ...VERCEL_TRAILING_SLASH_STRIP })

  const hasMd = config.routes.some(
    r => r && r.src === VERCEL_BLOG_MARKDOWN_ACCEPT.src && r.dest === '/blog/$1.md',
  )
  if (!hasMd) {
    // Prefer markdown Accept rewrite before trailing-slash strip and filesystem.
    const stripIdx = config.routes.findIndex(
      r => r && r.src === VERCEL_TRAILING_SLASH_STRIP.src && r.status === 301,
    )
    const mdAt = stripIdx === -1 ? insertAt : stripIdx
    config.routes.splice(mdAt, 0, { ...VERCEL_BLOG_MARKDOWN_ACCEPT })
  }

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`)
}

/**
 * Nitro writes `trailingSlash: false` into `.vercel/output/config.json`, but the
 * Build Output API does not honor that top-level key. Without an explicit route
 * before `handle: filesystem`, prerendered clean URLs (`blog.html` + overrides)
 * still answer `/blog/` (and friends) with 200 instead of 301 → `/blog`.
 *
 * Insert `{ src: '^/(.+)/$', status: 301, Location: '/$1' }` immediately before
 * filesystem so specific `_redirects` rules (e.g. `/resources/` → `/`) still win.
 * Paths that are real files never end in `/`, so they are excluded naturally.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/** @type {{ src: string, status: number, headers: { Location: string } }} */
export const VERCEL_TRAILING_SLASH_STRIP = {
  src: '^/(.+)/$',
  status: 301,
  headers: { Location: '/$1' },
}

/**
 * @param {import('nitropack').Nitro} nitro
 */
export async function injectVercelTrailingSlashStrip(nitro) {
  const preset = String(nitro.options.preset || '')
  if (!preset.startsWith('vercel'))
    return

  const configPath = resolve(nitro.options.output.dir, 'config.json')
  const config = JSON.parse(await readFile(configPath, 'utf8'))
  if (!Array.isArray(config.routes))
    config.routes = []

  // Drop the inert key Nitro/defu may have copied from vercel.config.
  delete config.trailingSlash

  const already = config.routes.some(
    r => r && r.src === VERCEL_TRAILING_SLASH_STRIP.src && r.status === 301,
  )
  if (!already) {
    const fsIdx = config.routes.findIndex(r => r && r.handle === 'filesystem')
    if (fsIdx === -1)
      config.routes.push({ ...VERCEL_TRAILING_SLASH_STRIP })
    else
      config.routes.splice(fsIdx, 0, { ...VERCEL_TRAILING_SLASH_STRIP })
  }

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`)
}

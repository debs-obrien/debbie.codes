#!/usr/bin/env node
/**
 * Fail if app code still references Cloudinary delivery on the Netlify path.
 * Vercel dual-deploy files are allowlisted (Cloudinary is intentional there).
 * Usage: node scripts/check-no-cloudinary.mjs
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const roots = ['components', 'pages', 'utils', 'server', 'composables', 'plugins', 'providers']
const files = ['nuxt.config.ts', 'netlify.toml', 'content.config.ts', 'app.vue']

/** Dual-deploy / map files may mention Cloudinary for Vercel-only delivery. */
const ALLOW = new Set([
  'utils/cloudinary-assets.ts',
  'utils/cloudinary-public-ids.json',
  'utils/og-image.ts',
  'utils/og-image-cloudinary-delivery.ts',
  'utils/og-image-netlify-delivery.ts',
  'providers/cloudinary-site.ts',
  'nuxt.config.ts',
  'scripts/generate-cloudinary-map.mjs',
  'scripts/verify-cloudinary-assets.mjs',
  'scripts/prove-hosting-parity.mjs',
])

function walk(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    )
  }
  catch {
    return []
  }
}

const errors = []
const scan = [
  ...roots.flatMap(d => walk(join(root, d))),
  ...files.map(f => join(root, f)),
].filter(f => /\.(?:vue|ts|js|mjs|toml)$/.test(f))

for (const file of scan) {
  const rel = relative(root, file)
  if (ALLOW.has(rel) || rel.startsWith('scripts/cloudinary/'))
    continue
  const text = readFileSync(file, 'utf8')
  if (/res\.cloudinary\.com/i.test(text))
    errors.push(`${rel}: res.cloudinary.com`)
  if (/provider\s*[:=]\s*['"]cloudinary['"]/i.test(text))
    errors.push(`${rel}: provider cloudinary`)
  if (/image:\s*\{[^}]*cloudinary\s*:/.test(text) || /cloudinary:\s*\{[^}]*baseURL/.test(text))
    errors.push(`${rel}: image.cloudinary config`)
}

if (errors.length) {
  console.error(`Cloudinary check failed:\n${errors.map(e => `  - ${e}`).join('\n')}`)
  process.exit(1)
}
console.log(`No unexpected Cloudinary refs in app code (${scan.length} files scanned).`)

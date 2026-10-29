#!/usr/bin/env node
/**
 * Fail if components/pages/utils/config still reference Cloudinary delivery.
 * Usage: node scripts/check-no-cloudinary.mjs
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const roots = ['components', 'pages', 'utils']
const files = ['nuxt.config.ts', 'netlify.toml', 'content.config.ts']

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
  const text = readFileSync(file, 'utf8')
  const rel = relative(root, file)
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
console.log(`No Cloudinary refs in app code (${scan.length} files).`)

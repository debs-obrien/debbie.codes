#!/usr/bin/env node
/**
 * Fail CI when migrated media under public/images/content/ grows past the
 * post-optimization budgets (measured totals + ~10% headroom).
 */
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const contentRoot = join(root, 'public/images/content')

/** After optimize pass: content images ~21.37 MB → budget 23.5 MB */
const IMAGE_BUDGET = Math.round(23.5 * 1024 * 1024)
/** After optimize pass: media ~21.97 MB → budget 24.2 MB */
const MEDIA_BUDGET = Math.round(24.2 * 1024 * 1024)

const IMAGE_EXT = new Set(['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif'])
const MEDIA_EXT = new Set(['.mp4', '.mp3', '.webm', '.ogg'])

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

const files = walk(contentRoot)
let imageBytes = 0
let mediaBytes = 0
for (const file of files) {
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
  const size = statSync(file).size
  if (IMAGE_EXT.has(ext))
    imageBytes += size
  else if (MEDIA_EXT.has(ext))
    mediaBytes += size
}

const imageMB = +(imageBytes / 1024 / 1024).toFixed(2)
const mediaMB = +(mediaBytes / 1024 / 1024).toFixed(2)
console.log(`Content images: ${imageMB} MB (budget ${(IMAGE_BUDGET / 1024 / 1024).toFixed(1)})`)
console.log(`Content media:  ${mediaMB} MB (budget ${(MEDIA_BUDGET / 1024 / 1024).toFixed(1)})`)

if (imageBytes > IMAGE_BUDGET || mediaBytes > MEDIA_BUDGET) {
  console.error('Image/media budget exceeded under public/images/content/')
  process.exit(2)
}

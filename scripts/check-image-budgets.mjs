#!/usr/bin/env node
/**
 * Fail CI when images under public/images/** (+ site OG JPEGs) or media under
 * public/images/content/ grow past post-optimization budgets (~measured + 10%).
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const imagesRoot = join(root, 'public/images')
const contentRoot = join(root, 'public/images/content')

/** All public/images/** image files + OG JPEGs ~23.52 MB → budget 26 MB */
const IMAGE_BUDGET = Math.round(26 * 1024 * 1024)
/** Content-tree media ~21.97 MB → budget 24.2 MB */
const MEDIA_BUDGET = Math.round(24.2 * 1024 * 1024)

const IMAGE_EXT = new Set(['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif'])
const MEDIA_EXT = new Set(['.mp4', '.mp3', '.webm', '.ogg'])

const OG_JPEG_PATHS = [
  join(root, 'public/x-card.jpg'),
  join(root, 'public/twitter-card.jpg'),
  join(root, 'public/x-card-blog.jpg'),
]

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

let imageBytes = 0
let mediaBytes = 0
for (const file of walk(imagesRoot)) {
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
  const size = statSync(file).size
  if (IMAGE_EXT.has(ext))
    imageBytes += size
  else if (MEDIA_EXT.has(ext) && file.startsWith(contentRoot))
    mediaBytes += size
}
for (const file of OG_JPEG_PATHS) {
  if (existsSync(file))
    imageBytes += statSync(file).size
}

const imageMB = +(imageBytes / 1024 / 1024).toFixed(2)
const mediaMB = +(mediaBytes / 1024 / 1024).toFixed(2)
console.log(`Images (public/images/** + OG JPEGs): ${imageMB} MB (budget ${(IMAGE_BUDGET / 1024 / 1024).toFixed(1)})`)
console.log(`Content media:  ${mediaMB} MB (budget ${(MEDIA_BUDGET / 1024 / 1024).toFixed(1)})`)

if (imageBytes > IMAGE_BUDGET || mediaBytes > MEDIA_BUDGET) {
  console.error('Image/media budget exceeded')
  process.exit(2)
}

#!/usr/bin/env node
/**
 * Build utils/cloudinary-public-ids.json: local /images path → Cloudinary publicId.
 * Source: scripts/cloudinary/manifest.json from the #688 migration, plus #687 aliases.
 *
 * Usage: node scripts/generate-cloudinary-map.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(
  readFileSync(join(root, 'scripts/cloudinary/manifest.json'), 'utf8'),
)

/** @type {Record<string, string>} */
const images = {}
/** @type {Record<string, string>} */
const videos = {}

for (const entry of manifest.entries || []) {
  const localPath = entry.localPath
  const publicId = entry.publicId
  if (!localPath || !publicId)
    continue
  if (entry.deliveryType === 'fetch' || String(publicId).startsWith('fetch:'))
    continue
  if (entry.resourceType === 'video') {
    videos[localPath] = publicId
    if (entry.posterPath && images[entry.posterPath] == null) {
      // Posters are local derivatives; keep for missing-list later, no publicId.
    }
    continue
  }
  if (entry.resourceType && entry.resourceType !== 'image')
    continue
  images[localPath] = publicId
}

// #687 hard-coded moves (not always present as those localPaths in the manifest).
const aliases = {
  '/images/debbie-thumb.webp': 'debbie.codes/debbie-thumb_clt00n',
  '/images/broken-connection.webp': 'debbie.codes/broken_vktobk',
  '/images/podcasts/alexusadays-future-of-testing.webp':
    'debbie.codes/podcasts/alexusadays-future-of-testing',
}
for (const [path, id] of Object.entries(aliases)) {
  if (!images[path])
    images[path] = id
}

const out = {
  generatedAt: new Date().toISOString(),
  cloudName: 'debsobrien',
  imageCount: Object.keys(images).length,
  videoCount: Object.keys(videos).length,
  images,
  videos,
}

const dest = join(root, 'utils/cloudinary-public-ids.json')
writeFileSync(dest, `${JSON.stringify(out, null, 2)}\n`)
console.log(`Wrote ${dest} (${out.imageCount} images, ${out.videoCount} videos)`)
process.exit(0)

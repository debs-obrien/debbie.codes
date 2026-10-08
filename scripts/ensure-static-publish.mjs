/**
 * Ensure Netlify's publish dir (`dist`) always contains critical static
 * files from public/, even when prerender hits IPX crawl errors.
 */
import { copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const outputPublic = join(root, '.output/public')
const publicDir = join(root, 'public')

function samePath(a, b) {
  if (!existsSync(a) || !existsSync(b))
    return false
  try {
    return realpathSync(a) === realpathSync(b)
  }
  catch {
    return false
  }
}

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true })
}

// Nuxt 4.6+ may leave `dist` as a symlink to `.output/public`. Node's
// cpSync refuses to overwrite a symlink with a directory, so always copy
// into the resolved directory path when dist is a link.
const distStat = lstatSync(dist)
const distTarget = distStat.isSymbolicLink() ? realpathSync(dist) : dist

// Populate dist from Nitro output when dist is a separate directory.
if (existsSync(outputPublic) && !samePath(outputPublic, distTarget)) {
  cpSync(outputPublic, distTarget, { recursive: true })
}

// Always overlay committed public assets (sitemap.xml, _redirects, icons, …).
if (!samePath(publicDir, distTarget)) {
  cpSync(publicDir, distTarget, { recursive: true })
}

for (const required of ['sitemap.xml', '_redirects']) {
  const from = join(publicDir, required)
  const to = join(distTarget, required)
  if (!existsSync(from)) {
    console.error(`Missing required public/${required}`)
    process.exit(1)
  }
  copyFileSync(from, to)
  if (!existsSync(to)) {
    console.error(`Failed to publish ${required} to dist/`)
    process.exit(1)
  }
}

console.log(
  `Ensured dist/sitemap.xml and dist/_redirects for Netlify publish`
  + (distStat.isSymbolicLink() ? ' (dist is symlink to build output)' : ''),
)

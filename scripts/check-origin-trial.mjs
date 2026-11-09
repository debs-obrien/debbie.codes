/**
 * Assert production generate emits both WebMCP origin-trial meta tags.
 *
 * Runs outside Playwright so it never rebuilds the shared `.nuxt` while
 * `nuxt dev` is serving other tests. Uses in-repo isolated build/output
 * dirs (not /tmp) so Tailwind/jiti can still resolve workspace packages.
 *
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-origin-trial.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { DEFAULT_WEBMCP_OT_CHROME, DEFAULT_WEBMCP_OT_EDGE } from '../utils/origin-trial.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// Keep dirs under the project root — module resolution from /tmp breaks
// @nuxtjs/tailwindcss (postcss.mjs cannot find config-ctx).
const buildDir = join(root, '.nuxt-origin-trial')
const outputDir = join(root, '.output-origin-trial')

rmSync(buildDir, { recursive: true, force: true })
rmSync(outputDir, { recursive: true, force: true })
mkdirSync(buildDir, { recursive: true })
mkdirSync(outputDir, { recursive: true })

try {
  execFileSync('npx', ['nuxt', 'generate'], {
    cwd: root,
    env: {
      ...process.env,
      CONTEXT: 'production',
      NUXT_OT_BUILD_DIR: buildDir,
      NUXT_OT_OUTPUT_DIR: outputDir,
    },
    stdio: 'inherit',
  })

  const candidates = [
    join(outputDir, 'public', 'index.html'),
    join(outputDir, 'index.html'),
  ]
  const htmlPath = candidates.find(path => existsSync(path))
  if (!htmlPath)
    throw new Error(`expected generated index.html under ${outputDir}`)

  const html = readFileSync(htmlPath, 'utf8')
  const metas = html.match(/http-equiv="origin-trial"/g) ?? []
  if (metas.length < 2)
    throw new Error(`expected 2 origin-trial meta tags, found ${metas.length} in ${htmlPath}`)
  if (!html.includes(DEFAULT_WEBMCP_OT_CHROME))
    throw new Error('Chrome origin-trial token missing from generated home HTML')
  if (!html.includes(DEFAULT_WEBMCP_OT_EDGE))
    throw new Error('Edge origin-trial token missing from generated home HTML')

  console.log(`ok: ${metas.length} origin-trial meta tags in ${htmlPath}`)
}
finally {
  rmSync(buildDir, { recursive: true, force: true })
  rmSync(outputDir, { recursive: true, force: true })
}

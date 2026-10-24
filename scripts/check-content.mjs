/**
 * Content guardrails, run in CI (.github/workflows/content-check.yml):
 *   node scripts/check-content.mjs
 *
 * Fails when:
 *  1. any file under content/ mentions a banned YouTube ID (HIDDEN_YOUTUBE_VIDEO_IDS)
 *  2. a blog post uses `::youtube` (there is no Youtube component; it renders nothing)
 *  3. a blog post embeds a `<lite-youtube videoid="…">` that has no entry in content/videos
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { HIDDEN_YOUTUBE_VIDEO_IDS } from '../utils/videos.ts'

const root = process.argv[2] ?? fileURLToPath(new URL('..', import.meta.url))
const contentDir = join(root, 'content')

// TODO(follow-up): convert these posts to <lite-youtube videoid="…"> and
// remove them here. Their videos don't show on the live site today.
const YOUTUBE_MDC_ALLOWLIST = new Set([
  'content/blog/job-hunt-with-a-bot.md',
  'content/blog/how-i-vibe-code-improving-my-site-design-with-goose-and-gemini-3.md',
  'content/blog/grok-bot-does-my-shopping.md',
])

// Third-party videos embedded in older posts; not Debbie's, so not in content/videos.
const EXTERNAL_VIDEO_IDS = new Set(['_EFk7nWoKw0', 'KyxXpweFck4'])

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  )
}

const errors = []
const files = walk(contentDir)

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const id of HIDDEN_YOUTUBE_VIDEO_IDS) {
    if (text.includes(id))
      errors.push(`${relative(root, file)}: banned YouTube ID ${id}`)
  }
}

const knownVideoIds = new Set(
  files
    .filter(file => file.startsWith(join(contentDir, 'videos')))
    .map(file => readFileSync(file, 'utf8').match(/^video:\s*["']?([\w-]+)/m)?.[1])
    .filter(Boolean),
)

for (const file of files.filter(f => f.startsWith(join(contentDir, 'blog')) && f.endsWith('.md'))) {
  const rel = relative(root, file)
  const lines = readFileSync(file, 'utf8').split('\n')
  // CommonMark fences: close only on the same character, at least as long, with nothing after it.
  let fence = null
  lines.forEach((line, i) => {
    // Fences can sit inside blockquotes (`> ```md`).
    const marker = line.match(/^(?:\s*>)*\s*(`{3,}|~{3,})/)
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !line.slice(marker[0].length).trim())
        fence = null
      return
    }
    if (marker) {
      fence = marker[1]
      return
    }
    if (/^\s*::youtube\b/.test(line) && !YOUTUBE_MDC_ALLOWLIST.has(rel))
      errors.push(`${rel}:${i + 1}: ::youtube does not render. Use <lite-youtube videoid="…"></lite-youtube> instead`)
    // Only real <lite-youtube> tags count; prose and inline code (`…`) are examples.
    const live = line.replace(/`[^`]*`/g, '')
    for (const [, , id] of live.matchAll(/<lite-youtube\s[^>]*\bvideoid\s*=\s*(["'])([^"']+)\1/g)) {
      if (!knownVideoIds.has(id) && !EXTERNAL_VIDEO_IDS.has(id))
        errors.push(`${rel}:${i + 1}: videoid "${id}" has no entry in content/videos (wrong or stale ID?)`)
    }
  })
}

if (errors.length) {
  console.error(`Content check failed:\n${errors.map(e => `  - ${e}`).join('\n')}`)
  process.exit(1)
}
console.log(`Content check passed (${files.length} files, ${knownVideoIds.size} videos).`)

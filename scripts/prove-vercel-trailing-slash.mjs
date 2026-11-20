/**
 * Prove Vercel Build Output routes strip trailing slashes before filesystem.
 * Header-only routes (no status/dest) are treated as continue — matching
 * Vercel’s practical behavior for Nitro routeRules headers (and vercel.json
 * headers, which set continue: true explicitly via convertHeaders).
 *
 * Usage: node scripts/prove-vercel-trailing-slash.mjs [.vercel/output/config.json]
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const configPath = resolve(process.argv[2] || '.vercel/output/config.json')
const config = JSON.parse(readFileSync(configPath, 'utf8'))
const routes = config.routes || []

const fsIdx = routes.findIndex(r => r && r.handle === 'filesystem')
const stripIdx = routes.findIndex(
  r => r && r.src === '^/(.+)/$' && r.status === 301
    && r.headers?.Location === '/$1',
)

/** @param {string} pattern @param {string} path */
function srcMatches(pattern, path) {
  try {
    return new RegExp(pattern).test(path)
  }
  catch {
    return false
  }
}

function firstTerminalMatch(path) {
  for (let i = 0; i < routes.length; i++) {
    const r = routes[i]
    if (!r)
      continue
    if (r.handle === 'filesystem')
      return { i, kind: 'filesystem' }
    if (!r.src || !srcMatches(r.src, path))
      continue
    const headerOnly = r.headers && r.status == null && r.dest == null && !r.middlewarePath
    if (r.continue || headerOnly)
      continue
    return { i, kind: 'route', route: r }
  }
  return { i: -1, kind: 'none' }
}

const checks = [
  ['/blog/', '/blog'],
  ['/videos/', '/videos'],
  ['/hire-me/', '/hire-me'],
  ['/courses/', '/courses'],
  ['/resources/', '/'], // specific redirect must win
  ['/talks/', '/speaking'],
  ['/blog.html', null],
  ['/robots.txt', null],
  ['/', null],
]

let failed = 0
console.log(`config: ${configPath}`)
console.log(`trailingSlash key present: ${'trailingSlash' in config}`)
console.log(`filesystem index: ${fsIdx}`)
console.log(`strip ^/(.+)/$ index: ${stripIdx}`)
if (stripIdx === -1 || fsIdx === -1 || stripIdx >= fsIdx) {
  console.error('FAIL: strip route must appear before handle:filesystem')
  failed++
}
else {
  console.log('OK: strip route is before filesystem')
}

for (const [path, expectLocation] of checks) {
  const hit = firstTerminalMatch(path)
  if (expectLocation == null) {
    if (hit.kind === 'route' && hit.route?.headers?.Location) {
      console.error(`FAIL: ${path} unexpectedly redirected → ${hit.route.headers.Location}`)
      failed++
    }
    else {
      console.log(`OK: ${path} → ${hit.kind} (no trailing-slash redirect)`)
    }
    continue
  }
  const locTemplate = hit.route?.headers?.Location
  let loc = locTemplate
  if (typeof locTemplate === 'string' && hit.route?.src && locTemplate.includes('$')) {
    const m = path.match(new RegExp(hit.route.src))
    if (m) {
      loc = locTemplate.replace(/\$(\d+)/g, (_, n) => m[Number(n)] ?? '')
    }
  }
  if (hit.kind !== 'route' || hit.route?.status !== 301 || loc !== expectLocation) {
    console.error(`FAIL: ${path} → ${JSON.stringify(hit)} resolved=${loc} (want 301 ${expectLocation})`)
    failed++
  }
  else {
    console.log(`OK: ${path} → 301 ${loc} (route #${hit.i}, template ${locTemplate})`)
  }
}

if (failed) {
  console.error(`\n${failed} check(s) failed`)
  process.exit(1)
}
console.log('\nAll route-order checks passed')

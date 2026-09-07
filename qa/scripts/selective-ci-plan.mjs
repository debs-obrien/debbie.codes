#!/usr/bin/env node
/**
 * Selective CI path→group planner (Phase 1 dry-run + Phase 2 enforce).
 *
 * Resolves which Playwright files / @smoke set would run for changed paths.
 *
 * Usage:
 *   node qa/scripts/selective-ci-plan.mjs --base origin/main
 *   node qa/scripts/selective-ci-plan.mjs --base main
 *   node qa/scripts/selective-ci-plan.mjs --files content/blog/foo.md,pages/blog/index.vue
 *   node qa/scripts/selective-ci-plan.mjs --base origin/main --summary
 *   node qa/scripts/selective-ci-plan.mjs --base origin/main --summary --enforce
 *
 * Exit 0 always on successful planning (even when mode=full). Non-zero only on
 * script/IO errors so CI never fails the suite because of the planner itself.
 *
 * --enforce writes machine-readable outputs for CI:
 *   SELECTIVE_CI_MODE, SELECTIVE_CI_TEST_FILES, SELECTIVE_CI_SHARD_TOTAL,
 *   and (when $GITHUB_OUTPUT is set) mode / test_files / shard_total / shards.
 */

import { execFileSync } from 'node:child_process'
import { appendFileSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const MAP_PATH = join(REPO_ROOT, 'qa/selective-ci/path-group-map.json')
const TESTS_DIR = join(REPO_ROOT, 'tests')

/** Full suite keeps 4 shards; selective PRs use 1 (small file sets). */
const FULL_SHARD_TOTAL = 4
const SELECTIVE_SHARD_TOTAL = 1

function parseArgs(argv) {
  const out = { base: null, files: null, summary: false, enforce: false, help: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') out.help = true
    else if (a === '--summary') out.summary = true
    else if (a === '--enforce') out.enforce = true
    else if (a === '--base') out.base = argv[++i]
    else if (a.startsWith('--base=')) out.base = a.slice('--base='.length)
    else if (a === '--files') out.files = argv[++i]
    else if (a.startsWith('--files=')) out.files = a.slice('--files='.length)
    else throw new Error(`Unknown argument: ${a}`)
  }
  return out
}

function printHelp() {
  console.log(`Selective CI plan (Phase 1 dry-run / Phase 2 enforce)

Usage:
  node qa/scripts/selective-ci-plan.mjs --base <ref>
  node qa/scripts/selective-ci-plan.mjs --files <path,path,...>
  node qa/scripts/selective-ci-plan.mjs --base <ref> --summary
  node qa/scripts/selective-ci-plan.mjs --base <ref> --summary --enforce

Options:
  --base <ref>   Git ref to diff against (e.g. origin/main, main, or a SHA)
  --files <list> Comma-separated paths (skip git; for local examples)
  --summary      Also append markdown to $GITHUB_STEP_SUMMARY when set
  --enforce      Write machine-readable outputs for CI (GITHUB_OUTPUT + env lines).
                 Without --enforce, behavior stays Phase 1 report-only.
  -h, --help     Show this help

Fail closed → mode=full for unknown paths and shared/fullSuitePathGlobs.
Selective mode always unions mapped group test files with @smoke-bearing specs.
`)
}

/** Minimal glob: * (one segment), ** (any depth), trailing /** optional */
function globToRegExp(glob) {
  const normalized = glob.replace(/\\/g, '/').replace(/^\.\//, '')
  let re = '^'
  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i]
    if (c === '*' && normalized[i + 1] === '*') {
      if (normalized[i + 2] === '/') {
        re += '(?:.*/)?'
        i += 2
      }
      else {
        re += '.*'
        i += 1
      }
    }
    else if (c === '*') {
      re += '[^/]*'
    }
    else if ('.+^$()[]{}|?\\'.includes(c)) {
      re += `\\${c}`
    }
    else {
      re += c
    }
  }
  re += '$'
  return new RegExp(re)
}

function matchesGlob(path, glob) {
  const p = path.replace(/\\/g, '/').replace(/^\.\//, '')
  return globToRegExp(glob).test(p)
}

function loadMap() {
  return JSON.parse(readFileSync(MAP_PATH, 'utf8'))
}

function listChangedFiles(baseRef) {
  // Triple-dot: changes on this branch since merge-base with base.
  const out = execFileSync(
    'git',
    ['diff', '--name-only', '-z', `${baseRef}...HEAD`],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  )
  return out.split('\0').map(s => s.trim()).filter(Boolean)
}

function normalizeFiles(files) {
  return files
    .map(f => relative(REPO_ROOT, resolve(REPO_ROOT, f.replace(/\\/g, '/'))).replace(/\\/g, '/'))
    .filter(Boolean)
}

/** Spec files under tests/ that declare a @smoke tag (Phase 0 always-include). */
function findSmokeTestFiles() {
  let entries
  try {
    entries = readdirSync(TESTS_DIR)
  }
  catch {
    return []
  }
  const smokeRe = /tag:\s*(?:\[[^\]]*['"]@smoke['"]|['"]@smoke['"])/
  return entries
    .filter(name => /\.spec\.(ts|js|mjs|cjs)$/.test(name))
    .filter((name) => {
      const body = readFileSync(join(TESTS_DIR, name), 'utf8')
      return smokeRe.test(body)
    })
    .map(name => `tests/${name}`)
    .sort()
}

/**
 * @returns {{
 *   mode: 'full' | 'selective',
 *   reason: string,
 *   changedFiles: string[],
 *   matchedGroups: string[],
 *   fullTriggers: { path: string, glob: string }[],
 *   unknownPaths: string[],
 *   tests: string[],
 *   smokeFiles: string[],
 *   runFiles: string[],
 *   grep: string[],
 *   shardTotal: number,
 *   shards: number[],
 *   playwrightCommand: string,
 * }}
 */
function resolvePlan(changedFiles, map) {
  const fullTriggers = []
  const unknownPaths = []
  const matchedGroupNames = new Set()

  const groupEntries = Object.entries(map.groups || {})
  const smokeFiles = findSmokeTestFiles()
  const grep = [...(map.alwaysInclude?.grep || ['@smoke'])]

  const fullResult = (reason, extra = {}) => ({
    mode: 'full',
    reason,
    changedFiles,
    matchedGroups: [...matchedGroupNames].sort(),
    fullTriggers,
    unknownPaths,
    tests: [],
    smokeFiles,
    runFiles: [],
    grep,
    shardTotal: FULL_SHARD_TOTAL,
    shards: Array.from({ length: FULL_SHARD_TOTAL }, (_, i) => i + 1),
    playwrightCommand: 'npx playwright test',
    ...extra,
  })

  for (const file of changedFiles) {
    let hitFull = false
    for (const glob of map.fullSuitePathGlobs || []) {
      if (matchesGlob(file, glob)) {
        fullTriggers.push({ path: file, glob })
        hitFull = true
        break
      }
    }
    if (hitFull) continue

    let hitGroup = false
    for (const [name, group] of groupEntries) {
      for (const glob of group.paths || []) {
        if (matchesGlob(file, glob)) {
          matchedGroupNames.add(name)
          hitGroup = true
          break
        }
      }
    }
    if (!hitGroup) unknownPaths.push(file)
  }

  if (changedFiles.length === 0) {
    return fullResult('No changed files detected against base — fail closed to full suite.')
  }

  if (fullTriggers.length > 0) {
    const samples = fullTriggers.slice(0, 8).map(t => `${t.path} (← ${t.glob})`).join(', ')
    return fullResult(`Fail closed: shared/infrastructure path(s) matched full-suite globs — e.g. ${samples}`)
  }

  if (unknownPaths.length > 0) {
    return fullResult(`Fail closed: unknown/unmapped path(s): ${unknownPaths.join(', ')}`)
  }

  const tests = new Set()
  for (const name of matchedGroupNames) {
    for (const t of map.groups[name].tests || []) tests.add(t)
  }
  const testList = [...tests].sort()
  const groups = [...matchedGroupNames].sort()

  // Union group files with @smoke-bearing specs so one Playwright invocation
  // covers mapped groups + always-on smoke (avoids --grep filtering group tests).
  const runFiles = [...new Set([...testList, ...smokeFiles])].sort()
  const shards = Array.from({ length: SELECTIVE_SHARD_TOTAL }, (_, i) => i + 1)
  const playwrightCommand = `npx playwright test ${runFiles.join(' ')}`

  return {
    mode: 'selective',
    reason: `All changed paths mapped to group(s): ${groups.join(', ')}. @smoke files always included.`,
    changedFiles,
    matchedGroups: groups,
    fullTriggers,
    unknownPaths,
    tests: testList,
    smokeFiles,
    runFiles,
    grep,
    shardTotal: SELECTIVE_SHARD_TOTAL,
    shards,
    playwrightCommand,
  }
}

function formatHuman(plan, { base, mapPath, enforce }) {
  const lines = []
  if (enforce) {
    lines.push('=== Selective CI plan (Phase 2 enforce) ===')
    lines.push('Local GHA Playwright will run this plan on pull_request.')
  }
  else {
    lines.push('=== Selective CI plan (Phase 1 dry-run) ===')
    lines.push('Report only — pass --enforce for CI machine outputs.')
  }
  lines.push('')
  if (base) lines.push(`Base ref: ${base}`)
  lines.push(`Map: ${relative(REPO_ROOT, mapPath)}`)
  lines.push(`Mode: ${plan.mode.toUpperCase()}`)
  lines.push(`Reason: ${plan.reason}`)
  lines.push(`Shards: ${plan.shardTotal} (${plan.shards.join(', ')})`)
  lines.push('')
  lines.push('Changed paths:')
  if (plan.changedFiles.length === 0) lines.push('  (none)')
  else plan.changedFiles.forEach(f => lines.push(`  - ${f}`))
  lines.push('')

  if (plan.fullTriggers.length) {
    lines.push('Full-suite trigger matches:')
    plan.fullTriggers.forEach(t => lines.push(`  - ${t.path}  (glob: ${t.glob})`))
    lines.push('')
  }
  if (plan.unknownPaths.length) {
    lines.push('Unknown / unmapped paths:')
    plan.unknownPaths.forEach(f => lines.push(`  - ${f}`))
    lines.push('')
  }
  if (plan.matchedGroups.length) {
    lines.push(`Matched groups: ${plan.matchedGroups.join(', ')}`)
    lines.push('')
  }

  lines.push('Will run:')
  lines.push(`  Always grep tags: ${plan.grep.join(', ')}`)
  lines.push(`  Smoke files: ${plan.smokeFiles.length ? plan.smokeFiles.join(', ') : '(none found)'}`)
  if (plan.mode === 'full') {
    lines.push('  Test files: (entire suite under tests/)')
  }
  else if (plan.runFiles.length) {
    plan.runFiles.forEach(t => lines.push(`  - ${t}`))
  }
  else {
    lines.push('  Test files: (none)')
  }
  lines.push('')
  lines.push('Playwright command:')
  lines.push(`  ${plan.playwrightCommand}${plan.mode === 'full' ? '' : ` --shard=1/${plan.shardTotal}`}`)
  return lines.join('\n')
}

function formatMarkdown(plan, { base, mapPath, enforce }) {
  const lines = []
  lines.push(enforce
    ? '## Selective CI plan (Phase 2 — enforced on local GHA)'
    : '## Selective CI plan (Phase 1 dry-run)')
  lines.push('')
  if (enforce) {
    lines.push('_`playwright.yml` on this PR runs only the planned set (or full when fail-closed). `preview-tests.yml` stays full._')
  }
  else {
    lines.push('_Report only — pass `--enforce` for CI outputs. Dry-run does not skip tests._')
  }
  lines.push('')
  lines.push(`| | |`)
  lines.push(`|---|---|`)
  lines.push(`| **Mode** | \`${plan.mode}\` |`)
  if (base) lines.push(`| **Base** | \`${base}\` |`)
  lines.push(`| **Map** | \`${relative(REPO_ROOT, mapPath)}\` |`)
  lines.push(`| **Shards** | \`${plan.shardTotal}\` |`)
  lines.push(`| **Reason** | ${plan.reason.replace(/\|/g, '\\|')} |`)
  lines.push('')
  lines.push('### Changed paths')
  if (!plan.changedFiles.length) lines.push('- _(none)_')
  else plan.changedFiles.forEach(f => lines.push(`- \`${f}\``))
  lines.push('')

  if (plan.fullTriggers.length) {
    lines.push('### Full-suite triggers')
    plan.fullTriggers.forEach(t => lines.push(`- \`${t.path}\` ← \`${t.glob}\``))
    lines.push('')
  }
  if (plan.unknownPaths.length) {
    lines.push('### Unknown paths (fail closed)')
    plan.unknownPaths.forEach(f => lines.push(`- \`${f}\``))
    lines.push('')
  }
  if (plan.matchedGroups.length) {
    lines.push(`### Matched groups`)
    lines.push(plan.matchedGroups.map(g => `\`${g}\``).join(', '))
    lines.push('')
  }

  lines.push('### Run set')
  lines.push(`- Always grep: ${plan.grep.map(g => `\`${g}\``).join(', ')}`)
  lines.push(`- Smoke files: ${plan.smokeFiles.map(f => `\`${f}\``).join(', ') || '_none_'}`)
  if (plan.mode === 'full') {
    lines.push('- Test files: **full suite** (`tests/**`)')
  }
  else {
    plan.runFiles.forEach(t => lines.push(`- \`${t}\``))
  }
  lines.push('')
  lines.push('```text')
  lines.push(plan.playwrightCommand)
  lines.push('```')
  return lines.join('\n')
}

function appendGithubOutput(plan) {
  const outPath = process.env.GITHUB_OUTPUT
  if (!outPath) {
    console.log('(No GITHUB_OUTPUT env — skipping Actions outputs)')
    return
  }
  const lines = [
    `mode=${plan.mode}`,
    `test_files=${plan.mode === 'selective' ? plan.runFiles.join(' ') : ''}`,
    `shard_total=${plan.shardTotal}`,
    `shards=${JSON.stringify(plan.shards)}`,
  ]
  appendFileSync(outPath, `${lines.join('\n')}\n`)
  console.log(`Wrote plan outputs to GITHUB_OUTPUT (${outPath})`)
}

function printMachineReadable(plan) {
  console.log(`SELECTIVE_CI_MODE=${plan.mode}`)
  console.log(`SELECTIVE_CI_TEST_FILES=${plan.mode === 'selective' ? plan.runFiles.join(' ') : ''}`)
  console.log(`SELECTIVE_CI_SHARD_TOTAL=${plan.shardTotal}`)
  console.log(`SELECTIVE_CI_SHARDS=${JSON.stringify(plan.shards)}`)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    process.exit(0)
  }
  if (!args.base && !args.files) {
    printHelp()
    console.error('Error: provide --base <ref> or --files <list>')
    process.exit(1)
  }

  const map = loadMap()
  let changedFiles
  if (args.files) {
    changedFiles = normalizeFiles(args.files.split(',').map(s => s.trim()).filter(Boolean))
  }
  else {
    changedFiles = normalizeFiles(listChangedFiles(args.base))
  }

  const plan = resolvePlan(changedFiles, map)
  const meta = { base: args.base, mapPath: MAP_PATH, enforce: args.enforce }
  console.log(formatHuman(plan, meta))

  if (args.summary) {
    const summaryPath = process.env.GITHUB_STEP_SUMMARY
    if (summaryPath) {
      appendFileSync(summaryPath, `${formatMarkdown(plan, meta)}\n`)
      console.log(`Wrote plan to GITHUB_STEP_SUMMARY (${summaryPath})`)
    }
    else {
      console.log('(No GITHUB_STEP_SUMMARY env — markdown summary skipped)')
    }
  }

  printMachineReadable(plan)

  if (args.enforce) {
    appendGithubOutput(plan)
  }
}

try {
  main()
}
catch (err) {
  console.error('selective-ci-plan failed:', err?.message || err)
  process.exit(1)
}

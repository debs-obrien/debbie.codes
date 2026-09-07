#!/usr/bin/env node
/**
 * Selective CI Phase 1 — path→group dry-run (report only).
 *
 * Resolves which Playwright files / @smoke grep would run for changed paths,
 * but does NOT skip tests. Full suite remains the CI default.
 *
 * Usage:
 *   node qa/scripts/selective-ci-plan.mjs --base origin/main
 *   node qa/scripts/selective-ci-plan.mjs --base main
 *   node qa/scripts/selective-ci-plan.mjs --files content/blog/foo.md,pages/blog/index.vue
 *   node qa/scripts/selective-ci-plan.mjs --base origin/main --summary
 *
 * Exit 0 always on successful planning (even when mode=full). Non-zero only on
 * script/IO errors so CI never fails the suite because of the dry-run itself.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, appendFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const MAP_PATH = join(REPO_ROOT, 'qa/selective-ci/path-group-map.json')

function parseArgs(argv) {
  const out = { base: null, files: null, summary: false, help: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') out.help = true
    else if (a === '--summary') out.summary = true
    else if (a === '--base') out.base = argv[++i]
    else if (a.startsWith('--base=')) out.base = a.slice('--base='.length)
    else if (a === '--files') out.files = argv[++i]
    else if (a.startsWith('--files=')) out.files = a.slice('--files='.length)
    else throw new Error(`Unknown argument: ${a}`)
  }
  return out
}

function printHelp() {
  console.log(`Selective CI plan (Phase 1 dry-run)

Usage:
  node qa/scripts/selective-ci-plan.mjs --base <ref>
  node qa/scripts/selective-ci-plan.mjs --files <path,path,...>
  node qa/scripts/selective-ci-plan.mjs --base <ref> --summary

Options:
  --base <ref>   Git ref to diff against (e.g. origin/main, main)
  --files <list> Comma-separated paths (skip git; for local examples)
  --summary      Also append markdown to $GITHUB_STEP_SUMMARY when set
  -h, --help     Show this help

Phase 1 is report-only: CI still runs the full Playwright suite.
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

/**
 * @returns {{
 *   mode: 'full' | 'selective',
 *   reason: string,
 *   changedFiles: string[],
 *   matchedGroups: string[],
 *   fullTriggers: { path: string, glob: string }[],
 *   unknownPaths: string[],
 *   tests: string[],
 *   grep: string[],
 *   wouldRunCommand: string,
 * }}
 */
function resolvePlan(changedFiles, map) {
  const fullTriggers = []
  const unknownPaths = []
  const matchedGroupNames = new Set()
  const groupPathMatched = new Set()

  const groupEntries = Object.entries(map.groups || {})

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
          groupPathMatched.add(file)
          hitGroup = true
          break
        }
      }
    }
    if (!hitGroup) unknownPaths.push(file)
  }

  const grep = [...(map.alwaysInclude?.grep || ['@smoke'])]

  if (changedFiles.length === 0) {
    return {
      mode: 'full',
      reason: 'No changed files detected against base — fail closed to full suite.',
      changedFiles,
      matchedGroups: [],
      fullTriggers,
      unknownPaths,
      tests: [],
      grep,
      wouldRunCommand: 'npx playwright test   # full suite (default)',
    }
  }

  if (fullTriggers.length > 0) {
    const samples = fullTriggers.slice(0, 8).map(t => `${t.path} (← ${t.glob})`).join(', ')
    return {
      mode: 'full',
      reason: `Fail closed: shared/infrastructure path(s) matched full-suite globs — e.g. ${samples}`,
      changedFiles,
      matchedGroups: [...matchedGroupNames].sort(),
      fullTriggers,
      unknownPaths,
      tests: [],
      grep,
      wouldRunCommand: 'npx playwright test   # full suite (default)',
    }
  }

  if (unknownPaths.length > 0) {
    return {
      mode: 'full',
      reason: `Fail closed: unknown/unmapped path(s): ${unknownPaths.join(', ')}`,
      changedFiles,
      matchedGroups: [...matchedGroupNames].sort(),
      fullTriggers,
      unknownPaths,
      tests: [],
      grep,
      wouldRunCommand: 'npx playwright test   # full suite (default)',
    }
  }

  const tests = new Set()
  for (const name of matchedGroupNames) {
    for (const t of map.groups[name].tests || []) tests.add(t)
  }
  const testList = [...tests].sort()
  const groups = [...matchedGroupNames].sort()

  // Phase 2 sketch: run listed files OR anything tagged @smoke.
  // Playwright: `npx playwright test <files...> --grep-invert` is wrong;
  // better: run `npx playwright test --grep @smoke` union file list.
  const wouldRunCommand = [
    '# Phase 2 sketch only — Phase 1 does not execute this:',
    `npx playwright test ${testList.join(' ')}`,
    `npx playwright test --grep '${grep.join('|')}'   # always-on smoke (may overlap files above)`,
  ].join('\n')

  return {
    mode: 'selective',
    reason: `All changed paths mapped to group(s): ${groups.join(', ')}. @smoke always included.`,
    changedFiles,
    matchedGroups: groups,
    fullTriggers,
    unknownPaths,
    tests: testList,
    grep,
    wouldRunCommand,
  }
}

function formatHuman(plan, { base, mapPath }) {
  const lines = []
  lines.push('=== Selective CI plan (Phase 1 dry-run) ===')
  lines.push('Report only — full Playwright suite still runs in CI.')
  lines.push('')
  if (base) lines.push(`Base ref: ${base}`)
  lines.push(`Map: ${relative(REPO_ROOT, mapPath)}`)
  lines.push(`Mode: ${plan.mode.toUpperCase()}`)
  lines.push(`Reason: ${plan.reason}`)
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

  lines.push('Would run (Phase 2):')
  lines.push(`  Always grep: ${plan.grep.join(', ')}`)
  if (plan.mode === 'full') {
    lines.push('  Test files: (entire suite under tests/)')
  }
  else if (plan.tests.length) {
    plan.tests.forEach(t => lines.push(`  - ${t}`))
  }
  else {
    lines.push('  Test files: (none beyond @smoke)')
  }
  lines.push('')
  lines.push('Would-run command sketch:')
  plan.wouldRunCommand.split('\n').forEach(l => lines.push(`  ${l}`))
  lines.push('')
  lines.push('Phase 1: no tests skipped. CI command remains: npx playwright test')
  return lines.join('\n')
}

function formatMarkdown(plan, { base, mapPath }) {
  const lines = []
  lines.push('## Selective CI plan (Phase 1 dry-run)')
  lines.push('')
  lines.push('_Report only — full Playwright suite still runs. Nothing is skipped._')
  lines.push('')
  lines.push(`| | |`)
  lines.push(`|---|---|`)
  lines.push(`| **Mode** | \`${plan.mode}\` |`)
  if (base) lines.push(`| **Base** | \`${base}\` |`)
  lines.push(`| **Map** | \`${relative(REPO_ROOT, mapPath)}\` |`)
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

  lines.push('### Would run (Phase 2 preview)')
  lines.push(`- Always grep: ${plan.grep.map(g => `\`${g}\``).join(', ')}`)
  if (plan.mode === 'full') {
    lines.push('- Test files: **full suite** (`tests/**`)')
  }
  else {
    plan.tests.forEach(t => lines.push(`- \`${t}\``))
  }
  lines.push('')
  lines.push('```text')
  lines.push(plan.wouldRunCommand)
  lines.push('```')
  lines.push('')
  lines.push('Phase 1 keeps: `npx playwright test` (full suite).')
  return lines.join('\n')
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
  const human = formatHuman(plan, { base: args.base, mapPath: MAP_PATH })
  console.log(human)

  if (args.summary) {
    const summaryPath = process.env.GITHUB_STEP_SUMMARY
    if (summaryPath) {
      appendFileSync(summaryPath, `${formatMarkdown(plan, { base: args.base, mapPath: MAP_PATH })}\n`)
      console.log(`Wrote plan to GITHUB_STEP_SUMMARY (${summaryPath})`)
    }
    else {
      console.log('(No GITHUB_STEP_SUMMARY env — markdown summary skipped)')
    }
  }

  // Machine-readable trailing marker for local/CI assertions
  console.log(`SELECTIVE_CI_MODE=${plan.mode}`)
}

try {
  main()
}
catch (err) {
  console.error('selective-ci-plan failed:', err?.message || err)
  process.exit(1)
}

#!/usr/bin/env node
/**
 * Agent-friendly control CLI for verifying debbie.codes.
 * Drive the live Nuxt site the way a user would, via Playwright (already in this repo).
 *
 * Usage: node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs <command> [options]
 */

import { spawn } from 'node:child_process'
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../../..')
const SKILL_DIR = __dirname
const DEFAULT_PORT = 8000
const DEFAULT_HOST = '127.0.0.1'
const STATE_DIR = join(tmpdir(), 'debbie-codes-verify')
const STATE_PATH = join(STATE_DIR, 'state.json')
const ARTIFACTS_DIR = join(SKILL_DIR, 'artifacts')
const READY_TIMEOUT_MS = 120_000
const READY_POLL_MS = 500

function usage(exitCode = 0) {
  const text = `control-debbie-codes — drive the live debbie.codes Nuxt site for verification

Usage:
  node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs <command> [options]

Commands:
  launch [--port <n>] [--reuse] [--json]
      Start \`npm run dev\` for this repo (or reuse a healthy server on the port).
      Writes state under ${STATE_DIR}.

  doctor [--json]
      Read-only health check: HTTP 200 on base URL, title contains Debbie,
      optional ownership of the process we launched.

  info [--json]
      Print current verification state (base URL, pid, evidence dir, browser CDP).

  goto <path> [--json]
      Open a path on the running site (e.g. /, /blog, /videos).

  click --role <role> --name <name> [--exact] [--json]
      Click by ARIA role + accessible name.

  fill --placeholder <text> --value <value> [--json]
      Fill an input matched by placeholder.

  expect --role <role> --name <name> [--visible|--hidden] [--timeout <ms>] [--json]
      Assert an element is visible (default) or hidden.

  expect-url <pattern> [--timeout <ms>] [--json]
      Assert the current URL matches a regex string.

  snapshot [--out <path>] [--json]
      Write an accessibility snapshot (YAML-ish text) to evidence or --out.

  screenshot [--out <path>] [--full-page] [--json]
      Capture a PNG screenshot to evidence or --out.

  drive <feature> [--json]
      Run a mapped feature recipe end-to-end and capture evidence.
      Features: home | navigation | blog | videos | about | tags-and-search

  evidence list|path [--json]
      List proof artifacts or print the evidence directory path.

  cleanup [--dry-run] [--json]
      Stop the Nuxt process and browser this CLI started.
      Never deletes evidence under artifacts/.

Global:
  --help, -h     Show this help
  --json         Machine-readable JSON on stdout (errors still use stderr text)
  --dry-run      For cleanup only: print what would be stopped without doing it

Evidence survives cleanup at:
  ${ARTIFACTS_DIR}/<run-id>/
`
  if (exitCode === 0)
    console.log(text)
  else
    console.error(text)
  process.exit(exitCode)
}

function parseArgs(argv) {
  const args = { _: [], flags: {} }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') {
      args.flags.help = true
    }
    else if (a === '--json') {
      args.flags.json = true
    }
    else if (a === '--dry-run') {
      args.flags.dryRun = true
    }
    else if (a === '--reuse') {
      args.flags.reuse = true
    }
    else if (a === '--exact') {
      args.flags.exact = true
    }
    else if (a === '--visible') {
      args.flags.visible = true
    }
    else if (a === '--hidden') {
      args.flags.hidden = true
    }
    else if (a === '--full-page') {
      args.flags.fullPage = true
    }
    else if (a.startsWith('--') && a.includes('=')) {
      const [k, ...rest] = a.slice(2).split('=')
      args.flags[camel(k)] = rest.join('=')
    }
    else if (a.startsWith('--')) {
      const key = camel(a.slice(2))
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        args.flags[key] = next
        i++
      }
      else {
        args.flags[key] = true
      }
    }
    else {
      args._.push(a)
    }
  }
  return args
}

function camel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function fail(message, { code = 1, json = false, details } = {}) {
  if (json) {
    console.log(JSON.stringify({ ok: false, error: message, ...(details || {}) }, null, 2))
  }
  else {
    console.error(`error: ${message}`)
    if (details)
      console.error(details)
  }
  process.exit(code)
}

function ok(payload, { json = false } = {}) {
  if (json)
    console.log(JSON.stringify({ ok: true, ...payload }, null, 2))
  else if (typeof payload === 'string')
    console.log(payload)
  else if (payload.message)
    console.log(payload.message)
  else
    console.log(JSON.stringify(payload, null, 2))
}

function ensureDirs() {
  mkdirSync(STATE_DIR, { recursive: true })
  mkdirSync(ARTIFACTS_DIR, { recursive: true })
}

function readState() {
  if (!existsSync(STATE_PATH))
    return null
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'))
  }
  catch {
    return null
  }
}

function writeState(state) {
  ensureDirs()
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`)
}

function clearState() {
  if (existsSync(STATE_PATH))
    rmSync(STATE_PATH)
}

function baseUrlFrom(stateOrPort) {
  if (typeof stateOrPort === 'object' && stateOrPort?.baseURL)
    return stateOrPort.baseURL.replace(/\/$/, '')
  const port = typeof stateOrPort === 'number' ? stateOrPort : DEFAULT_PORT
  return `http://${DEFAULT_HOST}:${port}`
}

function evidenceDirFor(state) {
  const runId = state?.runId || 'default'
  const dir = join(ARTIFACTS_DIR, runId)
  mkdirSync(dir, { recursive: true })
  return dir
}

function resolveOutPath(state, out, fallbackName) {
  if (out) {
    const p = isAbsolute(out) ? out : resolve(process.cwd(), out)
    mkdirSync(dirname(p), { recursive: true })
    return p
  }
  const dir = evidenceDirFor(state)
  return join(dir, fallbackName)
}

async function httpProbe(url, { timeoutMs = 5000 } = {}) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow' })
    const text = await res.text()
    return { status: res.status, ok: res.ok, text, headers: Object.fromEntries(res.headers) }
  }
  catch (err) {
    return { status: 0, ok: false, error: err.message }
  }
  finally {
    clearTimeout(t)
  }
}

function pidAlive(pid) {
  if (!pid || typeof pid !== 'number')
    return false
  try {
    process.kill(pid, 0)
    return true
  }
  catch {
    return false
  }
}

async function waitForReady(url, { timeoutMs = READY_TIMEOUT_MS } = {}) {
  const start = Date.now()
  let lastError = ''
  while (Date.now() - start < timeoutMs) {
    const probe = await httpProbe(url, { timeoutMs: 2000 })
    if (probe.ok && /Debbie/i.test(probe.text || ''))
      return { ready: true, status: probe.status }
    lastError = probe.error || `HTTP ${probe.status}`
    await new Promise(r => setTimeout(r, READY_POLL_MS))
  }
  return { ready: false, error: lastError }
}

async function launchCommand(flags) {
  ensureDirs()
  const port = Number(flags.port || DEFAULT_PORT)
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    fail(`invalid --port ${flags.port}`, { json: flags.json })

  const baseURL = baseUrlFrom(port)
  const existing = readState()
  const probe = await httpProbe(baseURL)

  if (probe.ok && /Debbie/i.test(probe.text || '')) {
    if (!flags.reuse && existing?.pid && pidAlive(existing.pid) && existing.port === port) {
      // Already our instance
      const state = {
        ...existing,
        baseURL,
        port,
        reused: true,
        checkedAt: new Date().toISOString(),
      }
      writeState(state)
      return ok({
        message: `Reusing healthy server we own at ${baseURL} (pid ${existing.pid})`,
        baseURL,
        port,
        pid: existing.pid,
        runId: state.runId,
        evidenceDir: evidenceDirFor(state),
        reused: true,
      }, { json: flags.json })
    }
    if (flags.reuse || !existing) {
      const runId = existing?.runId || `run-${Date.now()}`
      const state = {
        runId,
        baseURL,
        port,
        pid: existing?.pid || null,
        owned: false,
        reused: true,
        startedAt: existing?.startedAt || new Date().toISOString(),
        evidenceDir: join(ARTIFACTS_DIR, runId),
        repoRoot: REPO_ROOT,
        browser: existing?.browser || null,
      }
      writeState(state)
      mkdirSync(state.evidenceDir, { recursive: true })
      return ok({
        message: `Reusing already-running site at ${baseURL} (not owned by this CLI; cleanup will not stop it)`,
        baseURL,
        port,
        owned: false,
        runId,
        evidenceDir: state.evidenceDir,
        reused: true,
      }, { json: flags.json })
    }
    fail(
      `Port ${port} already serves debbie.codes but is not tracked as ours. Pass --reuse to adopt it, or pick another --port.`,
      { json: flags.json, details: { baseURL, existingState: existing } },
    )
  }

  if (probe.ok && !/Debbie/i.test(probe.text || '')) {
    fail(
      `Port ${port} is in use by something that is not debbie.codes (response missing Debbie identity). Choose another --port.`,
      { json: flags.json },
    )
  }

  const runId = `run-${Date.now()}`
  const evidenceDir = join(ARTIFACTS_DIR, runId)
  mkdirSync(evidenceDir, { recursive: true })
  const logPath = join(STATE_DIR, `${runId}-nuxt.log`)
  // Redirect child stdio to a file so this CLI can exit without keeping
  // pipe listeners open (which would hang `launch` forever).
  writeFileSync(logPath, '')
  const logFd = openSync(logPath, 'a')

  const child = spawn('npm', ['run', 'dev', '--', '--host', DEFAULT_HOST, '--port', String(port)], {
    cwd: REPO_ROOT,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', logFd, logFd],
    detached: true,
  })

  try {
    closeSync(logFd)
  }
  catch { /* ignore */ }

  child.unref()

  const pending = {
    runId,
    baseURL,
    port,
    pid: child.pid,
    owned: true,
    reused: false,
    startedAt: new Date().toISOString(),
    evidenceDir,
    repoRoot: REPO_ROOT,
    logPath,
    browser: null,
  }
  writeState(pending)

  const ready = await waitForReady(baseURL)
  if (!ready.ready) {
    try {
      process.kill(-child.pid, 'SIGTERM')
    }
    catch {
      try { process.kill(child.pid, 'SIGTERM') }
      catch { /* ignore */ }
    }
    clearState()
    fail(
      `Nuxt did not become ready at ${baseURL} within ${READY_TIMEOUT_MS}ms: ${ready.error || 'unknown'}. See ${logPath}`,
      { json: flags.json },
    )
  }

  writeState({ ...pending, readyAt: new Date().toISOString() })
  return ok({
    message: `Launched Nuxt at ${baseURL} (pid ${child.pid})`,
    baseURL,
    port,
    pid: child.pid,
    owned: true,
    runId,
    evidenceDir,
    logPath,
  }, { json: flags.json })
}

async function doctorCommand(flags) {
  const state = readState()
  const port = Number(flags.port || state?.port || DEFAULT_PORT)
  const baseURL = baseUrlFrom(state || port)
  const probe = await httpProbe(`${baseURL}/`)
  const titleMatch = /Debbie/i.test(probe.text || '')
  const ownedAlive = Boolean(state?.owned && state?.pid && pidAlive(state.pid))

  const report = {
    healthy: Boolean(probe.ok && titleMatch),
    baseURL,
    httpStatus: probe.status,
    identityOk: titleMatch,
    statePresent: Boolean(state),
    ownedProcess: state?.owned || false,
    pid: state?.pid || null,
    pidAlive: state?.pid ? pidAlive(state.pid) : false,
    ownedAlive,
    browserMode: state?.browser?.mode || 'ephemeral-per-command',
    runId: state?.runId || null,
    evidenceDir: state ? evidenceDirFor(state) : ARTIFACTS_DIR,
    checkedAt: new Date().toISOString(),
  }

  if (!report.healthy) {
    fail(
      `doctor failed: site at ${baseURL} is not healthy (http=${probe.status}, identity=${titleMatch}). Run launch first.`,
      { json: flags.json, details: report },
    )
  }

  if (flags.json) {
    return ok(report, { json: true })
  }
  console.log(`doctor: healthy`)
  console.log(`  baseURL:     ${report.baseURL}`)
  console.log(`  httpStatus:  ${report.httpStatus}`)
  console.log(`  identity:    Debbie present`)
  console.log(`  owned:       ${report.ownedProcess} (pid ${report.pid ?? 'n/a'}, alive=${report.pidAlive})`)
  console.log(`  browser:     ${report.browserMode} (launched per command)`)
  console.log(`  evidence:    ${report.evidenceDir}`)
  console.log(`  runId:       ${report.runId ?? 'n/a'}`)
}

async function infoCommand(flags) {
  const state = readState()
  if (!state) {
    fail('no verification state; run launch first', { json: flags.json })
  }
  return ok({
    message: `baseURL=${state.baseURL} runId=${state.runId}`,
    ...state,
    evidenceDir: evidenceDirFor(state),
    pidAlive: state.pid ? pidAlive(state.pid) : false,
  }, { json: flags.json })
}

async function loadPlaywright() {
  try {
    return await import('playwright')
  }
  catch {
    fail(
      'Playwright is not importable. From the repo root run: npm ci && npx playwright install chromium',
      { json: false },
    )
  }
}

/**
 * Each CLI invocation gets a fresh headless Chromium and closes it before exit.
 * That keeps commands agent-friendly (no hung Node process holding CDP) while
 * the Nuxt server stays up across commands.
 */
async function withPage(flags, fn) {
  const state = readState()
  if (!state?.baseURL) {
    fail('no verification state; run launch first', { json: flags.json })
  }
  const doctorProbe = await httpProbe(`${state.baseURL}/`)
  if (!doctorProbe.ok) {
    fail(`site not reachable at ${state.baseURL}; run doctor / launch`, { json: flags.json })
  }

  const { chromium } = await loadPlaywright()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()
  state.browser = {
    mode: 'ephemeral-per-command',
    lastUsedAt: new Date().toISOString(),
  }
  writeState(state)

  try {
    return await fn(page, state, { browser, context, page })
  }
  finally {
    await browser.close().catch(() => {})
  }
}

async function gotoCommand(pathArg, flags) {
  if (!pathArg)
    fail('goto requires a path (e.g. / or /blog)', { json: flags.json })
  return withPage(flags, async (page, state) => {
    const url = pathArg.startsWith('http') ? pathArg : `${state.baseURL}${pathArg.startsWith('/') ? pathArg : `/${pathArg}`}`
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    const title = await page.title()
    return ok({
      message: `opened ${url}`,
      url: page.url(),
      title,
    }, { json: flags.json })
  })
}

function namePattern(name, exact) {
  if (exact)
    return name
  // Allow /regex/ literals
  if (name.startsWith('/') && name.lastIndexOf('/') > 0) {
    const last = name.lastIndexOf('/')
    const body = name.slice(1, last)
    const flags = name.slice(last + 1)
    return new RegExp(body, flags)
  }
  return new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
}

async function clickCommand(flags) {
  if (!flags.role || !flags.name) {
    fail('click requires --role and --name', { json: flags.json })
  }
  return withPage(flags, async (page) => {
    const locator = page.getByRole(flags.role, { name: namePattern(flags.name, flags.exact) })
    await locator.first().click({ timeout: Number(flags.timeout || 15_000) })
    return ok({
      message: `clicked role=${flags.role} name=${flags.name}`,
      url: page.url(),
    }, { json: flags.json })
  })
}

async function fillCommand(flags) {
  if (!flags.placeholder || flags.value === undefined) {
    fail('fill requires --placeholder and --value', { json: flags.json })
  }
  return withPage(flags, async (page) => {
    const input = page.getByPlaceholder(flags.placeholder)
    await input.fill(String(flags.value), { timeout: Number(flags.timeout || 15_000) })
    return ok({
      message: `filled placeholder=${flags.placeholder}`,
      value: String(flags.value),
      url: page.url(),
    }, { json: flags.json })
  })
}

async function expectCommand(flags) {
  if (!flags.role || !flags.name) {
    fail('expect requires --role and --name', { json: flags.json })
  }
  const wantHidden = Boolean(flags.hidden)
  return withPage(flags, async (page) => {
    const { expect } = await import('@playwright/test')
    const locator = page.getByRole(flags.role, { name: namePattern(flags.name, flags.exact) })
    const timeout = Number(flags.timeout || 15_000)
    if (wantHidden)
      await expect(locator.first()).toBeHidden({ timeout })
    else
      await expect(locator.first()).toBeVisible({ timeout })
    return ok({
      message: `expect ok: role=${flags.role} name=${flags.name} ${wantHidden ? 'hidden' : 'visible'}`,
      url: page.url(),
    }, { json: flags.json })
  })
}

async function expectUrlCommand(pattern, flags) {
  if (!pattern)
    fail('expect-url requires a regex pattern string', { json: flags.json })
  return withPage(flags, async (page) => {
    const { expect } = await import('@playwright/test')
    const re = pattern.startsWith('/') ? namePattern(pattern, false) : new RegExp(pattern)
    await expect(page).toHaveURL(re, { timeout: Number(flags.timeout || 15_000) })
    return ok({
      message: `URL matches ${re}`,
      url: page.url(),
    }, { json: flags.json })
  })
}

async function snapshotCommand(flags) {
  return withPage(flags, async (page, state) => {
    const out = resolveOutPath(state, flags.out, `snapshot-${Date.now()}.txt`)
    const snapshot = await page.locator('body').ariaSnapshot()
    writeFileSync(out, `${snapshot}\n`)
    return ok({
      message: `wrote snapshot ${out}`,
      path: out,
      url: page.url(),
      preview: snapshot.split('\n').slice(0, 40).join('\n'),
    }, { json: flags.json })
  })
}

async function screenshotCommand(flags) {
  return withPage(flags, async (page, state) => {
    const out = resolveOutPath(state, flags.out, `screenshot-${Date.now()}.png`)
    await page.screenshot({ path: out, fullPage: Boolean(flags.fullPage) })
    return ok({
      message: `wrote screenshot ${out}`,
      path: out,
      url: page.url(),
    }, { json: flags.json })
  })
}

async function driveFeature(feature, flags) {
  const recipes = {
    home: driveHome,
    navigation: driveNavigation,
    blog: driveBlog,
    videos: driveVideos,
    about: driveAbout,
    'tags-and-search': driveTagsAndSearch,
  }
  const fn = recipes[feature]
  if (!fn) {
    fail(
      `unknown feature "${feature}". Mapped features: ${Object.keys(recipes).join(', ')}`,
      { json: flags.json },
    )
  }
  return withPage(flags, async (page, state) => fn(page, state, flags))
}

async function driveHome(page, state, flags) {
  const { expect } = await import('@playwright/test')
  const evidence = evidenceDirFor(state)
  await page.goto(`${state.baseURL}/`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1, name: /Debbie O'Brien/i })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(/Developer Educator focused on Playwright/i)).toBeVisible()
  await expect(page.getByRole('region', { name: /Recent Blog Posts/i })).toBeVisible()
  const shot = join(evidence, 'home-proof.png')
  const snap = join(evidence, 'home-proof.aria.txt')
  await page.screenshot({ path: shot, fullPage: false })
  writeFileSync(snap, `${await page.locator('body').ariaSnapshot()}\n`)
  writeFileSync(join(evidence, 'home-proof.json'), `${JSON.stringify({
    feature: 'home',
    url: page.url(),
    title: await page.title(),
    at: new Date().toISOString(),
    artifacts: [shot, snap],
  }, null, 2)}\n`)
  return ok({
    message: `drove feature home; evidence in ${evidence}`,
    feature: 'home',
    url: page.url(),
    evidenceDir: evidence,
    artifacts: [shot, snap],
  }, { json: flags.json })
}

async function driveNavigation(page, state, flags) {
  const { expect } = await import('@playwright/test')
  const evidence = evidenceDirFor(state)
  await page.goto(`${state.baseURL}/`, { waitUntil: 'domcontentloaded' })
  const nav = page.getByRole('navigation')
  const headerLinks = [
    ['About', /\/about\/?$/],
    ['Speaking', /\/speaking\/?$/],
    ['Videos', /\/videos\/?$/],
    ['Podcasts', /\/podcasts\/?$/],
    ['Courses', /\/courses\/?$/],
    ['Blog', /\/blog\/?$/],
    ['Now', /\/now\/?$/],
  ]
  for (const [name, pattern] of headerLinks) {
    await expect(async () => {
      await nav.getByRole('link', { name, exact: true }).click()
      await expect(page).toHaveURL(pattern, { timeout: 2000 })
    }).toPass({ timeout: 15_000 })
  }
  await expect(async () => {
    await page.getByRole('link', { name: /Debbie O'Brien/i }).first().click()
    await expect(page).toHaveURL(url => new URL(url).pathname === '/', { timeout: 2000 })
  }).toPass({ timeout: 15_000 })
  const shot = join(evidence, 'navigation-proof.png')
  const snap = join(evidence, 'navigation-proof.aria.txt')
  await page.screenshot({ path: shot, fullPage: false })
  writeFileSync(snap, `${await nav.first().ariaSnapshot()}\n`)
  writeFileSync(join(evidence, 'navigation-proof.json'), `${JSON.stringify({
    feature: 'navigation',
    url: page.url(),
    at: new Date().toISOString(),
    artifacts: [shot, snap],
  }, null, 2)}\n`)
  return ok({
    message: `drove feature navigation; evidence in ${evidence}`,
    feature: 'navigation',
    url: page.url(),
    evidenceDir: evidence,
    artifacts: [shot, snap],
  }, { json: flags.json })
}

async function driveAbout(page, state, flags) {
  const { expect } = await import('@playwright/test')
  const evidence = evidenceDirFor(state)
  await page.goto(`${state.baseURL}/about`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1, name: /I'm Debbie O'Brien/i })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('heading', { name: 'Awards & Achievements' })).toBeVisible()
  await expect.poll(
    () => page.getByRole('main').getByRole('article').count(),
    { timeout: 15_000 },
  ).toBe(9)
  const shot = join(evidence, 'about-proof.png')
  const snap = join(evidence, 'about-proof.aria.txt')
  await page.screenshot({ path: shot })
  writeFileSync(snap, `${await page.getByRole('main').ariaSnapshot()}\n`)
  writeFileSync(join(evidence, 'about-proof.json'), `${JSON.stringify({
    feature: 'about',
    awardCount: await page.getByRole('main').getByRole('article').count(),
    url: page.url(),
    at: new Date().toISOString(),
    artifacts: [shot, snap],
  }, null, 2)}\n`)
  return ok({
    message: `drove feature about; evidence in ${evidence}`,
    feature: 'about',
    url: page.url(),
    evidenceDir: evidence,
    artifacts: [shot, snap],
  }, { json: flags.json })
}

async function driveBlog(page, state, flags) {
  const { expect } = await import('@playwright/test')
  const evidence = evidenceDirFor(state)
  await page.goto(`${state.baseURL}/blog`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('article').first()).toBeVisible({ timeout: 20_000 })
  const firstTitle = (await page.getByRole('article').first().getByRole('heading').innerText()).trim()
  await page.getByRole('article').first().getByRole('link').first().click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20_000 })
  await expect(page).toHaveURL(/\/blog\/[^/]+\/?$/)
  const shot = join(evidence, 'blog-proof.png')
  const snap = join(evidence, 'blog-proof.aria.txt')
  await page.screenshot({ path: shot })
  writeFileSync(snap, `${await page.locator('body').ariaSnapshot()}\n`)
  writeFileSync(join(evidence, 'blog-proof.json'), `${JSON.stringify({
    feature: 'blog',
    openedFromListing: firstTitle,
    url: page.url(),
    at: new Date().toISOString(),
    artifacts: [shot, snap],
  }, null, 2)}\n`)
  return ok({
    message: `drove feature blog (opened "${firstTitle}"); evidence in ${evidence}`,
    feature: 'blog',
    url: page.url(),
    evidenceDir: evidence,
    artifacts: [shot, snap],
  }, { json: flags.json })
}

async function driveVideos(page, state, flags) {
  const { expect } = await import('@playwright/test')
  const evidence = evidenceDirFor(state)
  await page.goto(`${state.baseURL}/videos`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: /All Videos|Search Results/i })).toBeVisible({ timeout: 20_000 })
  await expect.poll(() => page.getByRole('article').count(), { timeout: 20_000 }).toBeGreaterThan(0)
  const shot = join(evidence, 'videos-proof.png')
  const snap = join(evidence, 'videos-proof.aria.txt')
  await page.screenshot({ path: shot })
  writeFileSync(snap, `${await page.locator('body').ariaSnapshot()}\n`)
  writeFileSync(join(evidence, 'videos-proof.json'), `${JSON.stringify({
    feature: 'videos',
    articleCount: await page.getByRole('article').count(),
    url: page.url(),
    at: new Date().toISOString(),
    artifacts: [shot, snap],
  }, null, 2)}\n`)
  return ok({
    message: `drove feature videos; evidence in ${evidence}`,
    feature: 'videos',
    url: page.url(),
    evidenceDir: evidence,
    artifacts: [shot, snap],
  }, { json: flags.json })
}

async function driveTagsAndSearch(page, state, flags) {
  const { expect } = await import('@playwright/test')
  const evidence = evidenceDirFor(state)
  await page.goto(`${state.baseURL}/blog`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('article').first()).toBeVisible({ timeout: 20_000 })

  const searchInput = page.getByPlaceholder('Search...')
  await expect(async () => {
    await searchInput.fill('playwright')
    await expect(page.getByRole('heading', { name: /Search Results/i })).toBeVisible()
  }).toPass({ timeout: 15_000 })

  const searchShot = join(evidence, 'tags-and-search-search.png')
  await page.screenshot({ path: searchShot })

  await searchInput.clear()
  await expect(page.getByRole('heading', { name: /Recent Posts/i })).toBeVisible({ timeout: 15_000 })

  const tagLink = page.getByRole('link', { name: '#Playwright' }).first()
  await expect(async () => {
    await tagLink.click()
    await expect(page).toHaveURL(/\/blog\/tags\/playwright\/?$/, { timeout: 2000 })
  }).toPass({ timeout: 15_000 })

  await expect.poll(
    () => page.getByRole('article').getByRole('link', { name: /#playwright/i }).count(),
    { timeout: 15_000 },
  ).toBeGreaterThan(0)

  const tagShot = join(evidence, 'tags-and-search-tag.png')
  const snap = join(evidence, 'tags-and-search.aria.txt')
  await page.screenshot({ path: tagShot })
  writeFileSync(snap, `${await page.locator('body').ariaSnapshot()}\n`)
  writeFileSync(join(evidence, 'tags-and-search-proof.json'), `${JSON.stringify({
    feature: 'tags-and-search',
    url: page.url(),
    at: new Date().toISOString(),
    artifacts: [searchShot, tagShot, snap],
  }, null, 2)}\n`)

  return ok({
    message: `drove feature tags-and-search; evidence in ${evidence}`,
    feature: 'tags-and-search',
    url: page.url(),
    evidenceDir: evidence,
    artifacts: [searchShot, tagShot, snap],
  }, { json: flags.json })
}

async function evidenceCommand(sub, flags) {
  const state = readState()
  const dir = state ? evidenceDirFor(state) : ARTIFACTS_DIR
  if (sub === 'path') {
    return ok({ message: dir, path: dir, artifactsRoot: ARTIFACTS_DIR }, { json: flags.json })
  }
  if (sub === 'list' || !sub) {
    const { readdirSync, statSync } = await import('node:fs')
    const entries = []
    if (existsSync(ARTIFACTS_DIR)) {
      for (const run of readdirSync(ARTIFACTS_DIR)) {
        const runPath = join(ARTIFACTS_DIR, run)
        let st
        try { st = statSync(runPath) }
        catch { continue }
        if (!st.isDirectory())
          continue
        for (const f of readdirSync(runPath)) {
          entries.push(join(runPath, f))
        }
      }
    }
    if (flags.json) {
      return ok({ artifactsRoot: ARTIFACTS_DIR, evidenceDir: dir, files: entries }, { json: true })
    }
    console.log(`artifacts root: ${ARTIFACTS_DIR}`)
    console.log(`current run:    ${dir}`)
    if (!entries.length)
      console.log('(no evidence files yet)')
    else
      entries.forEach(f => console.log(f))
    return
  }
  fail(`unknown evidence subcommand "${sub}". Use list or path.`, { json: flags.json })
}

async function cleanupCommand(flags) {
  const state = readState()
  if (!state) {
    return ok({
      message: 'nothing to clean up (no state file)',
      dryRun: Boolean(flags.dryRun),
    }, { json: flags.json })
  }

  const actions = []
  // Browsers are ephemeral per command; only scratch profiles from older runs may remain.
  if (state.browser?.userDataDir && state.browser.userDataDir.startsWith(STATE_DIR)) {
    actions.push({ type: 'browser-profile', userDataDir: state.browser.userDataDir })
  }
  if (state.owned && state.pid) {
    actions.push({ type: 'nuxt', pid: state.pid, port: state.port })
  }
  else if (state.pid && !state.owned) {
    actions.push({ type: 'skip-nuxt-not-owned', pid: state.pid, port: state.port })
  }

  if (flags.dryRun) {
    return ok({
      message: 'dry-run: would clean up the following (evidence kept)',
      dryRun: true,
      actions,
      evidencePreserved: state.evidenceDir || ARTIFACTS_DIR,
      statePath: STATE_PATH,
    }, { json: flags.json })
  }

  if (state.browser?.userDataDir && state.browser.userDataDir.startsWith(STATE_DIR)) {
    try {
      rmSync(state.browser.userDataDir, { recursive: true, force: true })
    }
    catch { /* ignore */ }
  }

  // Remove any leftover browser-* scratch dirs for this run id
  if (state.runId) {
    const legacyProfile = join(STATE_DIR, `browser-${state.runId}`)
    if (existsSync(legacyProfile)) {
      try { rmSync(legacyProfile, { recursive: true, force: true }) }
      catch { /* ignore */ }
    }
  }

  if (state.owned && state.pid && pidAlive(state.pid)) {
    try {
      process.kill(-state.pid, 'SIGTERM')
    }
    catch {
      try {
        process.kill(state.pid, 'SIGTERM')
      }
      catch { /* ignore */ }
    }
    // brief wait then SIGKILL if needed
    await new Promise(r => setTimeout(r, 1500))
    if (pidAlive(state.pid)) {
      try {
        process.kill(-state.pid, 'SIGKILL')
      }
      catch {
        try { process.kill(state.pid, 'SIGKILL') }
        catch { /* ignore */ }
      }
    }
  }

  const evidenceDir = state.evidenceDir || evidenceDirFor(state)
  clearState()

  // Confirm evidence still exists
  const evidenceStillThere = existsSync(evidenceDir)
  return ok({
    message: `cleanup done; evidence ${evidenceStillThere ? 'preserved' : 'MISSING'} at ${evidenceDir}`,
    actions,
    evidencePreserved: evidenceDir,
    evidenceExists: evidenceStillThere,
  }, { json: flags.json })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.flags.help || args._.length === 0)
    usage(args._.length === 0 ? 1 : 0)

  const [cmd, ...rest] = args._
  const flags = args.flags

  try {
    switch (cmd) {
      case 'launch':
        await launchCommand(flags)
        break
      case 'doctor':
        await doctorCommand(flags)
        break
      case 'info':
        await infoCommand(flags)
        break
      case 'goto':
        await gotoCommand(rest[0], flags)
        break
      case 'click':
        await clickCommand(flags)
        break
      case 'fill':
        await fillCommand(flags)
        break
      case 'expect':
        await expectCommand(flags)
        break
      case 'expect-url':
        await expectUrlCommand(rest[0], flags)
        break
      case 'snapshot':
        await snapshotCommand(flags)
        break
      case 'screenshot':
        await screenshotCommand(flags)
        break
      case 'drive':
        await driveFeature(rest[0], flags)
        break
      case 'evidence':
        await evidenceCommand(rest[0] || 'list', flags)
        break
      case 'cleanup':
        await cleanupCommand(flags)
        break
      default:
        fail(`unknown command "${cmd}". Pass --help for usage.`, { json: flags.json })
    }
  }
  catch (err) {
    fail(err?.message || String(err), {
      json: flags.json,
      details: flags.json ? { stack: err?.stack } : err?.stack,
    })
  }
}

main()

#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const baseURL = process.env.VERIFY_BASE_URL
const artifactDir = process.env.VERIFY_ARTIFACT_DIR
const feature = process.env.VERIFY_FEATURE

if (!baseURL || !artifactDir || !feature) {
  console.error('drive.mjs expects VERIFY_BASE_URL, VERIFY_ARTIFACT_DIR, VERIFY_FEATURE')
  process.exit(2)
}

mkdirSync(artifactDir, { recursive: true })

const logLines = []
function log(line) {
  logLines.push(line)
  console.log(line)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

async function shot(name) {
  const path = `${artifactDir}/${name}`
  await page.screenshot({ path, fullPage: false })
  log(`screenshot ${path}`)
}

async function aria(name, locator) {
  const yaml = await locator.ariaSnapshot()
  const path = `${artifactDir}/${name}`
  writeFileSync(path, yaml)
  log(`aria ${path}`)
}

async function clickUntilUrl(locator, pattern, label) {
  const deadline = Date.now() + 15000
  let lastError = ''
  while (Date.now() < deadline) {
    try {
      await locator.click({ timeout: 3000 })
      await page.waitForURL(pattern, { timeout: 2000 })
      return
    }
    catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
  }
  throw new Error(`${label}: expected ${pattern}, got ${page.url()} (${lastError})`)
}

async function retryUntil(label, fn, timeout = 10000) {
  const deadline = Date.now() + timeout
  let lastError = ''
  while (Date.now() < deadline) {
    try {
      await fn()
      return
    }
    catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
    await page.waitForTimeout(200)
  }
  throw new Error(`${label}: ${lastError}`)
}

try {
  if (feature === 'home') {
    await page.goto(`${baseURL}/`, { waitUntil: 'load' })
    await shot('home-before.png')
    const heading = page.getByRole('heading', { level: 1, name: /Debbie O'Brien/i })
    if (!(await heading.isVisible()))
      throw new Error('home: h1 Debbie O\'Brien missing')
    const tagline = page.getByText('Developer Educator focused on Playwright, testing & AI agents')
    if (!(await tagline.isVisible()))
      throw new Error('home: tagline missing')

    const videos = page.getByRole('region', { name: /Recent Videos/i })
    if (!(await videos.isVisible()))
      throw new Error('home: Recent Videos region missing')
    const videosLink = videos.getByRole('link', { name: /Recent Videos/i })
    if (!/\/videos\/?$/.test(await videosLink.getAttribute('href') || ''))
      throw new Error('home: Recent Videos heading is not a /videos link')

    const blog = page.getByRole('region', { name: /Recent Blog Posts/i })
    if (!(await blog.isVisible()))
      throw new Error('home: Recent Blog Posts region missing')
    const blogCount = await blog.getByRole('article').count()
    if (blogCount !== 6)
      throw new Error(`home: expected 6 blog articles, got ${blogCount}`)

    const podcasts = page.getByRole('region', { name: /Recent Podcasts/i })
    if (!(await podcasts.isVisible()))
      throw new Error('home: Recent Podcasts region missing')
    const podcastCount = await podcasts.getByRole('article').count()
    if (podcastCount !== 2)
      throw new Error(`home: expected 2 podcast articles, got ${podcastCount}`)

    await aria('home.aria.yml', page.getByRole('main'))
    await aria('home-nav.aria.yml', page.getByRole('navigation').first())
    await shot('home-after.png')
    log(`url ${page.url()}`)
    log(`home blog articles ${blogCount}`)
    log(`home podcast articles ${podcastCount}`)
  }
  else if (feature === 'navigation') {
    await page.goto(`${baseURL}/`, { waitUntil: 'load' })
    await shot('navigation-before.png')
    const nav = page.getByRole('navigation')
    const headerLinks = [
      ['About', /\/about\/?$/],
      ['Videos', /\/videos\/?$/],
      ['Podcasts', /\/podcasts\/?$/],
      ['Courses', /\/courses\/?$/],
      ['Blog', /\/blog\/?$/],
    ]
    for (const [name, pattern] of headerLinks) {
      await clickUntilUrl(nav.getByRole('link', { name, exact: true }), pattern, `navigation ${name}`)
    }
    await clickUntilUrl(
      page.getByRole('link', { name: /Debbie O'Brien/i }).first(),
      url => new URL(url).pathname === '/',
      'navigation logo',
    )
    await aria('navigation.aria.yml', nav)
    await shot('navigation-after.png')
    log(`url ${page.url()}`)
  }
  else if (feature === 'blog') {
    await page.goto(`${baseURL}/blog`, { waitUntil: 'load' })
    await shot('blog-before.png')
    const heading = page.getByRole('heading', { name: 'Blog', level: 1 })
    if (!(await heading.isVisible()))
      throw new Error('blog: h1 missing')
    const search = page.getByRole('searchbox', { name: 'Search...' })
    await retryUntil('blog search', async () => {
      await search.fill('playwright')
      await page.getByRole('heading', { name: /Search Results/ }).waitFor({ state: 'visible', timeout: 2000 })
    })
    const results = page.getByRole('heading', { name: /Search Results/ })
    await page.getByRole('article').first().waitFor({ state: 'visible', timeout: 10000 })
    const articleCount = await page.getByRole('article').count()
    if (articleCount < 1)
      throw new Error('blog: search returned no articles')
    await aria('blog.aria.yml', page.getByRole('main'))
    await shot('blog-after.png')
    log(`url ${page.url()}`)
    log(`search heading ${(await results.textContent())?.trim()}`)
    log(`search articles ${articleCount}`)
  }
  else if (feature === 'videos') {
    await page.goto(`${baseURL}/videos`, { waitUntil: 'load' })
    await shot('videos-before.png')
    const heading = page.getByRole('heading', { name: 'Videos', level: 1 })
    if (!(await heading.isVisible()))
      throw new Error('videos: h1 missing')
    const first = page.getByRole('article').first()
    await first.waitFor({ state: 'visible', timeout: 15000 })
    const chip = page.getByRole('link', { name: '#playwright' }).first()
    await clickUntilUrl(chip, /\/videos\/tags\/playwright\/?$/, 'videos tag')
    await page.getByRole('article').first().waitFor({ state: 'visible', timeout: 15000 })
    await aria('videos.aria.yml', page.getByRole('main'))
    await shot('videos-after.png')
    log(`url ${page.url()}`)
  }
  else if (feature === 'about') {
    await page.goto(`${baseURL}/about`, { waitUntil: 'load' })
    await shot('about-before.png')
    const heading = page.getByRole('heading', { name: /I'm Debbie O'Brien/i, level: 1 })
    if (!(await heading.isVisible()))
      throw new Error('about: heading missing')
    const awards = page.getByRole('heading', { name: 'Awards & Achievements', level: 2 })
    if (!(await awards.isVisible()))
      throw new Error('about: awards heading missing')
    const awardCards = page.getByRole('main').getByRole('article')
    const awardCount = await awardCards.count()
    if (awardCount !== 9)
      throw new Error(`about: expected 9 award articles, got ${awardCount}`)
    await aria('about.aria.yml', page.getByRole('main'))
    await shot('about-after.png')
    log(`url ${page.url()}`)
    log(`award articles ${awardCount}`)
  }
  else {
    throw new Error(`unknown feature ${feature}`)
  }
  writeFileSync(`${artifactDir}/${feature}.log`, `${logLines.join('\n')}\n`)
}
finally {
  await browser.close()
}

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

try {
  if (feature === 'home') {
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
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
    await aria('home.aria.yml', page.getByRole('banner'))
    await shot('home-after.png')
    log(`url ${page.url()}`)
  }
  else if (feature === 'navigation') {
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
    await shot('navigation-before.png')
    const nav = page.getByRole('navigation')
    await nav.getByRole('link', { name: 'about' }).click()
    if (!/\/about\/?$/.test(page.url()))
      throw new Error(`navigation: expected /about, got ${page.url()}`)
    await nav.getByRole('link', { name: 'videos' }).click()
    if (!/\/videos\/?$/.test(page.url()))
      throw new Error(`navigation: expected /videos, got ${page.url()}`)
    await nav.getByRole('link', { name: 'blog' }).click()
    if (!/\/blog\/?$/.test(page.url()))
      throw new Error(`navigation: expected /blog, got ${page.url()}`)
    await aria('navigation.aria.yml', nav)
    await shot('navigation-after.png')
    log(`url ${page.url()}`)
  }
  else if (feature === 'blog') {
    await page.goto(`${baseURL}/blog`, { waitUntil: 'networkidle' })
    await shot('blog-before.png')
    const search = page.getByRole('searchbox', { name: 'Search...' })
    await search.fill('playwright')
    const results = page.getByRole('heading', { name: /Search Results/ })
    await results.waitFor({ state: 'visible', timeout: 10000 })
    await aria('blog.aria.yml', page.getByRole('main'))
    await shot('blog-after.png')
    log(`url ${page.url()}`)
    log(`search heading ${(await results.textContent())?.trim()}`)
  }
  else if (feature === 'videos') {
    await page.goto(`${baseURL}/videos`, { waitUntil: 'networkidle' })
    await shot('videos-before.png')
    const heading = page.getByRole('heading', { name: 'Videos', level: 1 })
    if (!(await heading.isVisible()))
      throw new Error('videos: h1 missing')
    const first = page.getByRole('article').first()
    if (!(await first.isVisible()))
      throw new Error('videos: no article')
    await aria('videos.aria.yml', page.getByRole('main'))
    await shot('videos-after.png')
    log(`url ${page.url()}`)
  }
  else if (feature === 'about') {
    await page.goto(`${baseURL}/about`, { waitUntil: 'networkidle' })
    await shot('about-before.png')
    const heading = page.getByRole('heading', { name: /I'm Debbie O'Brien/i, level: 1 })
    if (!(await heading.isVisible()))
      throw new Error('about: heading missing')
    const awards = page.getByRole('heading', { name: 'Awards & Achievements', level: 2 })
    if (!(await awards.isVisible()))
      throw new Error('about: awards heading missing')
    await aria('about.aria.yml', page.getByRole('main'))
    await shot('about-after.png')
    log(`url ${page.url()}`)
  }
  else {
    throw new Error(`unknown feature ${feature}`)
  }
  writeFileSync(`${artifactDir}/${feature}.log`, `${logLines.join('\n')}\n`)
}
finally {
  await browser.close()
}

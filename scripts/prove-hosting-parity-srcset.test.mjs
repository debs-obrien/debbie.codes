/**
 * Unit checks for hosting parity helpers (srcset, 404 bodies, Netlify preview).
 * Run: npm run test:vercel-routes
 */
import { describe, expect, it } from 'vitest'
import {
  compare404Bodies,
  compareHsts,
  decodeHtmlAttr,
  isDeployPreviewHost,
  isNetlifyHost,
  parseSrcsetUrls,
} from './prove-hosting-parity.mjs'

describe('parseSrcsetUrls', () => {
  it('keeps Cloudinary transform commas inside each URL', () => {
    const srcset = [
      'https://res.cloudinary.com/debsobrien/image/upload/w_50,h_50,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n 50w',
      'https://res.cloudinary.com/debsobrien/image/upload/w_100,h_100,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n 100w',
    ].join(', ')
    expect(parseSrcsetUrls(srcset)).toEqual([
      'https://res.cloudinary.com/debsobrien/image/upload/w_50,h_50,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n',
      'https://res.cloudinary.com/debsobrien/image/upload/w_100,h_100,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n',
    ])
  })

  it('keeps podcast c_fill transforms intact', () => {
    const srcset = 'https://res.cloudinary.com/debsobrien/image/upload/w_320,h_180,f_auto,q_auto,c_fill/debbie.codes/podcasts/alexusadays-future-of-testing 320w, https://res.cloudinary.com/debsobrien/image/upload/w_400,h_225,f_auto,q_auto,c_fill/debbie.codes/podcasts/alexusadays-future-of-testing 400w'
    const urls = parseSrcsetUrls(srcset)
    expect(urls).toHaveLength(2)
    expect(urls[0]).toContain('c_fill')
    expect(urls[0]).toContain('w_320,h_180')
    expect(urls.some(u => u === 'h_50' || u === 'f_auto' || u === 'q_auto')).toBe(false)
  })

  it('does not treat bare-comma fragments as URLs (regression)', () => {
    const broken = 'https://res.cloudinary.com/debsobrien/image/upload/w_50,h_50,f_auto,q_auto/debbie.codes/x'
    const buggy = broken.split(',').map(p => p.trim().split(/\s+/)[0])
    expect(buggy.includes('h_50') || buggy.includes('f_auto')).toBe(true)
    expect(parseSrcsetUrls(broken)).toEqual([broken])
  })
})

describe('decodeHtmlAttr', () => {
  it('decodes &amp; in Netlify Image CDN query strings', () => {
    const encoded = 'https://debbie.codes/.netlify/images?url=%2Fx.jpg&amp;w=1200&amp;h=630'
    expect(decodeHtmlAttr(encoded)).toBe(
      'https://debbie.codes/.netlify/images?url=%2Fx.jpg&w=1200&h=630',
    )
  })
})

describe('netlify / preview host detection', () => {
  it('detects Netlify deploy-preview hosts', () => {
    expect(isNetlifyHost('https://deploy-preview-718--debbie-codes.netlify.app')).toBe(true)
    expect(isNetlifyHost('https://debbie-codes.vercel.app')).toBe(false)
    expect(isDeployPreviewHost('https://deploy-preview-718--debbie-codes.netlify.app')).toBe(true)
    expect(isDeployPreviewHost('https://debbie-codes-git-main.vercel.app')).toBe(true)
  })
})

describe('compareHsts', () => {
  it('allowlists includeSubDomains/preload on deploy-preview when max-age matches', () => {
    const ref = 'max-age=31536000'
    const cand = 'max-age=31536000; includeSubDomains; preload'
    expect(compareHsts(ref, cand, 'https://deploy-preview-1--x.netlify.app')).toEqual([])
    expect(compareHsts(ref, cand, 'https://debbie.codes').length).toBeGreaterThan(0)
  })
})

describe('compare404Bodies', () => {
  const themed = `<!DOCTYPE html><html><head><meta name="robots" content="noindex, nofollow" />`
    + `<style>.hamburger li{width:35px}</style><link rel="stylesheet" href="/_nuxt/entry.css">`
    + `${'<!-- pad -->'.repeat(200)}</head>`
    + `<body><div id="__nuxt"></div></body></html>`

  const stub = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
    + '<meta name="robots" content="noindex, nofollow">'
    + '<title>Page not found · Debbie Codes</title></head>'
    + '<body><h1>Page not found</h1><p><a href="/">Home</a></p></body></html>\n'

  it('accepts matching themed SPA shells', () => {
    expect(compare404Bodies(themed, themed)).toEqual([])
  })

  it('rejects the 229 B Vercel stub against a themed reference', () => {
    const issues = compare404Bodies(themed, stub)
    expect(issues.some(i => /nav|chrome|SPA|too small/i.test(i))).toBe(true)
  })
})

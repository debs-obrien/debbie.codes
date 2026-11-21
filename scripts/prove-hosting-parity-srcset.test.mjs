/**
 * Unit checks for srcset URL parsing (Cloudinary commas must stay in the URL).
 * Run: npm run test:vercel-routes
 */
import { describe, expect, it } from 'vitest'
import { parseSrcsetUrls } from './prove-hosting-parity.mjs'

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

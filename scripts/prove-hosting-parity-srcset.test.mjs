#!/usr/bin/env node
/**
 * Unit checks for srcset URL parsing (Cloudinary commas must stay in the URL).
 * Run: node --test scripts/prove-hosting-parity-srcset.test.mjs
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseSrcsetUrls } from './prove-hosting-parity.mjs'

describe('parseSrcsetUrls', () => {
  it('keeps Cloudinary transform commas inside each URL', () => {
    const srcset = [
      'https://res.cloudinary.com/debsobrien/image/upload/w_50,h_50,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n 50w',
      'https://res.cloudinary.com/debsobrien/image/upload/w_100,h_100,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n 100w',
    ].join(', ')
    const urls = parseSrcsetUrls(srcset)
    assert.deepEqual(urls, [
      'https://res.cloudinary.com/debsobrien/image/upload/w_50,h_50,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n',
      'https://res.cloudinary.com/debsobrien/image/upload/w_100,h_100,f_auto,q_auto/debbie.codes/debbie-thumb_clt00n',
    ])
  })

  it('keeps podcast c_fill transforms intact', () => {
    const srcset = 'https://res.cloudinary.com/debsobrien/image/upload/w_320,h_180,f_auto,q_auto,c_fill/debbie.codes/podcasts/alexusadays-future-of-testing 320w, https://res.cloudinary.com/debsobrien/image/upload/w_400,h_225,f_auto,q_auto,c_fill/debbie.codes/podcasts/alexusadays-future-of-testing 400w'
    const urls = parseSrcsetUrls(srcset)
    assert.equal(urls.length, 2)
    assert.ok(urls[0].includes('c_fill'))
    assert.ok(urls[0].includes('w_320,h_180'))
    assert.ok(!urls.some(u => u === 'h_50' || u === 'f_auto' || u === 'q_auto'))
  })

  it('does not treat bare-comma fragments as URLs (regression)', () => {
    const broken = 'https://res.cloudinary.com/debsobrien/image/upload/w_50,h_50,f_auto,q_auto/debbie.codes/x'
    // Old buggy split(','):
    const buggy = broken.split(',').map(p => p.trim().split(/\s+/)[0])
    assert.ok(buggy.includes('h_50') || buggy.includes('f_auto'))
    const fixed = parseSrcsetUrls(broken)
    assert.deepEqual(fixed, [broken])
  })
})

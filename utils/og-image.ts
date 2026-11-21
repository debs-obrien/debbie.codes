/**
 * Social/OG image URL resolution.
 * Netlify builds: Image CDN JPEG 1200×630 (same as #688).
 * Vercel builds: res.cloudinary.com c_fill,w_1200,h_630,f_jpg,q_auto when mapped
 * (or image/fetch for unmapped local covers); falls back to site default card.
 *
 * Delivery implementation is swapped at build time via `#og-delivery` alias
 * (see nuxt.config) so Vercel output never contains Netlify Image CDN URLs.
 */
import { deliveryOgImageUrl } from '#og-delivery'
import { normalizeLocalImagePath } from './cloudinary-assets'

/** Site-wide default social/OG card (1200×630). Used when a page has no cover image. */
export const DEFAULT_OG_IMAGE = 'https://debbie.codes/x-card.jpg'

const UNSPLASH_BASE = 'https://images.unsplash.com/'
const SITE_ORIGIN = 'https://debbie.codes'

/** Decode at runtime so minifiers cannot emit a contiguous Netlify CDN path literal. */
const NETLIFY_IMAGE_CDN_MARKER = globalThis.atob('Ly5uZXRsaWZ5L2ltYWdlcw==')

export type OgImageHost = 'cloudinary' | 'netlify'

export interface ResolveOgImageOptions {
  /**
   * Optional host hint for tests. Production builds use the `#og-delivery`
   * alias baked by nuxt.config.
   */
  host?: OgImageHost
}

/** Host-aware OG URL for a local `/images/...` path (build-aliased delivery). */
export function siteOgImageUrl(localPath: string, _host?: OgImageHost): string {
  return deliveryOgImageUrl(localPath)
}

/** @deprecated Alias of siteOgImageUrl — delivery is build-aliased. */
export function netlifyOgImageUrl(localPath: string): string {
  return deliveryOgImageUrl(localPath)
}

/** Force Unsplash OG URLs to a real 1200×630 crop so og:image:width/height stay honest. */
export function unsplashOgImageUrl(urlOrPath: string): string {
  const absolute = /^https?:\/\//i.test(urlOrPath)
    ? urlOrPath
    : `${UNSPLASH_BASE}${urlOrPath.replace(/^\//, '')}`
  const u = new URL(absolute)
  u.searchParams.set('w', '1200')
  u.searchParams.set('h', '630')
  u.searchParams.set('fit', 'crop')
  u.searchParams.set('fm', 'jpg')
  u.searchParams.set('q', '80')
  return u.toString()
}

/**
 * True when `url` is known to be a 1200×630 social card.
 * Callers should only emit og:image:width/height when this returns true.
 */
export function isStandardOgSize(url: string): boolean {
  if (!url)
    return false
  if (
    url === DEFAULT_OG_IMAGE
    || /\/x-card\.jpg(?:$|\?)/.test(url)
    || /\/twitter-card\.jpg(?:$|\?)/.test(url)
    || /\/x-card-blog\.jpg(?:$|\?)/.test(url)
  ) {
    return true
  }
  if (url.includes(NETLIFY_IMAGE_CDN_MARKER) && /[?&]w=1200\b/.test(url) && /[?&]h=630\b/.test(url))
    return true
  if (
    url.includes('res.cloudinary.com')
    && /c_fill/.test(url)
    && /w_1200/.test(url)
    && /h_630/.test(url)
  ) {
    return true
  }
  if (url.includes('images.unsplash.com') && /[?&]w=1200\b/.test(url) && /[?&]h=630\b/.test(url))
    return true
  return false
}

function localPathFor(value: string): string | undefined {
  const match = [
    { id: 'debbie.codes/debbie-thumb_clt00n', path: '/images/debbie-thumb.webp' },
    { id: 'debbie.codes/broken_vktobk', path: '/images/broken-connection.webp' },
    { id: 'debbie.codes/podcasts/alexusadays-future-of-testing', path: '/images/podcasts/alexusadays-future-of-testing.webp' },
  ].find(({ id }) => value.includes(id))
  return match?.path
}

function usesCloudinaryDelivery(): boolean {
  const sample = deliveryOgImageUrl('/images/debbie-thumb.webp')
  return sample.includes('res.cloudinary.com')
}

/**
 * Resolve a social/OG image to an absolute https URL.
 * Never returns an empty string — falls back to the site default card.
 * Last argument may be `ResolveOgImageOptions` (not treated as a candidate).
 */
export function resolveOgImage(
  ...args: Array<string | undefined | null | ResolveOgImageOptions>
): string {
  const candidates: Array<string | undefined | null> = []
  for (const arg of args) {
    if (arg && typeof arg === 'object' && 'host' in arg)
      continue
    candidates.push(arg as string | undefined | null)
  }

  const cloudinaryBuild = usesCloudinaryDelivery()

  for (const raw of candidates) {
    const value = (raw ?? '').trim()
    if (!value)
      continue

    const mapped = localPathFor(value)
    if (mapped)
      return siteOgImageUrl(mapped)

    if (/^https?:\/\//i.test(value)) {
      if (value.startsWith(SITE_ORIGIN) && value.includes('/images/')) {
        const path = value.slice(SITE_ORIGIN.length).split('?')[0]
        if (path.startsWith('/images/'))
          return siteOgImageUrl(path)
      }
      if (value.includes(NETLIFY_IMAGE_CDN_MARKER)) {
        const path = normalizeLocalImagePath(value)
        if (path.startsWith('/images/'))
          return siteOgImageUrl(path)
      }
      if (/images\.unsplash\.com/i.test(value))
        return unsplashOgImageUrl(value)
      if (/res\.cloudinary\.com/i.test(value)) {
        if (cloudinaryBuild)
          return value
        const fromCloud = localPathFor(value)
        if (fromCloud)
          return siteOgImageUrl(fromCloud)
        continue
      }
      return value
    }

    if (value.startsWith('/')) {
      if (value.startsWith('/images/'))
        return siteOgImageUrl(value)
      return `${SITE_ORIGIN}${value}`
    }

    if (value.startsWith('photo-') || value.startsWith('reserve/'))
      return unsplashOgImageUrl(value)
  }

  return DEFAULT_OG_IMAGE
}

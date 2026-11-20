/** Site-wide default social/OG card (1200×630). Used when a page has no cover image. */
export const DEFAULT_OG_IMAGE = 'https://debbie.codes/x-card.jpg'

const UNSPLASH_BASE = 'https://images.unsplash.com/'
const SITE_ORIGIN = 'https://debbie.codes'

/** Migrated hard-coded assets — match public-id fragment, ignore transforms. */
const LOCAL_BY_PUBLIC_ID: Array<{ id: string, path: string }> = [
  { id: 'debbie.codes/debbie-thumb_clt00n', path: '/images/debbie-thumb.webp' },
  { id: 'debbie.codes/broken_vktobk', path: '/images/broken-connection.webp' },
  { id: 'debbie.codes/podcasts/alexusadays-future-of-testing', path: '/images/podcasts/alexusadays-future-of-testing.webp' },
]

/**
 * Absolute same-origin image URL for OG/Twitter cards.
 * Works on Netlify and Vercel (no `/.netlify/images`, which dies if DNS moves).
 * Repo policy forbids Cloudinary delivery URLs (check-no-cloudinary + tests).
 */
export function siteOgImageUrl(localPath: string): string {
  const path = localPath.startsWith('/') ? localPath : `/${localPath}`
  return `${SITE_ORIGIN}${path}`
}

/** @deprecated Use siteOgImageUrl — kept as alias for older call sites/tests. */
export function netlifyOgImageUrl(localPath: string): string {
  return siteOgImageUrl(localPath)
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
 * True when `url` is known to be a 1200×630 social card (site JPEG or sized Unsplash).
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
  if (url.includes('images.unsplash.com') && /[?&]w=1200\b/.test(url) && /[?&]h=630\b/.test(url))
    return true
  return false
}

function localPathFor(value: string): string | undefined {
  const match = LOCAL_BY_PUBLIC_ID.find(({ id }) => value.includes(id))
  return match?.path
}

/**
 * Resolve a social/OG image to an absolute https URL.
 * Never returns an empty string — falls back to the site default card.
 */
export function resolveOgImage(
  ...candidates: Array<string | undefined | null>
): string {
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
      // Legacy Netlify Image CDN absolute URLs — unwrap to the source path.
      if (value.includes('/.netlify/images')) {
        try {
          const src = new URL(value).searchParams.get('url')
          if (src?.startsWith('/images/'))
            return siteOgImageUrl(src)
        }
        catch {
          // fall through
        }
      }
      if (/images\.unsplash\.com/i.test(value))
        return unsplashOgImageUrl(value)
      // Leave other third-party absolute URLs alone (no guaranteed 1200×630).
      if (!/res\.cloudinary\.com/i.test(value))
        return value
      // Stale Cloudinary absolute URL — try public-id mapping, else skip.
      const fromCloud = localPathFor(value)
      if (fromCloud)
        return siteOgImageUrl(fromCloud)
      continue
    }

    if (value.startsWith('/')) {
      if (value.startsWith('/images/'))
        return siteOgImageUrl(value)
      return `${SITE_ORIGIN}${value}`
    }

    // Unsplash / imgix photo paths stored without the host
    if (value.startsWith('photo-') || value.startsWith('reserve/'))
      return unsplashOgImageUrl(value)
  }

  return DEFAULT_OG_IMAGE
}

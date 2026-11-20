/**
 * Netlify Image CDN OG URLs (Netlify builds only).
 * Vercel builds alias `#og-delivery` to the Cloudinary delivery module instead,
 * so this file (and `/.netlify/images`) never appear in `.vercel/output`.
 */
const SITE_ORIGIN = 'https://debbie.codes'

export function deliveryOgImageUrl(localPath: string): string {
  const path = localPath.startsWith('/') ? localPath : `/${localPath}`
  const params = new URLSearchParams({
    url: path,
    w: '1200',
    h: '630',
    fit: 'cover',
    fm: 'jpg',
    q: '85',
  })
  return `${SITE_ORIGIN}/.netlify/images?${params.toString()}`
}

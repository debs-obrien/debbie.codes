/**
 * Cloudinary OG URLs (Vercel builds only).
 * Mapped public IDs use image/upload. Unmapped local `/images/...` paths use
 * image/fetch of the absolute site URL so OG stays a real 1200×630 card
 * (matches live Netlify Image CDN sizing + og:image:width/height).
 */
import { cloudinaryOgImageUrl } from './cloudinary-assets'

const SITE_ORIGIN = 'https://debbie.codes'
const FETCH_BASE = 'https://res.cloudinary.com/debsobrien/image/fetch'

export function deliveryOgImageUrl(localPath: string): string {
  const cloud = cloudinaryOgImageUrl(localPath)
  if (cloud)
    return cloud
  const path = localPath.startsWith('/') ? localPath : `/${localPath}`
  return `${FETCH_BASE}/c_fill,w_1200,h_630,f_jpg,q_auto/${SITE_ORIGIN}${path}`
}

/**
 * Cloudinary OG URLs (Vercel builds only).
 * Unmapped local paths fall back to absolute same-origin `/images/...`.
 */
import { cloudinaryOgImageUrl } from './cloudinary-assets'

const SITE_ORIGIN = 'https://debbie.codes'

export function deliveryOgImageUrl(localPath: string): string {
  const cloud = cloudinaryOgImageUrl(localPath)
  if (cloud)
    return cloud
  const path = localPath.startsWith('/') ? localPath : `/${localPath}`
  return `${SITE_ORIGIN}${path}`
}

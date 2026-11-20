/**
 * Vercel-only Cloudinary helpers. Netlify keeps local /images + Image CDN.
 * Map is generated from scripts/cloudinary/manifest.json (#688) + #687 aliases.
 */
import mapJson from './cloudinary-public-ids.json'

const CLOUD = 'debsobrien'
const IMAGE_UPLOAD = `https://res.cloudinary.com/${CLOUD}/image/upload`
const VIDEO_UPLOAD = `https://res.cloudinary.com/${CLOUD}/video/upload`

const imageMap = mapJson.images as Record<string, string>
const videoMap = mapJson.videos as Record<string, string>

export function normalizeLocalImagePath(src: string): string {
  const raw = (src || '').trim()
  if (!raw)
    return ''
  if (raw.startsWith('https://debbie.codes/'))
    return raw.slice('https://debbie.codes'.length).split('?')[0] || ''
  // Decode at runtime so Vercel chunks never contain a contiguous CDN path literal.
  if (raw.includes(globalThis.atob('Ly5uZXRsaWZ5L2ltYWdlcw=='))) {
    try {
      const url = new URL(raw, 'https://debbie.codes')
      const path = url.searchParams.get('url') || ''
      return path.startsWith('/') ? path.split('?')[0] : ''
    }
    catch {
      return ''
    }
  }
  if (raw.startsWith('/'))
    return raw.split('?')[0]
  return ''
}

/** Cloudinary public id for a local `/images/...` path, if known (image resources only). */
export function cloudinaryPublicIdFor(src: string): string | undefined {
  const path = normalizeLocalImagePath(src)
  if (!path)
    return undefined
  // Video public IDs are invalid on image/upload — leave unmapped so NuxtImg
  // falls back to the static file in the deploy (posters live under public/).
  return imageMap[path]
}

/**
 * Absolute Cloudinary delivery URL (image).
 * Default transforms match the pre-#688 site: f_auto,q_auto.
 * Public IDs may contain dots (e.g. Screenshot_2021-01-31_at_11.54.39_mlegoc) —
 * never strip those as file extensions.
 */
export function cloudinaryImageUrl(
  publicIdOrLocal: string,
  transforms = 'f_auto,q_auto',
): string {
  const mapped = cloudinaryPublicIdFor(publicIdOrLocal)
  let id = mapped || publicIdOrLocal.trim()
  if (!mapped) {
    const path = normalizeLocalImagePath(publicIdOrLocal)
    if (path)
      id = path.replace(/\.(webp|png|jpe?g|gif|avif)$/i, '')
  }
  const clean = id.replace(/^\//, '')
  return `${IMAGE_UPLOAD}/${transforms}/${clean}`
}

/** OG / Twitter card: 1200×630 fill crop, auto format/quality. */
export function cloudinaryOgImageUrl(localPath: string): string | undefined {
  const id = cloudinaryPublicIdFor(localPath)
  if (!id)
    return undefined
  return `${IMAGE_UPLOAD}/c_fill,w_1200,h_630,f_auto,q_auto/${id}`
}

export function cloudinaryVideoUrl(
  localPath: string,
  transforms = 'f_auto,q_auto',
): string | undefined {
  const id = videoMap[normalizeLocalImagePath(localPath)]
  if (!id)
    return undefined
  return `${VIDEO_UPLOAD}/${transforms}/${id}`
}

export function listMappedImagePaths(): string[] {
  return Object.keys(imageMap)
}

export function getImagePublicIdMap(): Record<string, string> {
  return { ...imageMap }
}

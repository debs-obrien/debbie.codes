/** Site-wide default social/OG card (1200×630). Used when a page has no cover image. */
export const DEFAULT_OG_IMAGE = 'https://debbie.codes/x-card.png'

const CLOUDINARY_UPLOAD_BASE = 'https://res.cloudinary.com/debsobrien/image/upload/'
const UNSPLASH_BASE = 'https://images.unsplash.com/'

/**
 * Resolve a social/OG image to an absolute https URL.
 * Never returns an empty string — falls back to the site default card.
 */
export function resolveOgImage(
  ...candidates: Array<string | undefined | null>
): string {
  for (const raw of candidates) {
    const value = (raw ?? '').trim()
    if (!value) continue

    if (/^https?:\/\//i.test(value)) {
      return value
    }

    if (value.startsWith('/')) {
      return `https://debbie.codes${value}`
    }

    // Cloudinary public IDs used across blog frontmatter (with or without transforms)
    if (
      value.includes('debbie.codes/')
      || /^v\d+\//.test(value)
      || /^(?:f_|c_|fl_|e_|g_|q_|w_|h_)/.test(value)
    ) {
      return `${CLOUDINARY_UPLOAD_BASE}${value.replace(/^\//, '')}`
    }

    // Unsplash / imgix photo paths stored without the host
    if (value.startsWith('photo-') || value.startsWith('reserve/')) {
      return `${UNSPLASH_BASE}${value}`
    }
  }

  return DEFAULT_OG_IMAGE
}

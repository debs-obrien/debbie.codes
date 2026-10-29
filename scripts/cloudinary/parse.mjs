/**
 * Shared Cloudinary URL / public-id parsing for inventory + rewrite.
 */

export const CLOUD_HOST = 'res.cloudinary.com'
export const CLOUD_ACCOUNT = 'debsobrien'
export const PATH_PREFIX = 'debbie.codes/'

/** Transforms that require freezing Cloudinary's crop output. */
const CROP_RE = /\b(?:c_thumb|c_fill|c_lfill|c_crop|g_face|g_auto|ar_\d+)/

/** Delivery transforms we strip when classifying "plain" originals. */
const DELIVERY_ONLY = new Set([
  'f_auto',
  'f_webp',
  'f_jpg',
  'f_png',
  'q_auto',
  'q_80',
  'q_85',
  'q_90',
  'q_95',
  'fl_lossy',
  'e_sharpen',
  'dpr_auto',
  'c_fit',
  'c_limit',
  'c_scale',
])

export function isCropTransform(transform) {
  if (!transform)
    return false
  return CROP_RE.test(transform)
}

export function isDeliveryOnlyTransform(transform) {
  if (!transform)
    return true
  const parts = transform.split('/').flatMap(s => s.split(',').map(p => p.trim()).filter(Boolean))
  return parts.every((p) => {
    if (DELIVERY_ONLY.has(p))
      return true
    if (/^q_\d+$/.test(p))
      return true
    if (p.startsWith('f_'))
      return true
    if (/^w_\d+$/.test(p) || /^h_\d+$/.test(p))
      return true
    if (/^c_(fit|limit|scale)$/.test(p))
      return true
    return false
  })
}

/**
 * Scale crop transforms up for a frozen master (e.g. w_200 → w_800).
 * Keep gravity / aspect / crop mode.
 */
export function enlargeCropTransform(transform, minW = 800) {
  if (!transform)
    return `w_${minW}`
  let foundW = false
  const parts = transform.split(',').map((p) => {
    const m = p.match(/^w_(\d+)$/)
    if (m) {
      foundW = true
      const w = Number(m[1])
      return `w_${Math.max(w, minW)}`
    }
    // Drop delivery format/quality so we get a stable master
    if (p.startsWith('f_') || p.startsWith('q_') || p === 'fl_lossy' || p === 'e_sharpen')
      return null
    return p
  }).filter(Boolean)
  if (!foundW)
    parts.push(`w_${minW}`)
  return parts.join(',')
}

export function transformSlug(transform) {
  if (!transform)
    return ''
  return transform
    .replace(/\//g, '-')
    .replace(/,/g, '-')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Strip leading debbie.codes/ for local path under public/images/content/. */
export function publicIdToRelPath(publicId) {
  let id = publicId.replace(/^\/+/, '')
  if (id.startsWith(PATH_PREFIX))
    id = id.slice(PATH_PREFIX.length)
  return id
}

/**
 * Parse a full Cloudinary delivery URL.
 * @returns {null | {deliveryType, resourceType, transform, version, publicId, ext, fetchTarget}}
 */
export function parseCloudinaryUrl(url) {
  if (!url || typeof url !== 'string')
    return null
  const trimmed = url.trim()
  // image/fetch: .../image/fetch/<transforms>/<remote>
  const fetchMatch = trimmed.match(
    /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/(image|video)\/fetch\/(?:([^/]+(?:\/[^/]+)*?)\/)?(https?:\/\/.+)$/i,
  )
  if (fetchMatch) {
    return {
      account: fetchMatch[1],
      resourceType: fetchMatch[2],
      deliveryType: 'fetch',
      transform: fetchMatch[3] || '',
      version: null,
      publicId: `fetch:${fetchMatch[4]}`,
      ext: null,
      fetchTarget: fetchMatch[4],
      raw: trimmed,
    }
  }

  const m = trimmed.match(
    /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/(image|video)\/(upload)\/(.+)$/i,
  )
  if (!m)
    return null

  const account = m[1]
  const resourceType = m[2]
  const deliveryType = m[3]
  let rest = m[4]

  // Split off extension if present on the last segment
  let ext = null
  const extMatch = rest.match(/\.([a-z0-9]{2,5})$/i)
  if (extMatch) {
    ext = extMatch[1].toLowerCase()
    rest = rest.slice(0, -extMatch[0].length)
  }

  const segments = rest.split('/').filter(Boolean)
  let transform = ''
  let version = null
  let publicIdStart = 0

  // Segments before vNNNN or debbie.codes are transforms (may be multi-segment via /)
  // Cloudinary allows transforms as comma-groups separated by /
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (/^v\d+$/.test(seg)) {
      version = seg.slice(1)
      publicIdStart = i + 1
      // Everything before is transform
      transform = segments.slice(0, i).join('/')
      break
    }
    if (seg === 'debbie.codes' || seg.startsWith('debbie.codes')) {
      publicIdStart = i
      transform = segments.slice(0, i).join('/')
      break
    }
  }

  if (publicIdStart === 0 && !version) {
    // No version and no debbie.codes — treat whole thing as publicId (rare)
    // or first segments as transforms if they look like transforms
    let i = 0
    while (i < segments.length && looksLikeTransformSegment(segments[i])) {
      i++
    }
    transform = segments.slice(0, i).join('/')
    publicIdStart = i
  }

  const publicId = segments.slice(publicIdStart).join('/')
  if (!publicId)
    return null

  return {
    account,
    resourceType,
    deliveryType,
    transform,
    version,
    publicId,
    ext,
    fetchTarget: null,
    raw: trimmed,
  }
}

function looksLikeTransformSegment(seg) {
  // e.g. f_auto,q_auto or c_thumb,w_200,g_face or w_1000,ar_16:9,c_fill,g_auto,e_sharpen
  if (!seg)
    return false
  if (/^v\d+$/.test(seg))
    return false
  const parts = seg.split(',')
  return parts.every(p => /^(?:[a-z]{1,3}_[\w.:-]+|fl_\w+)$/i.test(p))
}

/**
 * Parse a bare frontmatter public id / transform path (no host).
 * Examples:
 *   v1640964235/debbie.codes/blog/foo.jpg
 *   f_auto,q_auto/v1611939855/debbie.codes/blog/Screenshot_...
 *   fl_lossy,f_auto/v1609438516/debbie.codes/blog/livestreams_mg6ulm
 *   debbie.codes/podcasts/coffee-and-open-source
 */
export function parseBarePublicId(value) {
  if (!value || typeof value !== 'string')
    return null
  const rest = value.trim().replace(/^\/+/, '')
  if (/^https?:\/\//i.test(rest))
    return null
  if (rest.startsWith('/images/') || rest.startsWith('photo-') || rest.startsWith('reserve/'))
    return null
  if (!rest.includes('debbie.codes/') && !/^v\d+\//.test(rest) && !looksLikeTransformSegment(rest.split('/')[0]))
    return null

  // Fake a URL so parseCloudinaryUrl can reuse logic
  const fake = `https://res.cloudinary.com/${CLOUD_ACCOUNT}/image/upload/${rest}`
  const parsed = parseCloudinaryUrl(fake)
  if (!parsed)
    return null
  return { ...parsed, raw: value.trim() }
}

export function assetKey({ publicId, transform, resourceType, deliveryType }) {
  const t = transform || ''
  return `${deliveryType}|${resourceType}|${t}|${publicId}`
}

/** Build a download URL for an original (no transforms) or a frozen crop. */
export function buildDownloadUrl({
  resourceType = 'image',
  deliveryType = 'upload',
  version,
  publicId,
  ext,
  transform = '',
}) {
  const parts = [
    `https://res.cloudinary.com/${CLOUD_ACCOUNT}`,
    resourceType,
    deliveryType,
  ]
  if (transform)
    parts.push(transform)
  if (version)
    parts.push(`v${version}`)
  let path = publicId
  if (ext && !path.endsWith(`.${ext}`))
    path = `${path}.${ext}`
  parts.push(path)
  return parts.join('/')
}

/**
 * Local public path for a converted master.
 * @param {{publicId: string, transform?: string, freezeCrop?: boolean, outExt: string}} opts
 */
export function localPublicPath({ publicId, transform = '', freezeCrop = false, outExt }) {
  let rel = publicIdToRelPath(publicId)
  // Drop original extension from publicId if present
  rel = rel.replace(/\.(jpe?g|png|webp|gif|heic|mp4|ogg|mp3|avif)$/i, '')
  if (freezeCrop && transform) {
    const slug = transformSlug(enlargeCropTransform(transform))
    if (slug)
      rel = `${rel}--${slug}`
  }
  return `/images/content/${rel}.${outExt}`
}

/**
 * CommonMark fence blanking — mirrors scripts/check-content.mjs,
 * but preserves character offsets (spaces instead of deleting) so
 * match indices into the original string stay valid.
 */
export function blankFencesAndInline(text) {
  const lines = text.split('\n')
  let fence = null
  let fenceQuoted = false
  return lines.map((line) => {
    const marker = line.match(/^(?:\s*>)*\s*(?:(?:[-*+]|\d+[.)])\s+)?(`{3,}|~{3,})/)
    const quoted = /^\s*>/.test(line)
    if (fence && fenceQuoted && !quoted)
      fence = null
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !line.slice(marker[0].length).trim())
        fence = null
      return ' '.repeat(line.length)
    }
    if (marker && !(marker[1][0] === '`' && line.slice(marker[0].length).includes('`'))) {
      fence = marker[1]
      fenceQuoted = quoted
      return ' '.repeat(line.length)
    }
    // Blank inline code spans with spaces to keep offsets
    return line.replace(/`[^`]*`/g, m => ' '.repeat(m.length))
  }).join('\n')
}

export function splitFrontmatter(text) {
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n'))
    return { frontmatter: '', body: text }
  const end = text.indexOf('\n---', 4)
  if (end === -1)
    return { frontmatter: '', body: text }
  const fm = text.slice(4, end)
  const body = text.slice(end + 4).replace(/^\r?\n/, '')
  return { frontmatter: fm, body }
}

/**
 * @nuxt/image provider for Vercel: map local `/images/...` paths to Cloudinary
 * public IDs (manifest from #688), then emit res.cloudinary.com URLs.
 * Unmapped local paths fall back to same-origin static files in the deploy.
 */
import { createOperationsGenerator } from '#image'
import { joinURL } from 'ufo'
import { cloudinaryPublicIdFor } from '../utils/cloudinary-assets'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'c',
    width: 'w',
    height: 'h',
    format: 'f',
    quality: 'q',
    background: 'b',
    gravity: 'g',
    dpr: 'dpr',
  },
  valueMap: {
    fit: {
      fill: 'fill',
      cover: 'fill',
      contain: 'fit',
      inside: 'fit',
      outside: 'fit',
      thumbnail: 'thumb',
    },
    format: {
      jpeg: 'jpg',
    },
  },
  joinWith: ',',
  formatter: (key: string, value: string) => `${key}_${value}`,
})

const defaultModifiers = {
  format: 'auto',
  quality: 'auto',
}

export function getImage(
  src: string,
  { modifiers = {}, baseURL = 'https://res.cloudinary.com/debsobrien/image/upload/' } = {},
) {
  const publicId = cloudinaryPublicIdFor(src)
  if (!publicId) {
    // Not on Cloudinary — serve the static file from this deployment.
    const path = src.startsWith('/') ? src : `/${src}`
    return { url: path }
  }

  // Always f_auto,q_auto on Cloudinary (pre-#688 delivery). Keep size/fit from NuxtImg.
  const mergeModifiers = {
    ...modifiers,
    ...defaultModifiers,
    format: 'auto',
    quality: 'auto',
  }
  const operations = operationsGenerator(mergeModifiers) || 'f_auto,q_auto'
  const id = publicId.replace(/^\//, '')
  return {
    url: joinURL(baseURL, operations, id),
  }
}

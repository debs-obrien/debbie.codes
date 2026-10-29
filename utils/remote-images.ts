/**
 * Hosts allowed through Netlify Image CDN (`netlify.toml` → `images.remote_images`).
 * Keep in sync — `tests/remote-images-allowlist.spec.ts` asserts equality.
 */
export const NETLIFY_REMOTE_IMAGE_HOSTS = [
  'dev-to-uploads.s3.amazonaws.com',
  'raw.githubusercontent.com',
  'theaiplatform.app',
] as const

export function isNetlifyRemoteImageHost(hostname: string): boolean {
  return (NETLIFY_REMOTE_IMAGE_HOSTS as readonly string[]).includes(hostname)
}

/** True when `src` is an absolute URL whose host is in the Netlify allowlist. */
export function isAllowedNetlifyRemoteSrc(src: string): boolean {
  try {
    const host = new URL(src, 'https://debbie.codes').hostname
    return isNetlifyRemoteImageHost(host)
  }
  catch {
    return false
  }
}

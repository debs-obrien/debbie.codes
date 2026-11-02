/**
 * Hosts allowed through Netlify Image CDN (`netlify.toml` → `images.remote_images`).
 * Single source of truth — `tests/remote-images-allowlist.spec.ts` asserts
 * `netlify.toml` patterns match `netlifyRemoteImagePatterns()`.
 */
export const NETLIFY_REMOTE_IMAGE_HOSTS = [
  'dev-to-uploads.s3.amazonaws.com',
  'raw.githubusercontent.com',
  'theaiplatform.app',
] as const

/** Escape a hostname for use inside a Netlify `remote_images` regex. */
function escapeRemoteImageHost(host: string): string {
  return host.replace(/\./g, '\\.')
}

/**
 * Anchored Netlify Image CDN allowlist patterns (docs: single-quoted regex).
 * Shape: `^https://host\.tld/.*$` — full-string match so an allowed host
 * nested in another URL's query cannot match.
 */
export function netlifyRemoteImagePatterns(
  hosts: readonly string[] = NETLIFY_REMOTE_IMAGE_HOSTS,
): string[] {
  return hosts.map(host => `^https://${escapeRemoteImageHost(host)}/.*$`)
}

/** True when `url` matches at least one Netlify `remote_images` pattern. */
export function matchesNetlifyRemoteImagePattern(
  url: string,
  patterns: readonly string[] = netlifyRemoteImagePatterns(),
): boolean {
  return patterns.some(pattern => new RegExp(pattern).test(url))
}

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

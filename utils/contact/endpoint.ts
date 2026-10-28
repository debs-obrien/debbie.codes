/**
 * Client-side endpoint picker: Netlify Function in production/preview,
 * Nitro mirror during `nuxt dev`.
 */
export function contactApiEndpoint(): string {
  if (import.meta.dev)
    return '/api/contact'
  return '/.netlify/functions/contact'
}

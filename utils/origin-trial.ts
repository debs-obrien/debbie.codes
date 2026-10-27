import process from 'node:process'

/**
 * WebMCP origin-trial tokens for https://debbie.codes (no subdomains).
 * Chrome token expires 2027-03-30. Edge token expires 2026-12-11
 * (renewable until 2027-03-30).
 */
export const DEFAULT_WEBMCP_OT_CHROME = 'As9KF+YqNrjikGTl8tlih4WtqIzUWMjc4CkxM6XsJZaZaehkgQ902yMxcFaR76o+rHl84HIf9rAKTv0k4ukAngQAAABMeyJvcmlnaW4iOiJodHRwczovL2RlYmJpZS5jb2Rlczo0NDMiLCJmZWF0dXJlIjoiV2ViTUNQIiwiZXhwaXJ5IjoxODA2MzY0ODAwfQ=='
export const DEFAULT_WEBMCP_OT_EDGE = 'A0kUI/pB+i5YUKS/9nelWTG+emfrYoBuAQxmN22fsAGhYwA7F95iaOcT+HQUNxCbKdfrs4eyBtreybnJUdAwFKAAAABMeyJvcmlnaW4iOiJodHRwczovL2RlYmJpZS5jb2Rlczo0NDMiLCJmZWF0dXJlIjoiV2ViTUNQIiwiZXhwaXJ5IjoxNzk2OTgxMDg4fQ=='

/** Netlify production only. Tokens are bound to debbie.codes and do nothing on previews. */
export function shouldRenderOriginTrial(env: Record<string, string | undefined> = process.env) {
  if (env.NUXT_PUBLIC_WEBMCP_OT_RENDER === '0')
    return false
  if (env.NUXT_PUBLIC_WEBMCP_OT_RENDER === '1')
    return true
  return env.CONTEXT === 'production'
}

export function originTrialMeta(chrome: unknown, edge: unknown) {
  return [chrome, edge].flatMap((token) => {
    if (typeof token !== 'string')
      return []
    const content = token.trim()
    if (!content)
      return []
    return [{
      'http-equiv': 'origin-trial',
      'content': content,
      'key': `origin-trial:${content}`,
    }]
  })
}

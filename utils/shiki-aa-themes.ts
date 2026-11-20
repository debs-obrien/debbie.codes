/**
 * github-light / github-dark with only the token foregrounds that fail WCAG AA
 * 4.5:1 on this site's code-block backgrounds overridden.
 *
 * Light pre background: #f8f9fa (assets/css/main.css)
 * Dark pre background:  #1e1e1e
 */
import type { ThemeRegistration, ThemeRegistrationRaw } from '@shikijs/types'
import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'

/** Map of failing theme foreground → AA-safe replacement (lowercase keys). */
const LIGHT_FG_FIXES: Record<string, string> = {
  // keyword / storage: was #d73a49 at ~4.34:1
  '#d73a49': '#cf222e', // ~5.08:1 on #f8f9fa
  // variable / changed markup: was #e36209 at ~3.31:1
  '#e36209': '#b45309', // ~4.76:1 on #f8f9fa
  // entity.name.tag / inserted markup: was #22863a at ~4.39:1
  '#22863a': '#1b6f30', // ~5.92:1 on #f8f9fa
}

const DARK_FG_FIXES: Record<string, string> = {
  // comments: was #6a737d at ~3.46:1 on #1e1e1e
  '#6a737d': '#8b949e', // ~5.42:1 on #1e1e1e
}

function withForegroundFixes(
  theme: ThemeRegistration | ThemeRegistrationRaw,
  name: string,
  fixes: Record<string, string>,
): ThemeRegistrationRaw {
  const tokenColors = (theme.tokenColors ?? []).map((rule) => {
    const fg = rule.settings?.foreground
    if (!fg)
      return rule
    const next = fixes[fg.toLowerCase()]
    if (!next)
      return rule
    return {
      ...rule,
      settings: {
        ...rule.settings,
        foreground: next,
      },
    }
  })

  return {
    ...theme,
    name,
    displayName: name,
    tokenColors,
  } as ThemeRegistrationRaw
}

export const githubLightAa = withForegroundFixes(
  githubLight,
  'github-light-aa',
  LIGHT_FG_FIXES,
)

export const githubDarkAa = withForegroundFixes(
  githubDark,
  'github-dark-aa',
  DARK_FG_FIXES,
)

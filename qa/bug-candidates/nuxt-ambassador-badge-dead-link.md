---
fingerprint: prod|/|nuxt-ambassador-dead-link
url: https://debbie.codes/
target: production
severity: minor
confidence: high
classification: bug
area: home
fix_surface: app
---

# Nuxt Ambassador badge links to a dead teams URL

## Repro

1. Open https://debbie.codes/
2. In the hero awards row, open “Nuxt Ambassador” → `https://nuxtjs.org/teams/`
3. Follow redirects; current Nuxt site teams URL 404s.

## Expected

Badge links to a live Nuxt team/ambassador page.

## Actual

**2026-08-07:** `https://nuxtjs.org/teams/` redirected; `https://nuxt.com/teams` 404d. Hardcoded in `components/CreativeHero.vue` and `pages/about.vue`.

**2026-09-07 recheck:** **appears fixed**. Home awards row shows **Nuxt Ambassador** as plain text (not a link). About page has no ambassador teams URL. Likely addressed in site scout hygiene (#616).

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-08-07; recheck 2026-09-07

## Suggested next step

- [x] Fix via site-bugfix — resolved on production as of 2026-09-07
- [ ] Needs human
- [ ] Defer

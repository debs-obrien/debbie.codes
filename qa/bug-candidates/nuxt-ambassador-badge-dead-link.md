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

- `https://nuxtjs.org/teams/` redirects; `https://nuxt.com/teams` returns 404
- Hardcoded in `components/CreativeHero.vue` and `pages/about.vue`

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-08-07

## Suggested next step

- [x] Fix via site-bugfix — update URL or unlink badge
- [ ] Needs human
- [ ] Defer

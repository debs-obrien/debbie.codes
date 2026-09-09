---
fingerprint: prod|/404|document-title-homepage
url: https://debbie.codes/totally-missing-page-zurich-demo
target: production
severity: nit
confidence: high
classification: bug
area: other
fix_surface: app
---

# Unknown routes keep the homepage document title

## Repro

1. Open a missing URL, e.g. https://debbie.codes/totally-missing-page-zurich-demo
2. Confirm HTTP **404** and the in-page heading **Ooops looks like that page doesn't exist**
3. Read `document.title` / `<title>`

## Expected

A 404-specific title (e.g. `Page not found · Debbie Codes`).

## Actual

`document.title` is the homepage SEO string:  
`Debbie codes and helps others learn AI agents, Playwright, testing, React, Nuxt and more`  
`og:title` matches the homepage as well. Body copy/CTA (`Take me there!` → `/`) are fine.

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-09-07; hard navigation returns HTTP 404 with wrong title. Soft/client paths can also show `· Debbie Codes`.
- Artifact: `/opt/cursor/artifacts/404_wrong_document_title.png`

## Suggested next step

- [ ] Fix via site-bugfix — set error-page `useSeoMeta` / title in the Nuxt error view
- [ ] Needs human
- [ ] Defer — SEO polish

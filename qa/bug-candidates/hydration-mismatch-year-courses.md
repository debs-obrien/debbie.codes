---
fingerprint: prod|/blog/year/2026|hydration-mismatch
url: https://debbie.codes/blog/year/2026/
target: production
severity: nit
confidence: medium
classification: inconclusive
area: blog
fix_surface: app
---

# Hydration mismatch warnings on year and courses pages

## Repro

1. Open https://debbie.codes/blog/year/2026/
2. Open https://debbie.codes/courses/
3. Check browser console.

## Expected

No hydration errors on content listing pages.

## Actual

Console: `Hydration completed but contains mismatches.` Pages still render. User-visible impact unclear.

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-08-07

## Suggested next step

- [ ] Fix via site-bugfix
- [ ] Needs human
- [x] Defer — polish unless correlated with a visible glitch

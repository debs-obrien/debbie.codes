---
fingerprint: prod|/|mobile-duplicate-close-menu
url: https://debbie.codes/
target: production
severity: minor
confidence: high
classification: bug
area: nav
fix_surface: app
---

# Mobile menu exposes two “Close menu” buttons

## Repro

1. Open https://debbie.codes/ at a mobile viewport (e.g. 390×844).
2. Tap **Open menu**.
3. Inspect the accessibility tree / query `button[aria-label="Close menu"]`.

## Expected

One clear control to dismiss the mobile menu.

## Actual

Two visible buttons both labeled **Close menu**:

- Overlay control: `✕` (`aria-label="Close menu"`, no `aria-expanded`)
- Header hamburger toggle flipped to `X` (`aria-label="Close menu"`, `aria-expanded="true"`)

Both work, but screen-reader users hear duplicate dismiss controls. Source: `components/TheTopBar.vue` (header toggle + teleported overlay close).

## Evidence

- Viewport: 390×844
- Notes: hunt session 2026-09-07 (ZurichJS talk prep). Snapshot confirms two Close menu buttons while the drawer is open.
- Artifact: `/opt/cursor/artifacts/mobile_duplicate_close_menu.png`

## Suggested next step

- [ ] Fix via site-bugfix — keep a single close control (prefer overlay ✕ *or* header toggle, not both)
- [ ] Needs human
- [ ] Defer

## Talk notes (ZurichJS)

Best **15-minute live/clip demo** from this hunt: tiny Vue change, obvious before/after a11y tree, no content archaeology. Classify as `minor` so it does **not** auto-file under honesty gates — elevate manually for the talk if desired.

---
fingerprint: prod|/videos|youtube-thumb-404
url: https://debbie.codes/videos/
target: production
severity: minor
confidence: high
classification: bug
area: videos
fix_surface: content
---

# Some video cards show broken YouTube thumbnails (404)

## Repro

1. Open https://debbie.codes/videos/
2. Watch network/console while thumbnails load.
3. Note 404s for specific video IDs’ `hqdefault` / `sddefault` assets.

## Expected

Every video card shows a valid thumbnail (or a deliberate placeholder).

## Actual

Console errors for IDs including `Ul00M-j9XaU` and `pOZas9RPJcY` (404 from `i.ytimg.com`).

Mapped content:

| Video ID | Content file |
|----------|----------------|
| `Ul00M-j9XaU` | `content/videos/whats-new-in-sofware-advocacy.md` |
| `pOZas9RPJcY` | `content/videos/women-in-tech-panel.md` |

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-08-07

## Suggested next step

- [x] Fix via site-bugfix — update/remove entries or fallback image
- [ ] Needs human
- [ ] Defer

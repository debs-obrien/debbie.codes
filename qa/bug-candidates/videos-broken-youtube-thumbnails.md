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

**2026-08-07 hunt:** console errors for IDs `Ul00M-j9XaU` and `pOZas9RPJcY`.

**2026-09-07 hunt:** those content files are gone from the repo. A full scan of `content/videos/*/video:` IDs found **one remaining** dead thumb: `H793eyVM_04` (see `videos-jamstack-conf-dead-youtube.md`). Pages 1–5 of `/videos` were clean in this run.

| Video ID | Content file | Status 2026-09-07 |
|----------|----------------|-------------------|
| `Ul00M-j9XaU` | `content/videos/whats-new-in-sofware-advocacy.md` | content removed |
| `pOZas9RPJcY` | `content/videos/women-in-tech-panel.md` | content removed |
| `H793eyVM_04` | `content/videos/static-sites-great-performance-jamstack-conf.md` | still broken on `/videos/page/6/` |

## Evidence

- Viewport: 1280×800
- Notes: original hunt 2026-08-07; follow-up 2026-09-07

## Suggested next step

- [x] Fix via site-bugfix — older IDs removed; finish with `H793eyVM_04`
- [ ] Needs human
- [ ] Defer

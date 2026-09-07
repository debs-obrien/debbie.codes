---
fingerprint: prod|/videos|youtube-thumb-404-H793eyVM_04
url: https://debbie.codes/videos/page/6/
target: production
severity: minor
confidence: high
classification: bug
area: videos
fix_surface: content
---

# Jamstack Conf 2019 video card has a dead YouTube ID (broken thumb)

## Repro

1. Open https://debbie.codes/videos/page/6/
2. Find the card **Static generated sites === great performance. What are you waiting for?**
3. Observe missing thumbnail; console/network show `404` for `https://i.ytimg.com/vi/H793eyVM_04/hqdefault.jpg`
4. YouTube oEmbed for `H793eyVM_04` returns **Not Found** (video removed/private).

## Expected

Card shows a valid thumbnail, or the entry is removed / replaced with an available recording.

## Actual

`lite-youtube` background uses a 404 image. Content file still points at the dead ID:

| Video ID | Content file |
|----------|----------------|
| `H793eyVM_04` | `content/videos/static-sites-great-performance-jamstack-conf.md` |

Talk still documented elsewhere (e.g. hero35 JAMstack Conf 2019 listing) but this YouTube ID is gone.

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-09-07; console `Failed to load resource: 404 @ …/H793eyVM_04/hqdefault.jpg`
- Artifact: `/opt/cursor/artifacts/videos_page6_broken_thumb.png`
- Prior candidate `videos-broken-youtube-thumbnails.md` listed older IDs whose content files are already gone; this is a **new** remaining ID.

## Suggested next step

- [ ] Fix via site-bugfix — replace video ID if a public upload exists, or remove/hide the entry
- [ ] Needs human — confirm preferred archival source
- [ ] Defer

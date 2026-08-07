---
fingerprint: prod|/blog/an-agent-that-hunts-bugs-while-i-sleep|netlify-image-400
url: https://debbie.codes/blog/an-agent-that-hunts-bugs-while-i-sleep/
target: production
severity: major
confidence: high
classification: bug
area: blog
fix_surface: content
---

# Blog post images fail via Netlify Image CDN (theaiplatform.app not allowed)

## Repro

1. Open https://debbie.codes/blog/an-agent-that-hunts-bugs-while-i-sleep/
2. Scroll to inline images (`loop-diagram.png`, `bug-after.png`).
3. Observe broken images; console shows Netlify Image CDN `400` errors.

## Expected

Inline article images load and display.

## Actual

Images have `naturalWidth: 0`. Console:

```text
Failed to load resource: 400 @ https://debbie.codes/.netlify/images?q=80&url=https://theaiplatform.app/blog/.../loop-diagram.png
```

CDN response body:

```json
{"code":400,"msg":"url (https://theaiplatform.app/blog/.../loop-diagram.png) is not an allowed pattern"}
```

Source images on `theaiplatform.app` return HTTP 200 when fetched directly — the block is the Netlify allowlist, not missing files.

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-08-07; `.playwright-cli/console-2026-08-07T06-36-15-611Z.log`

## Suggested next step

- [x] Fix via site-bugfix — host images on Cloudinary / `public/` or allowlist `theaiplatform.app` in Netlify Image CDN remote patterns
- [ ] Needs human
- [ ] Defer

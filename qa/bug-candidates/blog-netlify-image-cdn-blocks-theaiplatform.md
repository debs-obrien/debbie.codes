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

**2026-08-07:** Images had `naturalWidth: 0`. Console:

```text
Failed to load resource: 400 @ https://debbie.codes/.netlify/images?q=80&url=https://theaiplatform.app/blog/.../loop-diagram.png
```

CDN response body:

```json
{"code":400,"msg":"url (https://theaiplatform.app/blog/.../loop-diagram.png) is not an allowed pattern"}
```

**2026-09-07 recheck:** **appears fixed**. Same URLs return HTTP 200 via `/.netlify/images`; both figures report `naturalWidth: 1280`; console clean. Keep this file for talk history / regression awareness.

## Evidence

- Viewport: 1280×800
- Notes: hunt session 2026-08-07; `.playwright-cli/console-2026-08-07T06-36-15-611Z.log`
- Recheck 2026-09-07: images healthy on production

## Suggested next step

- [x] Fix via site-bugfix — resolved on production as of 2026-09-07
- [ ] Needs human
- [ ] Defer

# Candidate / issue body template

Use this structure for `qa/bug-candidates/*.md` and for GitHub issue bodies.

```markdown
---
fingerprint: prod|/path|short-slug
url: https://debbie.codes/path
target: production
severity: major
confidence: high
classification: bug
area: blog
fix_surface: content
---

# Short title

## Repro

1. …
2. …

## Expected

…

## Actual

…

## Evidence

- Viewport:
- Notes (console/network/snapshot):

## Suggested next step

- [ ] Fix via site-bugfix
- [ ] Needs human
- [ ] Defer
```

### Field notes

- `fix_surface`: `content` (files under `content/`) or `app` (`pages/`, `components/`, config) or `mixed`
- `area`: `home` | `blog` | `videos` | `podcasts` | `courses` | `about` | `nav` | `theme` | `other`
- `target`: `production` | `local` | `preview`

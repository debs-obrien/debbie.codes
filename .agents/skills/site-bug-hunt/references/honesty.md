# Honesty taxonomy (site-bug-hunt)

Classify every finding before you write a candidate or file an issue. **Noise is worse than silence.**

## Classifications

| Classification | Meaning | File issue in CI? |
|----------------|---------|-------------------|
| `bug` | Product is genuinely broken for a user | Yes, if confidence=`high` and severity allows |
| `expected-bad-ux` | Works as designed but feels wrong | No (local candidate only if useful) |
| `env` | Environment, CDN allowlist, third-party outage, local-only | No unless it is clearly a misconfiguration *in this repo* you can fix |
| `test-gap` | Missing automated coverage, not a live failure | No |
| `inconclusive` | Suspicious but not confirmed this run | No |

## Confidence

| Level | Meaning |
|-------|---------|
| `high` | Reproduced in this run with clear steps |
| `medium` | Likely, but one uncertainty remains |
| `low` | Suspicious only |

**CI rule:** file GitHub issues only when `classification=bug` **and** `confidence=high`.

## Severity (CI filing)

| Severity | CI files issue? |
|----------|-----------------|
| `blocker` | Yes |
| `major` | Yes |
| `minor` | Only if `SITE_BUG_HUNT_ALLOW_MINOR=1` |
| `nit` | Never in CI (local candidate OK) |

## Caps

- Max **3** new GitHub issues per CI hunt run
- Prefer user-impacting journey breaks over polish

## Fingerprint

Stable dedupe key:

```text
<target>|<path-or-area>|<short-symptom-slug>
```

Examples:

- `prod|/blog/an-agent-that-hunts-bugs-while-i-sleep|netlify-image-400`
- `prod|/videos|youtube-thumb-404-Ul00M-j9XaU`
- `prod|/|nuxt-ambassador-dead-link`

Before filing, search open issues for the same `fingerprint:` string. Skip if found.

# Autonomous site QA (debbie.codes)

Hunt bugs on the live site → file high-confidence GitHub issues → fix with a draft PR.  
Inspired by [An Agent That Hunts Bugs While I Sleep](https://debbie.codes/blog/an-agent-that-hunts-bugs-while-i-sleep).

## Selective CI (Playwright)

| Phase | Status | What it does |
|-------|--------|--------------|
| **0** | Done | CI workers = 2; `@smoke` tags on home + nav + one content + one redirect |
| **1** | Done | Path→group mapper + job summary dry-run |
| **2** | **This** | `playwright.yml` on **pull_request** runs only the planned set (`@smoke` files ∪ group specs), or full when fail-closed. Push to **main** stays full. |

### What runs where

| Workflow / event | Suite |
|------------------|--------|
| `playwright.yml` on **PR** | **Selective** when the map says so; **full** when fail-closed / unknown / shared globs |
| `playwright.yml` on **push to main** | **Full** (no path filter) |
| `preview-tests.yml` on PR | **Full** against Netlify preview (safety net — do not thin) |
| `endform-tests.yml` on PR | **Full** (unchanged this phase; thinning is a later phase) |

### Planner (local)

```bash
# Against main (same idea as CI)
node qa/scripts/selective-ci-plan.mjs --base main

# Or origin/main after fetching
git fetch origin main
node qa/scripts/selective-ci-plan.mjs --base origin/main

# Fake a content-only PR without committing:
node qa/scripts/selective-ci-plan.mjs --files content/blog/example.md
# → mode=selective, groups=blog, @smoke files ∪ blog specs, shard_total=1

# Shared layout change → fail closed to full suite:
node qa/scripts/selective-ci-plan.mjs --files layouts/default.vue
# → mode=full, shard_total=4

# Dry-run summary only (Phase 1 behavior; no GITHUB_OUTPUT writes):
node qa/scripts/selective-ci-plan.mjs --files content/blog/example.md --summary

# Enforce outputs (what CI uses):
node qa/scripts/selective-ci-plan.mjs --files content/blog/example.md --summary --enforce
```

Map: [`qa/selective-ci/path-group-map.json`](./selective-ci/path-group-map.json). Unknown paths and shared surfaces (`components/**`, `layouts/**`, `nuxt.config.*`, CSS/assets, `composables/**`, `server/**`, `public/**`, content helpers, workflows, `tests/**`, …) always → **full suite**. Selective always unions mapped group files with specs that declare `@smoke`.

CI: `playwright.yml` runs a `plan` job that writes the plan to `$GITHUB_STEP_SUMMARY` and emits `mode` / `test_files` / `shards`. Selective PRs use **1 shard**; full uses **4**.

### How to verify Phase 2

1. **Blog-only PR** (e.g. only `content/blog/...`): local GHA Playwright job summary shows `mode=selective`, fewer files, 1 shard; preview + Endform still run the full suite.
2. **Layout / shared change** (e.g. `layouts/default.vue`): local GHA shows `mode=full`, 4 shards; preview stays full.
3. **Push to main**: local GHA always full (plan job summary says path-filter is PR-only).

**Skills are the playbook** (work in Cursor locally).  
**GitHub Actions + Copilot** is the scheduled adapter (optional).

```text
site-bug-hunt  →  GitHub Issues (agent-hunt)  →  site-bugfix  →  draft PR  →  you merge
```

## Local (Cursor) — start here

No Copilot token required. You need `playwright-cli` (`npm install -g @playwright/cli`).

### Hunt

```text
Run the site-bug-hunt skill against https://debbie.codes (production).
Write candidates under qa/bug-candidates/. Do not file GitHub issues.
```

Or against local dev (`npm run dev` on port 8000):

```text
Run the site-bug-hunt skill against http://127.0.0.1:8000.
Write candidates under qa/bug-candidates/. Do not file GitHub issues.
```

To file issues from chat (same honesty gates as CI):

```text
Run site-bug-hunt on production and file GitHub issues for high-confidence major/blocker bugs only.
```

### Fix

```text
Fix the bug described in qa/bug-candidates/<file>.md using the site-bugfix skill.
Reproduce in the browser first. Do not open a PR unless I ask.
```

```text
Fix GitHub issue #<n> using site-bugfix. Reproduce first, then open a draft PR with Closes #<n>.
```

Skills live at:

- [`.agents/skills/site-bug-hunt/`](../.agents/skills/site-bug-hunt/)
- [`.agents/skills/site-bugfix/`](../.agents/skills/site-bugfix/)

## CI (GitHub Actions + Copilot)

| Workflow | Schedule | What it does |
|----------|----------|--------------|
| [agent-bug-hunt.yml](../.github/workflows/agent-bug-hunt.yml) | Sundays 06:00 UTC + manual | Copilot CLI runs hunt → files issues |
| [agent-bug-fix.yml](../.github/workflows/agent-bug-fix.yml) | Daily 07:00 UTC + manual | Assigns Copilot to one issue (CLI fallback) → draft PR |

### Secret

Create a fine-grained PAT (user token) with access to this repo and **Copilot Requests**, plus issues/contents/PRs as needed for filing and assignment. Store it as:

```text
COPILOT_GITHUB_TOKEN
```

`GITHUB_TOKEN` alone is usually **not** enough to assign the Copilot coding agent (billing is tied to a user).

### Labels

Create these labels in the repo (once):

| Label | Purpose |
|-------|---------|
| `bug` | Bug report |
| `agent-hunt` | Filed / claimed by the autonomous loop |
| `severity:blocker` / `severity:major` / `severity:minor` | Severity |
| `needs-human` | Fixer could not reproduce / needs judgment |
| `agent-fix` | Optional manual boost (future use) |

### Dry-run before enabling trust

1. Run hunt **locally** in Cursor against production.  
2. Actions → **Agent bug hunt** → Run workflow.  
3. Confirm issues look high-signal (not noisy).  
4. Actions → **Agent bug fix** → Run workflow (or assign Copilot on one issue).  
5. Review the **draft** PR; mark ready and merge yourself.

Schedules are already in the workflow files; they no-op harmlessly until `COPILOT_GITHUB_TOKEN` is set and labels exist. Public repo schedules pause after ~60 days without repo activity — poke the repo or use `workflow_dispatch`.

## Honesty rules (why this stays trustworthy)

See [honesty.md](../.agents/skills/site-bug-hunt/references/honesty.md):

- File only `bug` + `confidence=high`
- CI files `blocker`/`major` only by default
- Max 3 issues per hunt; max 1 draft PR per fix run
- Fingerprint dedupe across weeks
- Reproduce before fix — or comment and stop

## Swap runners later

Replace the Copilot CLI / assign steps with Cursor Automations or Claude Code Action; keep the skills and `qa/prompts/*.md` prompts. The playbook does not depend on Copilot.

## Layout

```text
qa/
├── README.md                 ← you are here
├── bug-candidates/           ← local hunt output
├── prompts/
│   ├── hunt.md               ← CI hunt prompt
│   └── fix.md                ← CI fix prompt
├── selective-ci/
│   └── path-group-map.json   ← path→test-group map (Phase 2 enforce on playwright.yml PRs)
└── scripts/
    ├── select-fix-issue.sh   ← pick one eligible issue
    └── selective-ci-plan.mjs ← planner (--summary dry-run / --enforce for CI)
```

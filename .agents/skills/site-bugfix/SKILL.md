---
name: site-bugfix
description: >-
  Reproduce and fix a debbie.codes site bug with browser proof and a Playwright
  regression when useful. Use for site-bugfix, fixing qa/bug-candidates, or
  repairing agent-hunt GitHub issues. Local: PR only if asked. CI: draft PR on
  agent/fix-issue-<n> with Closes #N. Reproduce before any code change.
---

# Site bugfix (debbie.codes)

Take a known bug from **repro → fix → verify → regress**. Complements `site-bug-hunt`.

## Quick start (local)

```text
Fix the bug described in qa/bug-candidates/<file>.md using the site-bugfix skill.
Reproduce in the browser first. Do not open a PR unless I ask.
```

```text
Fix GitHub issue #<n> using site-bugfix. Reproduce first, then open a draft PR with Closes #<n>.
```

## Modes

| Mode | Behavior |
|------|----------|
| **interactive** (default) | Fix from candidate path, issue URL/number, or description. Open a PR **only if the user asks**. |
| **ci** (`SITE_BUG_FIX_MODE=ci`) | Select one eligible open issue → branch `agent/fix-issue-<n>` → draft PR with `Closes #N`. Max **1** PR per run. |

## Tooling

- **Browser:** `playwright-cli` (load the `playwright-cli` skill)  
- **Tests:** `npx playwright test` / `npm test` (base URL from `playwright.config.ts`)  
- **GitHub:** `gh` for issues/PRs  

## Eligible issues (CI)

Pick the oldest open issue that has:

- Labels including `bug` and `agent-hunt` (or body containing agent-hunt fingerprint frontmatter)
- Not assigned to a human who is actively working it (Copilot assignee OK to continue)
- No open PR that already closes it (`Closes #n` / `Fixes #n`)

Prefer higher severity labels when present (`severity:blocker` / `severity:major`).

If none: exit successfully with “no eligible issues.”

## Structured input

Prefer candidates/issues that include YAML frontmatter from the hunt template (`fingerprint`, `url`, `severity`, `confidence`, `classification`, `area`, `fix_surface`). Use `fix_surface`:

- `content` → prefer minimal edits under `content/`
- `app` → prefer `pages/`, `components/`, or site config
- `mixed` → smallest change that fixes the user-visible bug

## Workflow

### 1. Reproduce first (mandatory)

1. Confirm the bug still happens (production URL from the issue, or local if local-only).  
2. Capture evidence with playwright-cli.  
3. If you **cannot** reproduce:
   - **Local:** stop and report  
   - **CI:** `gh issue comment` explaining attempts; add label `needs-human` if possible; **do not** open a PR  

**No product code changes until reproduction succeeds.**

### 2. Fix with minimal scope

1. Branch: `agent/fix-issue-<n>` (CI) or a clear local branch name.  
2. Smallest change; no drive-by refactors.  
3. Prefer a11y-friendly fixes when the bug is interaction/UI.

### 3. Verify

Re-run the **exact** original user action. Note before/after briefly.

### 4. Regression test when it pays off

- Stable user journey → add/adjust `tests/*.spec.ts`  
- Run: `npx playwright test tests/<file>.spec.ts`  
- Skip only with an explicit reason (flaky env, third-party-only)

### 5. Close the loop

**If PR requested or CI mode:**

```bash
gh pr create --draft --title "fix: …" --body "$(cat <<'EOF'
## Summary
…

## Repro
…

## Fix
…

## Verification
- playwright-cli: …
- tests: `npx playwright test …`

Closes #<n>
EOF
)"
```

Always use **`--draft`** for autonomous / CI PRs.

Update or remove the local candidate file notes when appropriate.

## Rules

- Reproduce before fix.  
- One bug per branch/PR.  
- Don’t weaken tests to pass.  
- Don’t commit secrets or unrelated WIP.  
- Loud failure > fake fix.  

## Done means

- Reproduced with evidence **or** loud cannot-repro exit  
- Fix + browser verification when reproduced  
- Regression test added/updated **or** explicit skip reason  
- Draft PR with `Closes #N` in CI / when asked locally

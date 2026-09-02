---
name: verify-debbie-codes
description: "Drive the live debbie.codes Nuxt site (web UI) the way a user does via Playwright — launch the dev server, doctor health, exercise mapped features, capture screenshots/ARIA evidence, and clean up. Use when verifying UI changes, proving a feature works, or when asked to verify/test the site end-to-end."
---

# Verify debbie.codes

Drive the **live** Nuxt 3 + Nuxt Content site at `http://127.0.0.1:8000` through the real browser path. Prefer this skill’s CLI (`control-debbie-codes.mjs`), which wraps the repo’s existing `@playwright/test` / Playwright stack. Each drive command launches an ephemeral headless Chromium and closes it before exit (the Nuxt server stays up). Do **not** invent a second browser automation stack. Leave `.agents/skills/playwright-cli` and `.agents/skills/add-content` alone; they are separate Debbie workflows.

`node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs --help` lists commands, flags, and examples.

## Pick a flow

Interview facts for this repo:

| Concern | Finding |
| --- | --- |
| Surface | Public marketing / content site (home, about, blog, videos, podcasts, courses). Primary: web UI. |
| Run | `npm run dev` → Nuxt on `127.0.0.1:8000` (see `README.md`, `nuxt.config.ts` `devServer`, `.cursor/environment.json`). |
| Drive | Existing Playwright harness (`playwright.config.ts`, `tests/*.spec.ts`, CI `.github/workflows/playwright.yml`). This skill’s CLI reuses Playwright; optional ad-hoc: `npx playwright test` or `.agents/skills/playwright-cli`. |
| Observe | Screenshots + ARIA snapshots under `.cursor/skills/verify-debbie-codes/artifacts/<run-id>/`; HTTP identity; page URL/title. |
| Isolate | Default port `8000`. One owned instance per state file in `/tmp/debbie-codes-verify/state.json`. Pass `--port` to launch another; pass `--reuse` to adopt an already-healthy server. Never kill a process this CLI did not start (`owned: false`). |

## Launch

From the repo root:

```bash
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs launch --json
# or adopt whatever is already answering on :8000
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs launch --reuse --json
```

Ready when `doctor` reports healthy (HTTP 200 and page HTML contains `Debbie`). The CLI waits up to 120s for Nuxt. Logs for a owned launch: `/tmp/debbie-codes-verify/<run-id>-nuxt.log`.

Teardown is `cleanup` (below). Do not `pkill -f nuxt` / kill by process name.

## Doctor

Run first whenever anything looks off:

```bash
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs doctor --json
```

Pass only when: base URL responds OK, identity string `Debbie` is present, and (if we own the process) the recorded pid is still alive. A failing doctor means relaunch or fix the environment before driving.

## Drive

Prefer stable ARIA handles used by this repo’s Playwright specs: roles (`heading`, `link`, `navigation`, `region`, `article`), accessible names, and the blog search placeholder `Search...`.

Low-level (compose a custom path):

```bash
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs goto /
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs expect --role heading --name "Debbie O'Brien"
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs click --role link --name Blog
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs fill --placeholder "Search..." --value playwright
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs expect --role heading --name "/Search Results/i"
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs expect-url "/\\/blog/"
```

Mapped feature recipes (one command; captures evidence):

```bash
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive home --json
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive blog --json
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive videos --json
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive tags-and-search --json
```

Read the matching file under [`features/`](features/) before claiming a feature is verified. For broader coverage, also run the existing suite: `npx playwright test` (same app URL; config reuses a healthy server when not in CI).

Hydration gotcha (from `tests/blog.spec.ts` / `tests/blog-filters.spec.ts`): cold loads can swallow the first nav click before the SPA router attaches. Retry click-until-URL when composing custom drives; the `drive` recipes already wait/`toPass` where needed.

## Evidence

Proof standards:

- Exercise the **real user path** (nav links, listing → article, search box, tag chips) — not internal Nuxt APIs or content-collection queries as the primary proof.
- Capture the **action and the resulting state** (URL + visible heading/region), not only a final screenshot.
- Side effects here are mostly client-visible (filtered lists, tag pages). Confirm with ARIA snapshot + URL.
- No mocks: talk to the running site.

Artifacts live at:

```text
.cursor/skills/verify-debbie-codes/artifacts/<run-id>/
```

```bash
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs screenshot --out .cursor/skills/verify-debbie-codes/artifacts/manual.png
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs snapshot --out .cursor/skills/verify-debbie-codes/artifacts/manual.aria.txt
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs evidence list --json
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs evidence path
```

`drive <feature>` writes `*-proof.png`, `*-proof.aria.txt`, and `*-proof.json` into the current run’s evidence directory.

## Cleanup

```bash
# see what would stop (never destructive without confirmation via omitting --dry-run)
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs cleanup --dry-run --json
node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs cleanup --json
```

Cleanup stops the Nuxt process and Chromium session **this CLI started** (`owned: true`). It removes `/tmp/debbie-codes-verify/state.json` and ephemeral browser profile dirs under that temp folder. It **never** deletes `.cursor/skills/verify-debbie-codes/artifacts/`. After cleanup, confirm evidence still exists (`evidence list` or `ls` the path printed by cleanup).

If launch used `--reuse` on a server you did not start, cleanup will not kill that server.

## Helpers

| Helper | Role |
| --- | --- |
| `control-debbie-codes.mjs` | Launch / doctor / drive / evidence / cleanup CLI (this skill). |
| `npx playwright test` | Full regression suite already wired in CI. |
| `.agents/skills/playwright-cli` | Interactive snapshot/click exploration when you need a human-style browser session — not a replacement for this skill’s proof loop. |

Invocation from repo root only (paths are relative to the skill and resolve the repo root as three levels up from the skill file).

## Feature map

The behavior inventory lives in [`features/`](features/). Each file uses the same four H2s: `Sub-features`, `How to get to it (user POV)`, `Driving it with control-debbie-codes`, `Gotchas`.

## Maintenance

When routes, nav labels, or search UI change, update the matching `features/*.md` and `drive` recipes in the same PR, or run `/maintain-verification-skill` if that pstack skill is available.

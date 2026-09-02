# debbie.codes verification map

This directory is the maintained source for verifying user-facing behavior of [debbie.codes](https://debbie.codes). Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch from the repo root: `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs launch` (or `launch --reuse` if `http://127.0.0.1:8000` already serves this site).
- Require `control-debbie-codes.mjs doctor` to report healthy (HTTP OK + Debbie identity).
- Prefer the CLI’s owned instance. Do not kill a Nuxt process you did not start.
- Evidence directory: `.cursor/skills/verify-debbie-codes/artifacts/<run-id>/` (survives `cleanup`).
- Existing Playwright specs under `tests/` are complementary regression; mapped feature drives below are the agent proof path.

## Driving conventions

- Start every recipe from a doctor-healthy baseline unless preconditions say otherwise.
- Prefer ARIA roles and accessible names over CSS selectors (matches `tests/*.spec.ts`).
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through `control-debbie-codes.mjs` (`goto`, `click`, `fill`, `expect`, `drive`, `snapshot`, `screenshot`).
- On cold loads, retry navigation clicks until the URL changes (Nuxt hydration).
- Cleanup removes the owned server/browser only; never proof artifacts.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot with Debbie / page chrome visible.
- Record the feature ID and entry point with every artifact (`*-proof.json` from `drive`).
- Report an unreachable path with the attempted command and unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with control-debbie-codes` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features (sweep order)

1. [Home](./home.md) — hero identity and recent content regions.
2. [Navigation](./navigation.md) — header links, theme chrome, and logo home.
3. [Blog](./blog.md) — listing, open article, back/prev/next chrome.
4. [Videos](./videos.md) — videos index and topic tags.
5. [About](./about.md) — biography and awards grid.
6. [Tags and search](./tags-and-search.md) — blog search box and tag filter pages.

# Videos

Videos lists Debbie’s video content with a curated Featured band, topic filter chips, a paginated Latest grid, and search under Latest.

## Sub-features

- `videos-featured` shows three curated Featured cards on `/videos` (Playwright+MCP talk, Agentic Developer, How to Get Started with Grok Bot).
- `videos-chips` filters via curated chips only: All · Playwright · MCP · Agents · Nuxt · Grok Bot (`TagChip` chrome). Agents → `/videos/tags/ai`; Grok Bot → `/videos/tags/grok-bot`.
- `videos-latest` shows the paginated Latest `VideoCard` grid (`videosPerPage` ~24), excluding Featured picks from the first Latest page / Latest pool.
- `videos-search` filters via the shared search placeholder `Search...` (placed under Latest, not above Featured).

## How to get to it (user POV)

- Choose `Videos` in the header or footer navigation.
- Open `/videos` directly.
- Follow “Recent Videos” from the home page.

## Driving it with control-debbie-codes

Preconditions:

- Doctor healthy.
- Desktop viewport for tag chips / search (mobile layout differs; existing specs often skip mobile for filters).

- **Open videos.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs goto /videos`.
- **Structure visible.** Run `expect --role heading --name Featured`, then `expect --role heading --name Latest` (or Search Results when searching). At least one `article` appears (poll if hydrating).
- **One-shot recipe.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive videos --json`. Evidence: `videos-proof.png`, `videos-proof.aria.txt`, `videos-proof.json` with `articleCount > 0`.
- **Tag (manual compose).** `click --role link --name Playwright` then `expect-url "/\\/videos\\/tags\\/playwright/"`. Articles remain present. Curated chips do not use the `#` prefix.
- **Proof.** Screenshot shows Featured → chips → Latest; JSON records a positive article count.

## Gotchas

- Index chips are curated (not the full tag firehose). Older tags remain reachable from card `TagsList` and direct `/videos/tags/<slug>` URLs.
- Agents chip labels “Agents” but navigates to the `ai` tag. Grok Bot uses the `grok-bot` tag.
- Home “Recent Videos” markup is separate; do not require `article` children inside that home region — verify the dedicated `/videos` page instead.
- Search shares `BlogSearch` with placeholder `Search...`; searching flips the Latest heading to `Search Results (N)`. Search sits under Latest.
- Hard ban: never surface YouTube IDs `A8Gu-ayw6dM` or `yi8b55MLLlg`.

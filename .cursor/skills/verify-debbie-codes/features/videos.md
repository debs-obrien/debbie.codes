# Videos

Videos lists Debbie’s video content, lets a visitor browse by topic tag, and search within the videos collection.

## Sub-features

- `videos-list` shows the All Videos heading and article cards on `/videos`.
- `videos-tag` filters via `#topic` chips to `/videos/tags/<slug>`.
- `videos-search` filters the grid via the shared search placeholder `Search...`.

## How to get to it (user POV)

- Choose `Videos` in the header or footer navigation.
- Open `/videos` directly.
- Follow “Recent Videos” from the home page.

## Driving it with control-debbie-codes

Preconditions:

- Doctor healthy.
- Desktop viewport for tag chips / search (mobile layout differs; existing specs often skip mobile for filters).

- **Open videos.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs goto /videos`.
- **List visible.** Run `expect --role heading --name "/All Videos|Search Results/i"`. At least one `article` appears (poll if hydrating).
- **One-shot recipe.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive videos --json`. Evidence: `videos-proof.png`, `videos-proof.aria.txt`, `videos-proof.json` with `articleCount > 0`.
- **Tag (manual compose).** `click --role link --name "/#playwright/i"` then `expect-url "/\\/videos\\/tags\\/playwright/"`. Articles remain present.
- **Proof.** Screenshot shows the videos index or a tag page with video cards; JSON records a positive article count.

## Gotchas

- Tag labels use a `#` prefix and may include spaces in the accessible name (e.g. `#conference talk`) while the URL slug uses hyphens.
- Home “Recent Videos” markup changed across redesigns; do not require `article` children inside that home region — verify the dedicated `/videos` page instead.
- Search shares `BlogSearch` with placeholder `Search...`; searching flips the heading to `Search Results (N)`.

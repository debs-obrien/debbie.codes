# Tags and search

Tags and search let a visitor narrow blog posts by typing in the search box or by choosing a topic chip, then recognize empty results and clear back to the full list.

## Sub-features

- `search-open` focuses the blog search field on `/blog`.
- `search-match` filters articles to title/description/tag matches and shows `Search Results`.
- `search-empty` shows `Search Results (0)` with no articles for a nonsense query.
- `search-clear` clears the field and restores `Recent Posts`.
- `tag-filter` opens `/blog/tags/<tag>` from a `#Tag` chip and keeps matching tagged articles.

## How to get to it (user POV)

- On `/blog`, use the `Search...` field near the top of the listing.
- On `/blog`, choose a Browse-by-topic chip such as `#Playwright`.
- Open `/blog/tags/playwright` (or another tag slug) directly.

## Driving it with control-debbie-codes

Preconditions:

- Doctor healthy.
- Desktop viewport (search/tag filter UI is asserted mainly for non-mobile in `tests/blog-search.spec.ts` and `tests/blog-filters.spec.ts`).
- At least one post tagged `playwright` exists in content.

- **Open blog.** `goto /blog` and wait until an `article` is visible.
- **Search match.** `fill --placeholder "Search..." --value playwright` then `expect --role heading --name "/Search Results/i"`. At least one article remains for a known term.
- **Empty search.** `fill --placeholder "Search..." --value xyz123nonexistent` then `expect --role heading --name "/Search Results \\(0\\)/i"`.
- **Clear.** Clear the input (fill with empty via recipe or re-`fill` after clear in a custom script); heading returns to `Recent Posts`.
- **Tag chip.** `click --role link --name "#Playwright"` then `expect-url "/\\/blog\\/tags\\/playwright\\/?$/"`. Articles expose a `#playwright` tag link.
- **One-shot recipe.** `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive tags-and-search --json`. Evidence includes search and tag screenshots plus `tags-and-search-proof.json`.
- **Proof.** Artifacts show both a populated search-results heading state and a tag URL with matching articles — not only the `/blog` listing.

## Gotchas

- Search activates after Vue hydration; retry fill until the `Search Results` heading appears (`searchFor` helper in `tests/blog-search.spec.ts`).
- Tag accessible names use display casing (`#Playwright`, `#AI`) while the path slug is lowercase (`playwright`, `ai`).
- Clearing search is part of the proof that search did not permanently mutate content — always restore or assert `Recent Posts` after a match run when composing manually.
- Videos also reuse `Search...`; this feature file’s recipe targets **blog** tags/search unless you explicitly start on `/videos`.

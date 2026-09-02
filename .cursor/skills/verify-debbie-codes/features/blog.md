# Blog

Blog lets a visitor browse recent posts, open an article to read it, and move between posts with back / previous / next links.

## Sub-features

- `blog-list` shows articles on `/blog`.
- `blog-open` opens one article from the listing into `/blog/<slug>`.
- `blog-chrome` shows back-to-blog and (when present) previous/next post links on an article.
- `blog-pagination` reaches older posts via `/blog/page/<n>` when used.

## How to get to it (user POV)

- Choose `Blog` in the header (or footer) navigation.
- Open `/blog` directly.
- Follow a “Recent Blog Posts” link or card from the home page.

## Driving it with control-debbie-codes

Preconditions:

- Doctor healthy.
- Content collections include at least one published blog post (true for this repo’s `content/blog`).

- **Open listing.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs goto /blog` then `expect --role article --name "/.+/"` is not required; instead wait via the recipe or assert the first article: after `goto`, use `drive blog` or click the first article link.
- **Nav entry.** From home: `click --role link --name Blog` then `expect-url "/\\/blog\\/?$/"` (retry click if URL unchanged — hydration).
- **Open article.** Prefer the one-shot recipe: `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive blog --json`. Observable end state: URL matches `/blog/<slug>`, an H1 is visible, and evidence files `blog-proof.png` / `blog-proof.aria.txt` / `blog-proof.json` exist.
- **Proof.** Artifacts show the article heading and a `/blog/` URL that is not the listing alone.

## Gotchas

- First click after a cold load may no-op before Nuxt hydration; retry until the URL changes (see `clickUntilUrl` in `tests/blog.spec.ts`).
- Article cards wrap title + description in a link; when reading a title for search, use the heading text inside the article, not the whole link name.
- Prev/next link names include the adjacent post title; assert `href` or visible name after navigation settles.

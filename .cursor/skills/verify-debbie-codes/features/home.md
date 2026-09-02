# Home

The home page introduces Debbie O'Brien and surfaces recent videos, podcasts, and blog posts so a visitor can recognize the site and jump into content.

## Sub-features

- `home-identity` shows the H1 name and educator tagline.
- `home-recent-blog` lists recent blog posts in a named region.
- `home-recent-podcasts` lists recent podcasts in a named region.
- `home-nav` reaches About, Videos, Podcasts, Courses, and Blog from the header.

## How to get to it (user POV)

- Open `/` directly.
- Choose the site logo / name link from any page.
- Land from an external link to `https://debbie.codes/`.

## Driving it with control-debbie-codes

Preconditions:

- `control-debbie-codes.mjs doctor` reports healthy at `http://127.0.0.1:8000` (or the launched `--port`).
- Desktop viewport (default CLI viewport 1280×800); mobile uses a hamburger (`open menu`) not covered by the default recipe.

- **Open home.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs goto /`. The document title mentions Debbie and the URL path is `/`.
- **Identity.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs expect --role heading --name "/Debbie O'Brien/i"`. The level-1 heading is visible with the educator tagline text nearby.
- **Recent blog region.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs expect --role region --name "/Recent Blog Posts/i"`. The region is visible.
- **One-shot recipe.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive home --json`. Exit `0`; evidence files `home-proof.png`, `home-proof.aria.txt`, and `home-proof.json` appear under the run’s artifacts directory.
- **Proof.** Screenshot and ARIA snapshot show the Debbie heading and at least one recent-content region.

## Gotchas

- Featured Posts / article-count assertions in older specs are partially `fixme` after redesign; prefer regions and the H1, not obsolete featured-post counts.
- Dark/light color mode changes chrome colors; assert roles/names, not pixel colors.
- Logo accessible name is duplicated text (`Debbie O'Brien Debbie O'Brien`) in specs — match carefully if clicking the logo.

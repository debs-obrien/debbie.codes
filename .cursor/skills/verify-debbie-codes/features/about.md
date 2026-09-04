# About

About is the biography and the awards grid.

## Sub-features

- `about-hero` shows the About label and `I'm Debbie O'Brien` heading.
- `about-bio` renders the markdown biography, including the YouTube Channel link.
- `about-awards` lists nine award cards under Awards & Achievements.

## How to get to it (user POV)

- Choose `About` in the header or footer.
- Open `/about`.

## Driving it with control-debbie-codes

Preconditions:

- `control-debbie-codes.mjs doctor` reports healthy.

- **Open about.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs goto /about`. The h1 matches `/I'm Debbie O'Brien/i`.
- **Awards.** The h2 `Awards & Achievements` is visible. `main article` count is 9.
- **One-shot recipe.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive about --json`. Evidence: `about-proof.png`, `about-proof.aria.txt`, `about-proof.json`.
- **Isolated driver.** `.cursor/skills/verify-debbie-codes/bin/verify drive about` is the same path on port 8010.

## Gotchas

- Bio leads with Independent Developer Educator + AI agents (Microsoft TPM / Playwright as track record). No Zephyr in the About bio. Assert structure and current copy, not a remembered sentence from an older PR.
- Award cards are `article` items with visible `About {name}` text. Count roles from the page you launched.
- Bio and awards both mention Google Developer Expert. Scope GDE sentences to `.prose` when the text appears twice.

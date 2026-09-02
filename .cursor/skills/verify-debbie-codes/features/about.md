# About

About is the biography and the awards grid.

## Sub-features

- `about-hero` shows the About label and `I'm Debbie O'Brien` heading.
- `about-bio` renders the markdown biography, including the YouTube Channel link.
- `about-awards` lists nine award cards under Awards & Achievements.

## How to get to it (user POV)

- Choose `About` in the header or footer.
- Open `/about`.

## Driving it with verify-debbie-codes

Preconditions:

- Doctor reports `OK`.

- **Open about.** Run `.cursor/skills/verify-debbie-codes/bin/verify drive about`. The h1 matches `/I'm Debbie O'Brien/i`.
- **Awards.** The h2 `Awards & Achievements` is visible. `main article` count is 9 (on `main` each award is an article).
- **Proof.** `about-after.png` and `about.aria.yml` show the heading and the awards heading.

## Gotchas

- A Wave B branch rewrites the bio (Zephyr / Block past tense) and may add a headshot. Assert structure and current copy on the branch you are proving, not a remembered sentence from another PR.
- Wave A may change award cards from `article` + `Learn more about …` to a list with visible `About {name}` text. Count roles from the page you launched.
- Bio and awards both mention Google Developer Expert. Scope GDE sentences to `.prose` when the text appears twice.

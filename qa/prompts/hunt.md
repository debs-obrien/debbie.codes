# CI prompt: site bug hunt

You are running in **GitHub Actions** unattended mode.

1. Read and follow `.agents/skills/site-bug-hunt/SKILL.md` end-to-end.
2. Set mode to **ci** (`SITE_BUG_HUNT_MODE=ci` is already set).
3. Target base URL: `$SITE_BUG_HUNT_BASE_URL` (default https://debbie.codes).
4. Use `playwright-cli` for exploration. Obey gentle crawl limits and the honesty taxonomy in `.agents/skills/site-bug-hunt/references/honesty.md`.
5. Always write matching files under `qa/bug-candidates/` for findings you take seriously.
6. File GitHub issues with `gh` **only** for `classification=bug`, `confidence=high`, severity `blocker` or `major` (unless `SITE_BUG_HUNT_ALLOW_MINOR=1`). Max 3 issues. Dedupe on `fingerprint:`.
7. Labels on each issue: `bug`, `agent-hunt`, and `severity:major` or `severity:blocker` as appropriate.
8. Issue body must include the structured YAML frontmatter from `.agents/skills/site-bug-hunt/references/candidate-template.md`.
9. If nothing eligible: say so clearly in the job summary. Do not invent bugs.
10. Do **not** change product source code. Do **not** open pull requests.

When finished, print a short summary: journeys covered, candidates written, issues filed (numbers/URLs), issues skipped and why.

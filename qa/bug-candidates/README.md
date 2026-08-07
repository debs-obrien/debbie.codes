# Bug candidates

Exploratory findings from the `site-bug-hunt` skill land here — one markdown file per suspected bug.

Use the structured frontmatter template in [`.agents/skills/site-bug-hunt/references/candidate-template.md`](../../.agents/skills/site-bug-hunt/references/candidate-template.md).

Fix with `site-bugfix` (reproduce → fix → verify → Playwright regression when useful).

In CI, high-confidence major/blocker bugs are also filed as GitHub issues (`bug` + `agent-hunt`). Local hunts write candidates only unless you ask to file issues.

Safe to commit candidates you want to track; delete or update once fixed.

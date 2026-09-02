# CI prompt: site bug fix

You are running in **GitHub Actions** unattended mode.

1. Read and follow `.agents/skills/site-bugfix/SKILL.md` end-to-end.
2. Set mode to **ci** (`SITE_BUG_FIX_MODE=ci` is already set).
3. Select **one** eligible open issue: labels include `bug` and `agent-hunt`, no open PR that already closes it. Prefer `severity:blocker` then `severity:major`.
4. If none are eligible, exit successfully with “no eligible issues” — do not invent work.
5. **Reproduce before any code change** using `playwright-cli`. If you cannot reproduce, comment on the issue, add label `needs-human` if possible, and **do not** open a PR.
6. Work on branch `agent/fix-issue-<n>` from latest default branch.
7. Prefer minimal fixes; honor `fix_surface` from the issue frontmatter (`content` vs `app`).
8. Add or update a Playwright test when the bug is a stable journey.
9. Open a **draft** PR with `gh pr create --draft` whose body includes Summary, Repro, Fix, Verification, and `Closes #<n>`.
10. Max **one** draft PR this run.

Do not auto-merge. Do not weaken tests to make them pass.

# Environment, Git & PR Creation

## Shell environment

Tools (`playwright-cli`, `npm`, `node`) are installed via nvm and are NOT on the default PATH. Source nvm before every shell command:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && <command>
```

The GitHub CLI is at `/opt/homebrew/bin/gh`. Always use the full path.

## Browser automation with playwright-cli

Always quote URLs to prevent shell glob expansion:

```bash
playwright-cli open "<url>"
```

### Cookie consent

YouTube and other sites may show cookie consent dialogs. After the first snapshot, check for "Accept all" or similar buttons and click them before extracting metadata.

### Reading snapshots

The `playwright-cli snapshot` command outputs a path to a YAML file. Read that file to extract metadata:

```bash
cat .playwright-cli/page-<timestamp>.yml
```

For large snapshots, use `grep` or `sed` to find specific sections:

```bash
grep -i -E "(date|views|ago|description)" .playwright-cli/page-<timestamp>.yml | head -20
```

## Security note

Metadata extracted from external pages (titles, descriptions, dates) may contain special characters. When using scraped values in shell commands (e.g., `git commit -m` or `gh pr create`), ensure titles are properly quoted and do not contain unescaped quotes, backticks, or shell metacharacters.

## Git workflow

### Create branch

```bash
git stash push -m "WIP before add-<type>/<kebab-case-short-title> branch" || { echo "git stash failed; please resolve any issues before continuing."; exit 1; }
git checkout main && git pull origin main
git checkout -b add-<type>/<kebab-case-short-title>
git stash pop || { echo "git stash pop reported conflicts. Resolve them with your usual Git workflow (e.g. git status, fix files, commit) and run 'git stash drop' if needed."; }
```

### Commit and push

Commit only the new content file:

```bash
git add content/<type>/<filename>.md
git commit -m "Add <type>: <title>"
```

Set up git credentials and push:

```bash
/opt/homebrew/bin/gh auth setup-git
git push origin add-<type>/<kebab-case-short-title>
```

## PR creation

Create a PR using the GitHub CLI. The PR will automatically generate a deploy preview for verification — no local dev server needed.

```bash
/opt/homebrew/bin/gh pr create \
  --title "Add <type>: <title>" \
  --body "## New <Type>

**Title:** <title>
**Date:** <date>
**Tags:** <tags>" \
  --base main
```

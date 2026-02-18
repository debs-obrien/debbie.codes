# Environment, Git, Dev Server & PR Creation

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

## Git workflow

### Create branch

```bash
git stash push -m "WIP before add-<type>/<kebab-case-short-title> branch" || { echo "git stash failed; please resolve any issues before continuing."; exit 1; }
git checkout main && git pull origin main
git checkout -b add-<type>/<kebab-case-short-title>
git stash pop || { echo "git stash pop reported conflicts. Resolve them with your usual Git workflow (e.g. git status, fix files, commit) and run 'git stash drop' if needed."; }
```

### Commit and push

Commit only the new content file — do NOT commit screenshots or other files:

```bash
git add content/<type>/<filename>.md
git commit -m "Add <type>: <title>"
```

Set up git credentials and push:

```bash
/opt/homebrew/bin/gh auth setup-git
git push origin add-<type>/<kebab-case-short-title>
```

## Dev server verification

### Install dependencies and start

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /Users/debbieobrien/workspace/debbie.codes && npm install 2>&1 | tail -5
```

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /Users/debbieobrien/workspace/debbie.codes && npm run dev > /tmp/nuxt-dev.log 2>&1 &
```

Wait for ready:

```bash
sleep 10 && tail -10 /tmp/nuxt-dev.log
```

Look for `Nitro server built` to confirm. The dev server runs on port 3001.

### Take verification screenshot

```bash
playwright-cli open "http://localhost:3001/<type-page>"
playwright-cli snapshot
playwright-cli screenshot --filename=verification.png
playwright-cli close
```

Page paths: `/videos` for videos, `/podcasts` for podcasts, `/blog` for blogs.

Confirm the new content appears on the page. The screenshot is for local verification only — do NOT commit it.

### Stop dev server

```bash
kill $(lsof -ti:3001) 2>/dev/null
```

## PR creation

Create a PR using the GitHub CLI:

```bash
/opt/homebrew/bin/gh pr create \
  --title "Add <type>: <title>" \
  --body "## New <Type>

**Title:** <title>
**Date:** <date>
**Tags:** <tags>" \
  --base main
```

## Clean up

Remove local screenshot and any temporary files:

```bash
rm -f verification.png
```

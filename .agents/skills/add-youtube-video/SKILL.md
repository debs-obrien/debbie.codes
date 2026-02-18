---
name: add-youtube-video
description: Add a new YouTube video to the content/videos directory by navigating to the video URL with playwright-cli to extract metadata, creating the markdown file, verifying it on the dev server, and opening a PR with a screenshot.
---

# Add a YouTube Video

Use this skill to add a new YouTube video entry to the `content/videos/` directory of the debbie.codes project. This is a fully automated workflow — from extracting video metadata to opening a PR with a verification screenshot.

## Prerequisites

- The `playwright-cli` tool must be available (installed globally via nvm)
- The user must provide a YouTube video URL
- The GitHub CLI (`gh`) must be authenticated

## Important: Shell Environment

Many tools (`playwright-cli`, `npm`, `npx`, `node`) are installed via nvm and are NOT on the default shell PATH. You **must** source nvm before every shell command that uses them:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && <your-command>
```

The GitHub CLI (`gh`) is installed via Homebrew at `/opt/homebrew/bin/gh`. Use the full path.

## Steps

### 1. Get the YouTube URL

- Ask the user for the YouTube video URL if not provided.
- Extract the video ID from the URL:
  - `https://www.youtube.com/watch?v=VIDEO_ID` → `VIDEO_ID`
  - `https://youtu.be/VIDEO_ID` → `VIDEO_ID`
  - Strip any query parameters like `?si=...` or `&feature=...`

### 2. Open the browser and navigate to the video

Always quote the URL to prevent shell glob expansion (YouTube URLs often contain `?` and `&`):

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli open "https://www.youtube.com/watch?v=VIDEO_ID"
```

### 3. Handle cookie consent

YouTube often shows a cookie consent dialog (especially in EU regions). After the first snapshot, check for a dialog with "Accept all" or "Reject all" buttons. If present, accept it:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli snapshot
```

Look for a button like `Accept the use of cookies and other data for the purposes described` and click it by its ref:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli click <ref>
```

### 4. Extract video metadata from the page

Take a fresh snapshot after cookie consent is handled:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli snapshot
```

The snapshot output tells you the path to the snapshot YAML file. **Read the YAML file** to extract metadata — the snapshot command output alone doesn't contain all the details:

```bash
cat .playwright-cli/page-<timestamp>.yml
```

If the output is truncated, use `head`, `tail`, `sed`, or `grep` to find specific sections:

```bash
grep -i -E "(date|views|ago|description)" .playwright-cli/page-<timestamp>.yml | head -20
```

Click the "...more" button to expand the full description, then take another snapshot and read the updated YAML:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli click <more-button-ref>
```

After expanding, the description area will show the exact publish date (e.g., "3,032 views 11 Feb 2026") instead of relative dates like "7 days ago".

Extract the following information:

- **Title**: The video title from the `<h1>` heading
- **Description**: A concise summary of the video description text
- **Date**: The exact publish date (visible after expanding the description)
- **Video ID**: Already extracted from the URL in step 1
- **Host/Channel**: The channel name shown below the title

> **Important**: Do NOT invent or fabricate any metadata. All information must come directly from the YouTube page. If the date is not visible even after expanding, ask the user for it.

### 5. Close the browser

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli close
```

### 6. Determine appropriate tags

Only use tags that already exist in other video files. Check the current tags:

```bash
grep -h "^tags:" content/videos/*.md | sed 's/tags: \[//;s/\]//;s/, /\n/g' | sed 's/^ *//' | sort -u
```

Choose tags based on the video content. Do NOT create new tags.

### 7. Create a new git branch

Stash any uncommitted changes first, then create a branch from main:

```bash
git stash
git checkout main
git pull origin main
git checkout -b add-video/<kebab-case-short-title>
git stash pop
```

### 8. Create the markdown file

Create a new file in `content/videos/` with a kebab-case filename derived from the video title.

Use the YouTube default thumbnail URL for the image:

```
https://img.youtube.com/vi/<VIDEO_ID>/sddefault.jpg
```

The file must follow this exact frontmatter format:

```markdown
---
title: "Video Title Here"
date: YYYY-MM-DD
description: "A concise description of the video content."
video: VIDEO_ID
tags: [tag1, tag2]
host: Channel Name
image: https://img.youtube.com/vi/VIDEO_ID/sddefault.jpg
---
```

**Frontmatter rules:**
- `title`: Use the exact title from YouTube. Wrap in quotes if it contains special characters like colons.
- `date`: Use `YYYY-MM-DD` format. Must be the actual publish date from YouTube.
- `description`: A concise description. Wrap in quotes.
- `video`: Just the YouTube video ID (e.g., `psdu0BVal6w`), NOT the full URL.
- `tags`: Array format with square brackets. Only use existing tags listed above.
- `host`: The YouTube channel name or event name.
- `image`: The YouTube thumbnail URL using the video ID.

### 9. Install dependencies and start the dev server

Dependencies may not be installed. Install them first, then start the dev server:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /Users/debbieobrien/workspace/debbie.codes && npm install 2>&1 | tail -5
```

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /Users/debbieobrien/workspace/debbie.codes && npm run dev > /tmp/nuxt-dev.log 2>&1 &
```

Wait for the server to be ready (check the log):

```bash
sleep 10 && tail -10 /tmp/nuxt-dev.log
```

Look for `Vite client built` or `Nitro server built` to confirm it's ready. The dev server runs on port 3001.

### 10. Verify with playwright-cli and take a screenshot

Open the videos page and take a screenshot:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli open "http://localhost:3001/videos"
```

Verify the new video appears in the snapshot:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli snapshot
```

Take a screenshot for the PR:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli screenshot --filename=video-verification.png
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && playwright-cli close
```

### 11. Stop the dev server

```bash
kill $(lsof -ti:3001) 2>/dev/null
```

### 12. Commit and push

First, commit the video file:

```bash
git add content/videos/<filename>.md
git commit -m "Add video: <video title>"
```

Then commit the screenshot to `.github/screenshots/` so it can be referenced in the PR body:

```bash
mkdir -p .github/screenshots
cp video-verification.png .github/screenshots/video-verification.png
git add .github/screenshots/video-verification.png
git commit -m "Add verification screenshot"
```

Set up git credentials and push:

```bash
/opt/homebrew/bin/gh auth setup-git
git push origin add-video/<kebab-case-short-title>
```

### 13. Create a Pull Request with screenshot

Create a PR using the GitHub CLI. Reference the screenshot via `raw.githubusercontent.com` so it renders in the PR body:

```bash
/opt/homebrew/bin/gh pr create \
  --title "Add video: <video title>" \
  --body "## New Video

**Title:** <title>
**Date:** <date>
**Host:** <host>
**Tags:** <tags>
**Video:** https://youtu.be/<VIDEO_ID>

## Verification Screenshot

![Video on site](https://raw.githubusercontent.com/debs-obrien/debbie.codes/add-video/<branch-name>/.github/screenshots/video-verification.png)" \
  --base main
```

### 14. Clean up

Remove the local screenshot file:

```bash
rm -f video-verification.png
```

## Example

For a video at `https://www.youtube.com/watch?v=psdu0BVal6w`:

**Branch**: `add-video/agent-mode-complete-pr`
**File**: `content/videos/agent-mode-complete-pr.md`

```markdown
---
title: Agent Mode Complete this PR
date: 2025-06-03
description: Getting agent mode to complete a PR with Playwright and GitHub Copilot.
host: Debbie's youtube channel
video: psdu0BVal6w
tags: [mcp, ai, playwright]
image: https://img.youtube.com/vi/psdu0BVal6w/sddefault.jpg
---
```

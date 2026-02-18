---
name: add-youtube-video
description: Add a new YouTube video to the content/videos directory by navigating to the video URL with playwright-cli to extract metadata, creating the markdown file, verifying it on the dev server, and opening a PR with a screenshot.
---

# Add a YouTube Video

Use this skill to add a new YouTube video entry to the `content/videos/` directory of the debbie.codes project. This is a fully automated workflow — from extracting video metadata to opening a PR with a verification screenshot.

## Prerequisites

- The `playwright-cli` tool must be available (it is installed globally)
- The user must provide a YouTube video URL

## Steps

### 1. Get the YouTube URL

- Ask the user for the YouTube video URL if not provided.

### 2. Open the browser and navigate to the video

```bash
playwright-cli open "<youtube-url>"
```

### 3. Extract video metadata from the page

Take a snapshot to read the page content. If there is a cookie consent dialog, accept it first.

```bash
playwright-cli snapshot
```

Click "...more" to expand the full description if needed.

Extract the following information from the YouTube page:

- **Title**: The video title as shown on YouTube
- **Description**: The video description (use a concise summary, not the full description)
- **Date**: The publish date of the video (look for the date below the video or in the description)
- **Video ID**: Extract from the URL (the part after `v=` or after `youtu.be/`)
- **Host/Channel**: The channel name that published the video

> **Important**: Do NOT invent or fabricate any metadata. All information must come directly from the YouTube page. If the date is not visible, ask the user for it.

### 4. Close the browser

```bash
playwright-cli close
```

### 5. Determine appropriate tags

Only use tags that already exist in other video files. The current valid tags are:

- ai, architecture, cms, conference-talk, css, dev-rel, hasura, imposter-syndrome
- interview, interviews, jamstack, learning-to-code, live-streams, mcp, nuxt
- performance, playwright, react, testing, typescript, vue

Choose tags based on the video content. Do NOT create new tags.

### 6. Create a new git branch

Create a branch from main for this video addition:

```bash
git checkout main
git pull origin main
git checkout -b add-video/<kebab-case-short-title>
```

### 7. Create the markdown file

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

### 8. Verify on the dev server

Start the dev server and use playwright-cli to verify the video appears correctly:

```bash
npm run dev &
```

Wait for the server to be ready, then open the videos page and take a screenshot:

```bash
playwright-cli open "http://localhost:3001/videos"
playwright-cli screenshot --filename=video-verification.png
playwright-cli close
```

Confirm the new video card is visible on the page.

### 9. Stop the dev server

```bash
kill $(lsof -ti:3001) 2>/dev/null
```

### 10. Commit and push

```bash
git add content/videos/<filename>.md
git commit -m "Add video: <video title>"
git push origin add-video/<kebab-case-short-title>
```

Only commit the new video markdown file — do not include screenshots or other unrelated changes.

### 11. Create a Pull Request with screenshot

Create a PR using the GitHub CLI, including the verification screenshot in the PR body:

```bash
gh pr create \
  --title "Add video: <video title>" \
  --body "## New Video\n\n**Title:** <title>\n**Date:** <date>\n**Host:** <host>\n**Tags:** <tags>\n\n## Verification Screenshot\n\n![Video on site](video-verification.png)" \
  --base main
```

Upload the screenshot to the PR by attaching it. If `gh` doesn't support inline image upload, upload the screenshot as a PR comment or reference it from the repo.

### 12. Clean up

Remove the screenshot file from the working directory:

```bash
rm video-verification.png
```

## Example

For a video at `https://www.youtube.com/watch?v=psdu0BVal6w`:

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

# Video (YouTube)

## Extract video ID from URL

- `https://www.youtube.com/watch?v=VIDEO_ID` → `VIDEO_ID`
- `https://youtu.be/VIDEO_ID` → `VIDEO_ID`
- Strip query parameters like `?si=...` or `&feature=...`

## Navigate and extract metadata

```bash
playwright-cli open "https://www.youtube.com/watch?v=<VIDEO_ID>"
```

After handling cookie consent (see environment.md), take a snapshot. The initial view shows relative dates ("7 days ago"). Click the "...more" button to expand the description — this reveals the exact publish date (e.g., "3,032 views 11 Feb 2026").

```bash
playwright-cli click <more-button-ref>
playwright-cli snapshot
```

Read the snapshot YAML to extract:

- **Title**: From the `<h1>` heading
- **Description**: Concise summary of the description text
- **Date**: Exact date shown after expanding (format: "DD Mon YYYY")
- **Host/Channel**: Channel name shown below the title (e.g., "NDC Conferences", "Debbie's YouTube channel")

Close the browser when done.

## Thumbnail

Use YouTube's default thumbnail:

```
https://img.youtube.com/vi/<VIDEO_ID>/sddefault.jpg
```

## Frontmatter schema

```yaml
---
title: "Video Title Here"
date: YYYY-MM-DD
description: "Concise description from YouTube."
video: VIDEO_ID
tags: [tag1, tag2]
host: Channel Name
image: https://img.youtube.com/vi/VIDEO_ID/sddefault.jpg
---
```

- `title`: Exact title from YouTube. Quote if it contains colons or special characters.
- `video`: Just the ID (e.g., `psdu0BVal6w`), NOT the full URL.
- `host`: The YouTube channel name or conference/event name.

## Existing tags

Check with: `grep -h "^tags:" content/videos/*.md | sed 's/tags: \[//;s/\]//;s/, /\n/g' | sed 's/^ *//' | sort -u`

## Verification page

`http://localhost:3001/videos`

## Example

**File**: `content/videos/supercharged-testing-playwright-mcp.md`

```yaml
---
title: "Supercharged Testing: AI-Powered Workflows with Playwright + MCP - Debbie O'Brien"
date: 2026-02-11
description: "Learn how to supercharge your end-to-end testing strategy by combining Playwright with the Playwright MCP Server for AI-assisted workflows."
video: Numb52aJkJw
tags: [playwright, testing, ai, mcp, conference-talk]
host: NDC Conferences
image: https://img.youtube.com/vi/Numb52aJkJw/sddefault.jpg
---
```

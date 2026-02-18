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
- **Host/Channel**: Channel name shown below the title (e.g., "NDC Conferences", "Debbie's youtube channel")

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
host: Channel Name        # OR
conference: Conference Name   # Use one or the other, not both
image: https://img.youtube.com/vi/VIDEO_ID/sddefault.jpg
---
```

- `title`: Exact title from YouTube. Quote if it contains colons or special characters.
- `video`: Just the ID (e.g., `psdu0BVal6w`), NOT the full URL.
- `host`: Use for YouTube channel names (e.g., "Debbie's youtube channel", "NDC Conferences", "Miguel Angel Duran"). This is the entity that uploaded/hosts the video.
- `conference`: Use for conference talks or specific events (e.g., "NDC Oslo", "Vue Amsterdam Meetup", "BuildStuff Lithuania"). This is the event where the talk was given.
- **Choose `host` OR `conference`**, not both:
  - If the video is from a personal channel or uploaded by a hosting organization → use `host`
  - If the video is a recording of a specific conference or event talk → use `conference`

## Existing tags

Check with: `grep -h "^tags:" content/videos/*.md | sed 's/tags: \[//;s/\]//;s/, /\n/g' | sed 's/^ *//' | sort -u`

## Verification page

`http://localhost:3001/videos`

## Examples

**Example 1: Conference talk (use `conference`)**

**File**: `content/videos/testing-web-applications-playwright-ndc-oslo.md`

```yaml
---
title: Testing Web Applications with Playwright
date: 2022-09-28
description: Testing is hard, testing takes time to learn and to write, and time is money. As developers we want to test. We know we should but we don't have time. So how can we get more developers to do testing? We can create better tools.
video: kbTohfkZAMA
tags: [conference-talk, testing, playwright]
conference: NDC Oslo
---
```

**Example 2: YouTube channel video (use `host`)**

**File**: `content/videos/manual-testing-playwright-mcp.md`

```yaml
---
title: "Manual Testing with Playwright MCP – No Code, Just Prompts!"
date: 2025-07-12
description: "Discover how to perform manual testing using Playwright MCP without writing any code, using simple prompts instead."
video: 2vnttb-YZrA
tags: [playwright, mcp, testing, ai]
host: Debbie's youtube channel
image: https://img.youtube.com/vi/2vnttb-YZrA/sddefault.jpg
---
```

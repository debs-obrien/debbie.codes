# Blog Post

## Navigate and extract metadata

Open the blog post URL with playwright-cli:

```bash
playwright-cli open "<blog-url>"
```

Take a snapshot and read the YAML to extract:

- **Title**: The article title
- **Description**: A concise summary (1-2 sentences)
- **Date**: The publish date
- **Content**: The full article body in markdown format

Close the browser when done.

## Content extraction

Extract the **complete article content** from the page — do not summarize or truncate. Convert HTML to clean markdown:

- Preserve headings, code blocks, lists, links, and images
- Remove navigation, sidebars, footers, and ads
- Keep image URLs as-is (do not download or re-host)

## Canonical URL handling

If the blog post is hosted elsewhere (dev.to, hashnode, medium, etc.):

- Add `canonical: <original-url>` to the frontmatter
- Still copy the full content into the markdown file

If the blog post is original content for debbie.codes, omit the `canonical` field.

## Frontmatter schema

```yaml
---
title: "Blog Post Title"
date: YYYY-MM-DD
description: "Concise description of the post."
tags: [tag1, tag2]
published: true
canonical: https://dev.to/...    # only if hosted elsewhere
---

Full markdown content here...
```

- `title`: Exact title from the blog. Quote if it contains colons or special characters.
- `published`: Always `true`.
- `canonical`: Only include if the post is hosted on another platform.
- Do NOT add an `image` field unless the original post has a prominent hero image.

## Existing tags

Check with: `grep -h "^tags:" content/blog/*.md | sed 's/tags: \[//;s/\]//;s/, /\n/g' | sed 's/^ *//' | sort -u`

## Example (externally hosted)

**File**: `content/blog/ai-agents-mcp-automate-content.md`

```yaml
---
title: How I Use AI Agents + MCP to Fully Automate My Website's Content
date: 2026-01-14
description: How I use AI agents and MCP tools to automate publishing and updating podcasts, videos, and other content on my website.
tags: [mcp, ai]
canonical: https://dev.to/debs_obrien/how-i-use-ai-agents-mcp-to-fully-automate-my-websites-content-3ekj
published: true
---

Full article content in markdown...
```

## Example (original content)

**File**: `content/blog/2022-in-review.md`

```yaml
---
title: 2022 Recap - Achieving your dreams Debbie
date: 2022-12-31
description: A look back at 2022 — from Google interviews to being hired by Microsoft, speaking at conferences, and lots of sport.
tags: [personal]
published: true
---

Full article content in markdown...
```

---
name: add-content
description: "Adds videos, blog posts, or podcasts to the debbie.codes website by extracting metadata from a URL, creating a content file with frontmatter, and opening a PR. Use when the user says 'add video', 'add blog post', 'add podcast', 'add this to the site', or provides a YouTube, podcast, or blog URL to add as content."
---

# Add Content to debbie.codes

Fully automated workflow: URL → metadata extraction → file creation → PR (with deploy preview).

## Determine content type

Identify from the user's request or URL:

- **YouTube URL** (`youtube.com/watch`, `youtu.be/`) → Video. Read [references/video.md](references/video.md)
- **Podcast platform URL** (e.g., Spotify, Apple Podcasts, podcast website) → Podcast. Read [references/podcast.md](references/podcast.md)
- **Blog platform URL** (e.g., dev.to, hashnode, medium, or any article) → Blog. Read [references/blog.md](references/blog.md)

If ambiguous, ask the user which content type to create.

## Core workflow

Read [references/environment.md](references/environment.md) for shell setup, git, and PR creation details.

### 1. Get the URL

Ask the user for the content URL if not provided.

### 2. Extract metadata via browser

- Open the URL with `playwright-cli`
- Handle any cookie consent dialogs
- Take snapshots and read the snapshot YAML files to extract metadata
- Do NOT invent or fabricate any metadata — all info must come from the page
- If the publish date is not visible, ask the user
- Close the browser when done

### 3. Validate tags

Only use tags that already exist in the corresponding content directory. Check with:

```bash
grep -h "^tags:" content/<type>/*.md | sed 's/tags: \[//;s/\]//;s/, /\n/g' | sed 's/^ *//' | sort -u
```

Do NOT create new tags. If no existing tags seem appropriate:
- Prefer the closest matching existing tags that reasonably describe the content, or
- Ask the user to choose from the existing tags you listed.
If the user insists on new tags, explain that updating the tag taxonomy is outside this automated workflow and they should adjust it manually.

### 4. Create git branch

```bash
git stash
git checkout main && git pull origin main
git checkout -b add-<type>/<kebab-case-short-title>
git stash pop
```

### 5. Create the markdown file

Create in the appropriate `content/<type>/` directory with a kebab-case filename. Follow the exact frontmatter schema from the content-type reference file.

### 6. Create PR

Commit only the content file, push, and create a PR. The PR will generate a deploy preview automatically — no need to run a local dev server. See [references/environment.md](references/environment.md) for details.

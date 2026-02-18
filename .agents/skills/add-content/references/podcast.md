# Podcast

## Navigate and extract metadata

Open the podcast episode URL with playwright-cli. **Important**: Validate the URL format first to prevent command injection:

```bash
# Validate URL starts with http:// or https://
if [[ ! "$podcast_url" =~ ^https?:// ]]; then
  echo "Invalid URL format"
  exit 1
fi

# Use single quotes to prevent shell expansion - but this won't work with variables
# Instead, when using a variable, ensure it's validated first as shown above
playwright-cli open "$podcast_url"
```

For known-safe URLs (constants), use single quotes:

```bash
playwright-cli open 'https://example.com/podcast/episode'
```

Take a snapshot and read the YAML to extract:

- **Title**: The episode title
- **Description**: Episode description/summary
- **Date**: Publish date of the episode
- **Host**: The podcast name (e.g., "Compressed fm", ".NET Rocks", "JS Party")
- **URL**: The canonical episode URL (keep the original URL provided)
- **Image**: The podcast artwork/logo image URL from the page

Close the browser when done.

## Image handling with Cloudinary

Podcast images must be hosted on Cloudinary under the `debbie.codes/podcasts/` folder.

### If Cloudinary MCP extension is available

Use the Cloudinary MCP `upload` tool:

- `source`: The image URL extracted from the podcast page
- `folder`: `debbie.codes/podcasts`
- `publicId`: A short kebab-case name for the podcast (e.g., `compressed-fm`, `dotnet-rocks`)
- `resourceType`: `image`

Construct the final image URL from the upload response:

```
https://res.cloudinary.com/debsobrien/image/upload/c_thumb,w_200/<public_id>
```

Where `<public_id>` is the full public ID returned (e.g., `debbie.codes/podcasts/compressed-fm`).

### If Cloudinary MCP is not available

Use the Cloudinary CLI or API via shell. **Important**: Validate the image URL first:

```bash
# Validate URL format
if [[ ! "$image_url" =~ ^https?:// ]]; then
  echo "Invalid image URL format"
  exit 1
fi

# Use validated variable with double quotes
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && npx cloudinary-cli upload "$image_url" --folder debbie.codes/podcasts --public-id <name>
```

If neither method works, download the image with `curl` and ask the user to upload it manually to Cloudinary under `debbie.codes/podcasts/`.

### Reusing existing images

If the podcast already has episodes on the site, check existing files for the image URL:

```bash
grep "image:" content/podcasts/*.md | grep -i "<podcast-name>"
```

Reuse the same image URL if the podcast artwork hasn't changed.

## Frontmatter schema

```yaml
---
title: "Episode Title"
date: YYYY-MM-DD
description: "Episode description."
url: https://podcast-platform.com/episode-url
image: https://res.cloudinary.com/debsobrien/image/upload/c_thumb,w_200/debbie.codes/podcasts/podcast-name
tags: [tag1, tag2]
host: Podcast Name
---
```

- `title`: Exact episode title from the podcast page.
- `url`: The original episode URL.
- `image`: Cloudinary URL with `c_thumb,w_200` transformation.
- `host`: The podcast series name, not the individual host's name.

## Existing tags

Check with: `grep -h "^tags:" content/podcasts/*.md | sed 's/tags: \[//;s/\]//;s/, /\n/g' | sed 's/^ *//' | sort -u`

## Verification page

`http://localhost:3001/podcasts`

## Example

**File**: `content/podcasts/dotnet-rocks-changing-testing.md`

```yaml
---
title: Changing Testing using Playwright MCP with Debbie O'Brien
date: 2025-06-05
description: What happens when AI comes to your web testing tool? Debbie O'Brien talks about the latest features in Playwright, including Playwright MCP.
image: https://res.cloudinary.com/debsobrien/image/upload/c_thumb,w_200/v1633724388/debbie.codes/podcasts/dotnet-rocks_ui02cg
url: https://www.dotnetrocks.com/details/1954
tags: [testing, playwright]
host: .NET Rocks
---
```

---
title: "From Prompt Files to Agent Skills: How I Unified My Content Automation"
date: 2026-02-18
description: How I migrated from three separate VS Code prompt files to a single portable agent skill that handles videos, podcasts, and blog posts — with browser verification and automatic PR creation built in.
tags: [ai, mcp, playwright]
published: true
---

A few weeks ago I wrote about [how I use AI agents and MCP to automate my website's content](/blog/ai-agents-mcp-automate-content). That post covered the *why* — I create a lot of content and keeping my site up to date was tedious. This post is about what happened next: how I took those initial prompt files and evolved them into something much more powerful.

## Where I Started: Three Prompt Files

My original setup lived in `.github/prompts/` — three separate markdown files, one for each content type:

```
.github/prompts/
├── playwright-add-video.prompt.md
├── playwright-add-podcast.prompt.md
└── playwright-add-blog.prompt.md
```

Each one was pretty simple. Here's what the video prompt looked like:

```markdown
---
description: 'Add a new video to the content/videos directory'
tools: ['playwright/*']
---

# Add a new video

Add a new video using the MCP server to navigate to the URL to get the required info you need.
- Ask the user for the url if not provided.
- Do not invent titles and descriptions.
- Do not add extra tags only add ones that already exist in the other video files.
- Make sure the date for the video is correct.
- Make sure you add a host
- Close the browser when done.
```

About 15 lines of loose instructions. The podcast and blog prompts were nearly identical — same structure, same rules, just slightly different fields. And they worked! I'd open VS Code, run the prompt with Copilot, paste a YouTube URL, and it would create the markdown file for me.

But over time I started noticing the cracks.

## What Worked and What Didn't

**What worked:** The core idea was solid. Give the AI a URL, let it browse the page, extract metadata, and create a file. That part was great.

**What didn't work:**

**Duplicated instructions everywhere.** All three prompts had the same rules: "don't invent content", "only use existing tags", "verify the date". If I wanted to change how tags were validated, I had to update three files. And they were already starting to drift — the podcast prompt referenced `microsoft/playwright-mcp/*` while the video prompt referenced `playwright/*`.

**No verification step.** The prompts created the file and that was it. I had no way to know if the content actually rendered correctly on my site without manually starting the dev server and checking.

**No PR creation.** After the file was created, I still had to manually create a branch, commit, push, and open a PR. That's the boring part that I wanted automated in the first place.

**Locked to VS Code + Copilot.** The `.prompt.md` format with its `tools` frontmatter was specific to VS Code's Copilot agent mode. I couldn't use these prompts with Goose, Claude Code, or any other AI agent.

**Too vague for reliability.** "Use the MCP server to navigate to the URL" is fine for a human reading instructions, but an AI agent needs more specifics. What happens when YouTube shows a cookie consent dialog? How do you extract the exact publish date when YouTube only shows "7 days ago"? The prompts didn't capture any of this operational knowledge.

## The Migration: Building the First Skill

I decided to convert these prompts into [agent skills](https://block.github.io/goose/docs/guides/context-engineering/using-skills) — portable instruction sets that work across AI coding agents. Skills live in `.agents/skills/` and follow a standard format with a `SKILL.md` file that any compatible agent can discover and use.

I started with the video prompt since that was the one I used most. Instead of the Playwright MCP server (which requires a specific MCP configuration), I used [`playwright-cli`](https://www.npmjs.com/package/@anthropic-ai/playwright-cli) — a standalone CLI tool for browser automation that works through regular shell commands. This meant any agent with shell access could use it.

The first version was straightforward — translate the 15-line prompt into a detailed skill with actual steps:

```bash
# Instead of "use the MCP server to navigate"
playwright-cli open "https://www.youtube.com/watch?v=VIDEO_ID"
playwright-cli snapshot
# Read the snapshot YAML to extract metadata
playwright-cli close
```

Then I tested it by actually adding a real video. And that's where it got interesting.

## Real-World Learnings

Testing the skill on a real YouTube video ([this NDC London talk](https://youtu.be/Numb52aJkJw)) revealed a whole set of things the original prompt never accounted for:

**Cookie consent dialogs.** YouTube showed a full-page cookie consent dialog that blocked all the content. The skill needed to detect and accept it before extracting any metadata.

**Relative dates.** YouTube initially shows "7 days ago" instead of the actual date. You have to click the "...more" button to expand the description, which reveals the exact publish date like "11 Feb 2026".

**Snapshot files need reading.** The `playwright-cli snapshot` command saves a YAML file to disk. You can't just look at the command output — you need to actually read the file and parse through it to find the title, description, channel name, and date.

**Shell environment issues.** Tools like `playwright-cli` and `npm` are installed via nvm and aren't on the default shell PATH. Every single shell command needs to source nvm first. The GitHub CLI is at `/opt/homebrew/bin/gh`, not on PATH either.

**Git authentication.** Pushing to GitHub over HTTPS requires running `gh auth setup-git` first.

None of this was in the original prompt. And none of it needed to be — because a human was there to handle the edge cases. But for a fully autonomous workflow where the agent creates a branch, makes the file, verifies it on the dev server, and opens a PR? Every one of these details matters.

I captured all of these learnings directly into the skill. Each time something went wrong, I updated the instructions. This is exactly the iteration loop that makes skills powerful — they accumulate operational knowledge over time.

## The Architecture Decision: One Skill, Not Three

With the video skill working end-to-end, I looked at the podcast and blog prompts and realized something: about 70% of the instructions were identical across all three.

The shared parts:
- Shell environment setup (nvm, gh path)
- Browser automation workflow (open, snapshot, extract, close)
- Tag validation (only existing tags)
- Git workflow (branch, commit, push)
- Dev server verification (start, screenshot, confirm)
- PR creation

The unique parts per content type:
- **Video:** YouTube-specific extraction (video ID, thumbnail URL, expanding description)
- **Podcast:** Podcast platform extraction, image upload to Cloudinary
- **Blog:** Full article body extraction, canonical URL handling

Three separate skills would mean tripling the shared instructions and tripling the metadata that's always loaded into the agent's context. Following the [progressive disclosure pattern](https://skills.sh/anthropics/skills/skill-creator) from Anthropic's skill-creator guide, I structured it as one skill with reference files:

```
.agents/skills/add-content/
├── SKILL.md                     # Core workflow + routing (75 lines)
└── references/
    ├── environment.md           # Shell env, git, dev server, PR creation
    ├── video.md                 # YouTube-specific extraction + frontmatter
    ├── podcast.md               # Podcast extraction + Cloudinary upload
    └── blog.md                  # Blog content extraction + canonical URLs
```

The `SKILL.md` file is lean — 75 lines. It determines the content type from the URL, points to the right reference file, and defines the core workflow. The agent only loads the reference files it actually needs for the task at hand.

When I say "add this YouTube video", the agent loads:
1. `SKILL.md` (75 lines) — always
2. `references/environment.md` (126 lines) — for shell/git/PR setup
3. `references/video.md` (79 lines) — for YouTube-specific steps

It never loads `podcast.md` or `blog.md`. That's 280 lines of context instead of loading three separate 275-line skills worth of metadata.

## Before vs After

Here's what changed:

| | Prompt Files (Before) | Agent Skill (After) |
|---|---|---|
| **Files** | 3 separate `.prompt.md` files | 1 skill with 4 reference files |
| **Lines of instructions** | ~15 per prompt (45 total) | 480 total (but loaded progressively) |
| **Duplicated logic** | ~70% duplicated across files | Zero — shared logic in `environment.md` |
| **IDE/Agent support** | VS Code + Copilot only | Goose, Claude Code, and any agent supporting skills |
| **Browser automation** | Playwright MCP server (requires MCP config) | `playwright-cli` (standalone CLI, shell only) |
| **Verification** | None — manual check | Auto: starts dev server, screenshots with playwright-cli |
| **PR creation** | Manual | Auto: branch, commit, push, `gh pr create` |
| **Cookie consent handling** | Not addressed | Built-in step |
| **Date extraction** | "Make sure the date is correct" | Specific: click "...more", read expanded description |
| **Error recovery knowledge** | None | nvm sourcing, gh path, git auth, URL quoting |
| **Image handling (podcasts)** | "Ask the user" | Auto: extract from page → upload via Cloudinary MCP |
| **End-to-end automation** | URL → file (then manual steps) | URL → file → verify → PR (fully autonomous) |

The biggest shift isn't any single feature — it's that the skill captures *operational knowledge*. Every edge case I hit during testing is now encoded in the instructions. The next time the agent runs this workflow, it won't hit the same problems.

## What a Run Looks Like Now

Here's what happens when I say "Add this YouTube video to the site" and paste a URL:

1. The agent detects it's a YouTube URL and loads the video reference
2. Opens a browser with `playwright-cli`, navigates to the video
3. Handles the cookie consent dialog if it appears
4. Expands the description to get the exact publish date
5. Extracts title, description, date, channel name, and video ID
6. Closes the browser
7. Checks existing tags and picks only valid ones
8. Creates a git branch
9. Creates the markdown file with correct frontmatter
10. Starts the dev server and verifies the video appears on the site
11. Commits, pushes, and opens a PR

I just merge the PR. That's my only step.

## What's Next

The skill is in `.agents/skills/` which means it's portable across AI coding agents. I'm using it with [Goose](https://github.com/block/goose) today, but the same skill works with Claude Code or any agent that supports the [Agent Skills](https://agentskills.io) standard.

The podcast workflow now automatically uploads images to Cloudinary instead of asking me to do it manually. The blog workflow extracts full article content and handles canonical URLs for posts hosted on other platforms.

And because skills accumulate knowledge through iteration, they'll keep getting better. Every time something unexpected happens, I update the reference file, and the next run is smoother.

If you're using prompt files today and finding yourself duplicating instructions or manually handling the steps after the AI creates a file, consider migrating to skills. The initial investment in writing detailed instructions pays off quickly when you stop having to babysit every run.

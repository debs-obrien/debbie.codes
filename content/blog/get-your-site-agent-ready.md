---
title: "Get your site agent-ready"
date: 2026-11-13
description: "How to give AI agents a short map of your site, a full index, and clean markdown copies of your posts, and why that helps even if the big crawlers do not use the file yet."
tags: [ai, agents, mcp, webdev]
published: true
image: /images/blog/covers/get-your-site-agent-ready.webp
ogImage: /images/blog/covers/get-your-site-agent-ready.webp
---

To find everything I've published about MCP, an agent has to open four tag pages, one each for blog posts, videos, podcasts and courses. Together that's about 257 KB of HTML, and it still has to count everything by hand.

Only about 12 KB of that is the words on the page. The rest is the menu, the footer, icons and styling markup. An agent that only needs the words shouldn't have to download all of that.

So I gave my site a few plain text doors. A short map at [/llms.txt](https://debbie.codes/llms.txt), a full catalog at [/llms-full.txt](https://debbie.codes/llms-full.txt), and a clean markdown copy of each published post, like [/blog/github-mcp-server.md](https://debbie.codes/blog/github-mcp-server.md). This post is about why I added them, how they work, and how you can add the same thing to your own site. If you want the next step, tools an agent can call while it is already on the page, that's what I cover in my [WebMCP post](/blog/webmcp-on-my-site).

## Why this helps

[Jeremy Howard proposed llms.txt](https://www.answer.ai/posts/2024-09-03-llmstxt.html) because websites are built for people, not for models. An HTML page wraps the useful text in navigation, ads, and JavaScript. Turning that back into clean text is messy, and a whole site of HTML is a lot to load into a model's context window. The [llms.txt proposal](https://llmstxt.org/) puts a short, curated map at a well known URL, then points to clean markdown for the detail.

The person who runs the site already knows which pages matter. A short map you generate from your own content beats asking a model to guess from a sitemap.

On my site this is easy to measure. Take [Setting Up the Official GitHub MCP Server](https://debbie.codes/blog/github-mcp-server). I fetched both versions on 13 November 2026.

The HTML page is 54,791 bytes. About 71% of that, 39,104 bytes, sits outside the article. The article HTML is still heavy because of syntax-highlighted code. The visible words in the article are only about 3,121 bytes. An agent that fetches the page starts with something like this:

```html
<!DOCTYPE html><html  lang="en"><head><meta charset="utf-8">
<title>Setting Up the Official GitHub MCP Server, A simple Guide · Debbie Codes</title>
<script type="importmap">{"imports":{"#entry":"/_nuxt/DZVkCy8o.js"}}</script>
<style>.hamburger li[data-v-95840c51]{width:35px;height:5px;...
```

The markdown copy is 4,023 bytes, about 7% of the HTML page. It starts like this:

```markdown
# Setting Up the Official GitHub MCP Server, A simple Guide

- Date: 2025-04-16
- Description: The GitHub MCP (Model Context Protocol) Server is a powerful tool...
- Canonical: https://debbie.codes/blog/github-mcp-server
- Tags: mcp, ai

---

The GitHub MCP (Model Context Protocol) Server is a powerful tool that provides seamless integration with GitHub APIs...

## What is the GitHub MCP Server?

The GitHub MCP Server implements the [Model Context Protocol](https://modelcontextprotocol.io/introduction)...
```

Same post, same links, almost none of the menu, footer or icons.

## A web page, a map, a catalog, and a clean copy

There are four files an agent might read on my site, and each one does a different job.

A normal web page is a document for browsers. Layout, navigation, styles, scripts, and the article all arrive together. That's the 54,791 byte file above.

[/llms.txt](https://debbie.codes/llms.txt) is a map, not the articles. Mine is 5,273 bytes. It has a title, a one-line summary, and a short list of the important doors: about, hire me, a few recent posts and videos, and a pointer to the full index. An agent reads this first, then follows only the links it needs. As the proposal puts it, the file itself stays small enough to fit in context. The detail lives behind the links.

[/llms-full.txt](https://debbie.codes/llms-full.txt) is the complete catalog in one file. Mine is 154,787 bytes, about 151 KB. It lists every published video, post, podcast, and course, with a short note and a link. It is not a dump of every article body. For the full text of a post, follow the `.md` link. Today that catalog has 162 videos, 139 posts, 38 podcasts, and 10 courses.

The `.md` file is one clean page. That's the 4,023 byte copy above.

The map tells an agent where to go. The full index lists everything. The markdown copy is what to read when it opens a post.

## How it works, and who actually reads it

The proposal is straightforward. Put a markdown file at `/llms.txt`. Start with a heading for the site name, then a short summary in a blockquote, then optional extra detail, then sections of links in a fixed list format. You can add a `## Optional` section for secondary links. You can also publish a markdown copy of each important page at the same URL with `.md` added, so `/blog/my-post` has `/blog/my-post.md`.

`llms-full.txt` is a common extra, not part of the official proposal. I still ship one, because a complete catalog is useful, as long as people understand it is a list with notes, not every article pasted into one file.

Who uses this today? Coding agents, docs tools, and any agent that can fetch a URL. You can see real examples at [Anthropic's llms.txt](https://docs.anthropic.com/llms.txt) and [Cloudflare's llms.txt](https://developers.cloudflare.com/llms.txt).

Who does not, today? The big crawlers. In June 2026, Google's John Mueller called the idea "purely speculative for now" and said none of the major AI systems use the file. [Search Engine Journal covered that exchange](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/). In the same thread, Mueller said he likes WebMCP, which is a fair point, and it's why I wrote the follow-up post. Write an llms.txt because it is easy to generate from content you already have, and because agents that fetch URLs can use it. Don't write one because you think it will get you into Google's AI results.

## When to write one, and when not to

Write one when you can generate it from content you already have, so it stays current at build time.

Don't hand-maintain a huge file, and don't do it only for search ranking. A small site can start with a short hand-written `/llms.txt`. A content site should generate the map, the full index, and the markdown copies from the same source as the site itself.

## How to write one

Follow the structure on [llmstxt.org](https://llmstxt.org/). The heading with the site name is the only required part. Then the summary, then optional detail with no extra headings, then sections of `- [name](url): notes`. Use `## Optional` for secondary links.

Prefer linking to markdown copies, not only to HTML.

Generate the files at build time from published content only. Leave drafts out.

Help agents find the files. On each post, add `rel="alternate" type="text/markdown"` pointing at the `.md` copy. The proposal also recommends `rel="describedby"` pointing at `/llms.txt`. A short comment in `robots.txt` that points at llms.txt is a useful extra. It is not a substitute for those links.

## How I did it on [debbie.codes](http://debbie.codes)

One build script, `scripts/generate-content-index.mjs`, runs before the site is generated. It writes `/llms.txt`, `/llms-full.txt`, and the JSON index my WebMCP tools use, all from the same catalog, so they can't drift apart.

Each of the 139 published posts gets a `/blog/<slug>.md` copy, served as `text/markdown`. The copies include a title, date, description, tags, a Canonical line that points at the HTML page, and the article as plain markdown. Video embeds become markdown links. Image size attributes from the framework are stripped. Unpublished posts, including drafts, return a 404.

Every page head links to llms.txt, currently with `rel="alternate" type="text/plain" title="llms.txt"`. Each post also links to its markdown copy with `rel="alternate" type="text/markdown"`. `robots.txt` comments the llms.txt URL. Netlify sets the content types.

The markdown copies also send a Link rel=canonical header and an X-Robots-Tag: noindex header, so search engines treat the HTML page as the original. Pages also use rel=describedby to point at llms.txt.

You can see the live files at [debbie.codes/llms.txt](https://debbie.codes/llms.txt), [debbie.codes/llms-full.txt](https://debbie.codes/llms-full.txt), and [debbie.codes/blog/github-mcp-server.md](https://debbie.codes/blog/github-mcp-server.md).

## How to check it works

Once the files are live, open each one in your browser:

- `your-site/llms.txt` should show plain text that starts with a heading and a one-line summary beginning with `>`.
- `your-site/llms-full.txt` should list everything you've published.
- `your-site/blog/your-slug.md` should show a clean markdown copy of the post.

To check the content type, open DevTools, go to the Network tab and reload. Click the file and look at Content-Type under Headers. The llms files should be `text/plain` and the post copies `text/markdown`. Then view source on a post and check the head links are there.

Then ask an agent a question about your content, and give it only your llms.txt URL as a starting point.

## Any downsides?

The performance hit on the HTML pages is small. The new head links add 94 bytes on every page, and 191 bytes on a blog post. The text files themselves are static. They are only fetched when something requests them, and they are generated at build time, not on each visit.

Duplicate content is the one I'd watch. The markdown copies include a Canonical line and they stay out of the sitemap. They also send a Link rel=canonical header and an X-Robots-Tag: noindex header, so search engines treat the HTML page as the original.

The files are only as fresh as the last build. Generating them from the same content as the site is how they stay current.

A clean index is easier to download in bulk than walking through HTML. That's inherent. This is already public content, and drafts stay unpublished.

And pickup by the big crawlers is low today, as Mueller said. I still think it's worth doing as a courtesy for agents that fetch URLs, and as a foundation for WebMCP.

## A prompt you can paste into your coding agent

If you want this on your own site, paste the prompt below into your coding agent and point it at your repo.

```txt
Add llms.txt support to this site, following https://llmstxt.org/.

- Generate /llms.txt, /llms-full.txt (a list of everything published, with title, date, short note and link), and a clean markdown copy of each blog post at the same URL with .md added. Build them from the site's existing content at build time.
- Serve the .md copies as text/markdown and include a Canonical line pointing at the HTML page. Keep them out of the sitemap.
- Add rel="alternate" type="text/markdown" and rel="describedby" links in each page's head.
- Only include published content. Drafts must not appear anywhere, and their .md URLs must 404.
- Check every file with curl when you're done, then open a PR with tests.
```

## What next: WebMCP

llms.txt is a static text door for any agent that can fetch a URL, even if it never runs JavaScript.

WebMCP is the next step. The agent is already on the page and can call tools. It can ask for counts, a topic brief, or a video's chapters, instead of reading files and adding things up by hand.

I go through how I added those tools in [my WebMCP post](/blog/webmcp-on-my-site).

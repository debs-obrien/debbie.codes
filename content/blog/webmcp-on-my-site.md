---
title: "One Tool Call Instead of Four Pages: Adding WebMCP to My Site"
date: 2026-10-27
description: "AI agents that open debbie.codes in a browser can now call four small WebMCP tools to find my videos, posts, podcasts and courses, instead of reading pages and guessing."
tags: [ai, mcp, agents, grok-bot]
published: true
image: /images/blog/covers/webmcp-on-my-site.png
ogImage: /images/blog/covers/webmcp-on-my-site.png
---

I asked an agent what I've published about MCP. It opened four pages, read about 240 KB of HTML, and still had to count everything by hand. Now it makes one tool call and gets the answer back in about 383 tokens.

This post is about how I added WebMCP to debbie.codes, what it is, how you can try it, and how it compares to the other ways agents read websites.

I built it with Cursor cloud agents, coordinated by my Grok Bot site lead. I reviewed and merged the changes.

## What is WebMCP

WebMCP is a proposed web standard. A page registers tools with the browser. Each tool has a name, a description, a JSON Schema for its inputs and an `execute` function. An agent working in the browser can then find those tools and call them, instead of clicking around and reading the page. On my site that's `document.modelContext.registerTool()`. Older examples use `navigator.modelContext`, but the spec puts it on `document` now. You can read more in the [Chrome WebMCP docs](https://developer.chrome.com/docs/ai/webmcp).

A few things worth knowing:

- It's being worked on in the W3C Web Machine Learning Community Group. There's an [explainer](https://github.com/webmachinelearning/webmcp) and a [draft spec](https://webmachinelearning.github.io/webmcp/).
- There are two ways to add tools: an imperative JavaScript API, which is what I used, and a declarative API using HTML forms.
- WebMCP doesn't replace MCP. Chrome describes MCP as the backend and WebMCP as the frontend. An MCP server works anywhere, while WebMCP tools only exist while the page is open in a tab. Chrome explains the difference in [WebMCP vs MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp).
- Right now it's available through an origin trial, in [Chrome from version 149](https://developer.chrome.com/blog/ai-webmcp-origin-trial) and in [Edge](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials/0b76fe60-b266-458e-a285-04e375c0c31a). For local work Chrome has a flag, `chrome://flags/#enable-webmcp-testing`.
- Chrome's docs say it's designed for a human in the loop, not for headless use, and agents have to visit the page to discover its tools.

## Why I wanted it

My content is spread across videos, blog posts, podcasts and courses, each with their own tag pages. When an agent browses my site for someone, it needs a reliable way to answer "what has Debbie done on this topic?".

Videos are the richest part, and the best answer is often "minute 29 of this talk". No page on my site shows that.

## Where I started

The first version had one tool, `list-videos`, in [PR #652](https://github.com/debs-obrien/debbie.codes/pull/652). It used the same Nuxt Content collection as my videos page.

It worked, but the first call had to load the site's content database in the browser first. On the live site that first call took between 1.1 and 1.4 seconds.

## What I built

In [PR #673](https://github.com/debs-obrien/debbie.codes/pull/673) I changed the approach. Instead of a database in the browser, the site now builds one JSON index of all my content when it's generated, and four small tools read from it:

- `list-videos` lists my videos, filtered by tag.
- `topic-brief` sums up how much I've published on one topic across videos, posts, podcasts and courses, with counts, dates and a few highlights.
- `search-content` searches across everything.
- `get-current-page` tells the agent what the page it's on is about and what's related.

A few details I care about:

- **All four tools are read only.** Nothing on the site changes, and each tool says so with `readOnlyHint`.
- **Every answer stays under 1,500 characters.** If a result is too big, the tool drops extras like highlights and chapters until it fits.
- **Errors are sentences.** If you ask for "playwrite", you get "No content matched topic 'playwrite'. Closest tags: playwright." instead of an exception.
- **Video results link to the right minute.** I copied the YouTube chapter markers into the index, so a search for "healer agent" returns a link straight to the "The Healer Agent" chapter of my talk. Chapters only come from YouTube's own markers or timestamps in the description, and a video needs at least two. Nothing is made up.
- **Normal visitors pay nothing.** If the browser doesn't support WebMCP, the site does one check and loads nothing else.

Here is the check that keeps it free for everyone else:

```ts
export default defineNuxtPlugin(() => {
  const mc = document.modelContext
  if (!mc || typeof mc.registerTool !== 'function')
    return
  import('~/utils/webmcp/register')
    .then(({ registerWebMCPTools }) => registerWebMCPTools(mc))
    .catch(() => {})
})
```

And one of the tool definitions:

```ts
topicBrief: {
  name: 'topic-brief',
  description: 'Summarizes how much Debbie has published on one topic across videos, posts, podcasts, and courses. Use when the task needs counts, a date range, and a few highlights.',
  inputSchema: {
    type: 'object',
    properties: { topic: { type: 'string', maxLength: 80 } },
    required: ['topic'],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
},
```

The same build step also writes [/llms.txt](https://debbie.codes/llms.txt), a plain text file for agents that only read text.

## Making it work for real visitors

Origin trials let normal Chrome and Edge users get the API on my site without turning on a flag. The site adds two origin trial meta tags, one for Chrome and one for Edge.

The tokens only work on debbie.codes, so the tags are only added to the production build. A small `check:origin-trial` script runs in CI, builds the production site and fails if both tags aren't in the HTML.

## Try it yourself

**In Chrome or Edge on debbie.codes**

On debbie.codes you don't need any flag. The origin trial switches the API on. I checked this on Chrome 156 stable with no flags.

1. Use Chrome 149 or newer, or a current version of Edge.
2. Open [debbie.codes](https://debbie.codes) and view the source. You should see two `<meta http-equiv="origin-trial">` tags.
3. Open the DevTools console and run `await document.modelContext.getTools()`. You should see all four tools. When I ran `topic-brief` with `mcp` it took 19 ms. Try the same on example.com and `document.modelContext` doesn't exist, because there's no origin trial there.
4. The tools are also visible to DevTools. The [DevTools WebMCP docs](https://developer.chrome.com/docs/devtools/application/webmcp) explain how to inspect and run them.
5. To ask in plain English instead, install the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd) extension. It needs a Gemini API key. Try "What has Debbie published about MCP?" or "Find where she explains the Playwright healer agent".

**On localhost or a preview site**

The tokens only work on debbie.codes, so turn on `chrome://flags/#enable-webmcp-testing`, restart Chrome and use the DevTools panel or the extension.

**From code with Playwright**

My tests use Playwright's [WebMCP API](https://playwright.dev/docs/api/class-webmcp). Launch Chromium with `--enable-features=WebMCP`. You need that even on the live site, because the origin trial doesn't cover `page.webmcp`. Then:

```ts
await page.goto('https://debbie.codes/')
const tools = await page.webmcp.tools()
const brief = await page.webmcp.callTool('topic-brief', { topic: 'mcp' })
```

**From an MCP client with chrome-devtools-mcp**

Another option is [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), which has experimental WebMCP support behind the `--categoryExperimentalWebmcp` flag. I haven't tried it yet.

**Without WebMCP**

Read [debbie.codes/llms.txt](https://debbie.codes/llms.txt).

## The numbers

These were measured on 27 October 2026. Token counts use OpenAI's `o200k_base` tokenizer, so other models will count a little differently.

**The index**

- 342 items: 157 videos, 137 blog posts, 38 podcasts and 10 courses.
- 121 of the 157 videos have chapters, 1,517 chapters in total.
- The index file is 333,989 bytes, or about 66 KB over the wire with brotli. Agents don't read it whole. The tools do.
- `llms.txt` is 4,394 bytes, about 1,288 tokens.

**Asking "what has Debbie published on MCP?"**

| How | Requests | What the agent reads |
|---|---|---|
| Read the four MCP tag pages as HTML | 4 | 242,528 bytes, about 94,444 tokens |
| Read the visible text of those four pages | 4 | about 2,672 tokens |
| Call `topic-brief` | 1 | 1,293 characters, about 383 tokens |

And the tool answer already has the counts, the first and latest dates and a link to the listing page. With the pages, the agent still has to count and sort, and it gets no chapter times.

**Tool answer sizes**

| Call | Characters | Tokens |
|---|---|---|
| topic-brief "model context protocol" | 1,293 | 383 |
| search-content "healer agent" | 1,273 | 357 |
| list-videos, tag mcp, limit 5 | 1,244 | 361 |
| get-current-page on a blog post | 993 | 280 |
| get-current-page on a tag page | 153 | 39 |
| topic-brief "playwrite" (typo) | 75 | 18 |

**Speed**

| Version | First tool call | Next calls |
|---|---|---|
| #652, reading the content database | 1,108 to 1,433 ms | 8 to 9 ms |
| #673, reading the static index | 6 to 16 ms | 4 to 5 ms |

The new first call is fast because the index is fetched as soon as the tools are registered, before an agent calls anything. The index download is bigger than the old video database (66 KB vs 36 KB with brotli), but it covers all four content types. Visitors without WebMCP download neither.

I haven't measured how long a full task takes with a real agent, or how much a screenshot based agent would spend, so I'm not claiming numbers for those.

## How it compares to other ways agents read a site

| Method | How it works | Trade offs |
|---|---|---|
| Reading the HTML | Load each listing page and parse it | 4 page loads and about 94k tokens of HTML for my MCP question, no counts, no chapter times, and it breaks when the layout changes |
| Screenshots and clicking | Look at the screen and click filters | The problem WebMCP is meant to solve. I didn't measure it |
| A remote MCP server | The agent connects to a server | Works without the site open, but it's another service to host, secure and keep in sync, and the user has to set it up |
| llms.txt | Read one text file | Great for discovery, and I ship one, but it's static, can't be queried, lists only a few items per section and has no chapters. See [llmstxt.org](https://llmstxt.org/) |
| Web search | Search engine results | Depends on the search index, returns pages not answers, and needs more fetches |
| WebMCP tools | One call to a typed tool in the open tab | About 280 to 430 tokens for a full answer, about 18 for an error and about 39 for get-current-page on a tag page, checked inputs, chapter links, read only. Only works while the page is open, in a browser that supports it |

I did both. `llms.txt` is for any agent, and the WebMCP tools are for agents in the browser. Both come from the same build time index, so they can't drift apart.

## What I'd tell you before adding WebMCP to your site

- **Use a static index if your site is static.** A JSON file is fast, cacheable and the same everywhere. It also got rid of my slow first call.
- **Build small tools with one job each.** Give each one a description that says when to use it. Chrome's [best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices) say the same.
- **Cap the answer size.** Keep answers small so they're cheap for any model, and make errors full sentences an agent can act on.
- **Make tools read only where you can,** and say so.
- **Never make up data.** If a video has no chapters, it has no chapters.
- **Keep it free for everyone else.** Feature detect first and load nothing if the browser doesn't support it.

## What's next

- The Edge token needs renewing by 11 December 2026.
- I might add my hire me page to the index.
- The ChatGPT desktop app's built-in browser calls WebMCP tools today ([OpenAI calls them site tools](https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app)). [Google says Gemini in Chrome will support WebMCP soon](https://developer.chrome.com/blog/chrome-at-io26). I haven't tried either on my site yet.
- Maybe a remote MCP server one day, for agents that don't browse.

## Links

- [Chrome WebMCP overview](https://developer.chrome.com/docs/ai/webmcp)
- [Chrome WebMCP origin trial](https://developer.chrome.com/blog/ai-webmcp-origin-trial)
- [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
- [Best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices)
- [WebMCP vs MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp)
- [DevTools WebMCP panel](https://developer.chrome.com/docs/devtools/application/webmcp)
- [WebMCP explainer](https://github.com/webmachinelearning/webmcp) and [draft spec](https://webmachinelearning.github.io/webmcp/)
- [Edge WebMCP origin trial](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials/0b76fe60-b266-458e-a285-04e375c0c31a)
- [Playwright WebMCP API](https://playwright.dev/docs/api/class-webmcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [llms.txt](https://llmstxt.org/)
- [PR #652](https://github.com/debs-obrien/debbie.codes/pull/652) and [PR #673](https://github.com/debs-obrien/debbie.codes/pull/673)

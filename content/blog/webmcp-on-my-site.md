---
title: "One Tool Call Instead of Four Pages: Adding WebMCP to My Site"
date: 2026-11-13
description: "AI agents that open debbie.codes in a browser can now use tools on the page to find my videos, posts, podcasts and courses, instead of reading whole pages and guessing."
tags: [ai, mcp, agents, grok-bot]
published: true
image: /images/blog/covers/webmcp-on-my-site.webp
ogImage: /images/blog/covers/webmcp-on-my-site.webp
---

This post is about how I added WebMCP to [debbie.codes](https://debbie.codes), how you can try it, and how it compares to the other ways agents read websites.

WebMCP lets a site offer tools in the browser, so an agent can ask the page a question and get a short, structured answer instead of reading whole pages and guessing.

I built it with Cursor cloud agents, coordinated by my Grok Bot site lead, and I reviewed and merged the changes. It already runs for real visitors in Chrome and Edge.

## What is WebMCP

WebMCP is a proposed web standard. A page registers tools with the browser. Each tool has a name, a description, a JSON Schema for its inputs and an `execute` function. An agent working in the browser can then find those tools and call them, instead of clicking around and reading the page. On my site that's `document.modelContext.registerTool()`. Older examples use `navigator.modelContext`, but the spec puts it on `document` now. Playwright's [WebMCP docs](https://playwright.dev/docs/api/class-webmcp) still use `navigator.modelContext`. You can read more in the [Chrome WebMCP docs](https://developer.chrome.com/docs/ai/webmcp).

A few things worth knowing:

- It's being worked on in the W3C Web Machine Learning Community Group. There's an [explainer](https://github.com/webmachinelearning/webmcp) and a [draft spec](https://webmachinelearning.github.io/webmcp/).
- There are two ways to add tools: an imperative JavaScript API, which is what I used, and a declarative API using HTML forms.
- WebMCP doesn't replace MCP. [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) is an open-source standard for connecting AI apps to external systems. Chrome describes MCP as the backend and WebMCP as the frontend. An MCP server works anywhere, while WebMCP tools only exist while the page is open in a tab. Chrome explains the difference in [WebMCP vs MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp).
- Right now it's available through an origin trial, in [Chrome from version 149](https://developer.chrome.com/blog/ai-webmcp-origin-trial) and in [Edge](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials/0b76fe60-b266-458e-a285-04e375c0c31a). An [origin trial](https://developer.chrome.com/docs/web-platform/origin-trials) gives a site access to a new or experimental feature for a limited time, using a trial key from the browser. For local work Chrome has a flag, `chrome://flags/#enable-webmcp-testing`.
- Chrome's docs say it's mainly meant for when a person is there in the browser with the agent, not for scripts that drive a browser with no one watching. Agents also have to visit the page to discover its tools.

## Why I wanted it

My content is spread across videos, blog posts, podcasts and courses, each with their own tag pages. When an agent browses my site for someone, it needs a reliable way to answer "what has Debbie done on this topic?".

Videos are the richest part, and the best answer is often "minute 29 of this talk". No page on my site shows that.

## What an agent gets from it

When I tried my videos page with ChatGPT, it listed what the tools gave it compared to reading the page. I checked each point against my code:

- **Precise filters.** It called `list-videos`, one of my site's tools, with the tag `mcp` instead of guessing the topic from titles.
- **More than what's on screen.** The tool reported 27 matching videos, while the page only showed a few.
- **Structured results.** Each video comes back with its title, date, link, tags, conference and host as separate fields.
- **Fewer clicks.** One call replaced clicking through filters and pages.
- **Easier discovery.** Each tool's description tells the agent what it's for and which inputs to use.
- **Deeper search.** `search-content` also searches chapter titles and links straight to that minute of the video. For the full chapter list of one video, `get-video` pages through them.

So my site decides how agents find and understand my content, including details like chapters that are hard to find on the page itself.

## What I built

The site builds one JSON index of all my content when it's generated, and five tools read from it:

- `list-videos` lists my videos, newest first, filtered by tag, conference or host.
- `topic-brief` sums up how much I've published on one topic across videos, posts, podcasts and courses, with counts, dates and a few highlights.
- `search-content` searches across everything.
- `get-video` returns one video by YouTube id, including its chapters, and pages through them if there are many.
- `get-current-page` tells the agent what the page it's on is about and what's related.

A few details I care about:

- **All five tools are read only.** Nothing on the site changes, and each tool says so with `readOnlyHint`.
- **Every answer stays under 2,000 characters.** List, search and get-video results page with `hasMore` and `nextOffset`. If a page is still too big, the tool shortens it and sets `trimmed`, so the agent can ask for the next page.
- **Errors are sentences.** If you ask for "playwrite", you get "No content matched topic 'playwrite'. Closest tags: playwright." instead of an exception.
- **Video results link to the right minute.** I copied the YouTube chapter markers into the index, so a search for "healer agent" returns a link straight to the "The Healer Agent" chapter of my talk. Chapters only come from YouTube's own markers or timestamps in the description, and a video needs at least two. Nothing is made up.
- **No extra load for normal visitors.** If the browser doesn't support WebMCP, the site checks once and stops. The tool code and the content index never load.

Here is the check that skips WebMCP for everyone else:

```ts
export default defineNuxtPlugin(() => {
  const mc = document.modelContext
  if (!mc || typeof mc.registerTool !== 'function')
    return

  const api = { registerTool: mc.registerTool.bind(mc) }
  import('~/utils/webmcp/register')
    .then(({ registerWebMCPTools }) => registerWebMCPTools(api))
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

That object only describes the tool. When the site registers it, it adds the `execute` function, which is what runs when an agent calls the tool:

```ts
for (const [tool, execute] of tools)
  await mc.registerTool({ ...tool, execute }, { signal })
```

The signal comes from an `AbortController`, so the tools can be removed again later. If you're starting from scratch, Chrome's [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) guide has complete `registerTool` examples.

The same build step also writes the site's [llms.txt files](https://debbie.codes/llms.txt). I go through those in Get your site agent-ready.

Origin trials let normal Chrome and Edge users get the API on my site without turning on a flag. The site adds two origin trial meta tags, one for Chrome and one for Edge. The origin trial keys in those tags only work on [debbie.codes](https://debbie.codes), so the tags are only added to the production build. A small `check:origin-trial` script runs in CI, builds the production site and fails unless both tags are in the HTML.

## Try it yourself

**In Chrome or Edge on [debbie.codes](https://debbie.codes)**

On [debbie.codes](https://debbie.codes) you don't need any flag. The origin trial switches the API on. I checked this on Chrome 157 stable with no flags.

1. Use Chrome 150 or newer, or a current version of Edge. Chrome 149 has the API, but its DevTools WebMCP pane still needed flags.
2. Open [debbie.codes](https://debbie.codes) and view the source. You should see two `<meta http-equiv="origin-trial">` tags.
3. Open the DevTools console and run `await document.modelContext.getTools()`. You should see all five tools. To call one, run:

```javascript
const tools = await document.modelContext.getTools()
const brief = tools.find(t => t.name === 'topic-brief')
await document.modelContext.executeTool(brief, { topic: 'mcp' })
```

When I ran `topic-brief` with `mcp` it took 19 ms. Try the same on [example.com](http://example.com) and `document.modelContext` doesn't exist, because there's no origin trial there.

![await document.modelContext.getTools() in the DevTools console on debbie.codes, returning the site's tools](/images/blog/webmcp-on-my-site/01-debbie-console-gettools.webp){width="1920" height="960"}

4. You can do the same without code in the DevTools WebMCP pane.
   1. If you don't see the Application tab, press Ctrl+Shift+P (Command+Shift+P on a Mac) and choose Show Application.
   2. Select WebMCP in the Application sidebar.
   3. The Available tools list shows all five tools with their descriptions. Click `topic-brief`, enter `mcp` next to topic and click Run tool.
   4. The call shows up under Tool activity with its input and output.
   5. If Available tools is empty, WebMCP isn't on for that page, for example on [localhost](http://localhost) without the testing flag. The [DevTools WebMCP panel docs](https://developer.chrome.com/docs/devtools/application/webmcp) have more.

![The WebMCP pane in the Application panel: the tools under Available tools, the details for topic-brief, and topic set to mcp ready to run](/images/blog/webmcp-on-my-site/02-debbie-webmcp-pane.webp){width="1920" height="1357"}

![After you run it, the Output tab shows the result: 46 pieces about MCP, 27 of them videos.](/images/blog/webmcp-on-my-site/03-debbie-output-tab.webp){width="1920" height="1273"}

**On [localhost](http://localhost) or a preview site**

The origin trial keys only work on [debbie.codes](https://debbie.codes), so turn on `chrome://flags/#enable-webmcp-testing`, restart Chrome and use the DevTools panel. Edge has the same flag at `about://flags/#enable-webmcp-testing`.

**From code with Playwright**

My tests use Playwright's [WebMCP API](https://playwright.dev/docs/api/class-webmcp), added in Playwright 1.64. Launch Chromium with `--enable-features=WebMCP`. You need that even on the live site. The origin trial turns on `document.modelContext`, but `page.webmcp` refuses to run without the flag. Then:

```ts
await page.goto('https://debbie.codes/')
const tools = await page.webmcp.tools()
const brief = await page.webmcp.callTool('topic-brief', { topic: 'mcp' })
```

![The Playwright trace viewer shows each WebMCP tool call and what it returned.](/images/blog/webmcp-on-my-site/04-trace-call.webp){width="1400" height="950"}

**From an MCP client with chrome-devtools-mcp**

Another option is [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), an MCP server that lets a coding agent control and inspect a live Chrome browser. It has experimental `list_webmcp_tools` and `execute_webmcp_tool` tools behind the `--categoryExperimentalWebmcp` flag.

**Without WebMCP**

You can also start with [debbie.codes/llms.txt](https://debbie.codes/llms.txt). I walk through those files in Get your site agent-ready.

## Try it with an AI agent

ChatGPT calls WebMCP tools [site tools](https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app). OpenAI's help page says they work in the ChatGPT desktop app's built-in browser, and they're available when your account has access and the website provides site tools.

This is how I tried it:

1. In ChatGPT, open the mode selector, choose Work, and ask it to open [https://debbie.codes/videos](https://debbie.codes/videos).
2. Then ask: "Discover the tools exposed by this website and use list-videos to find videos tagged mcp."

The first half of that prompt is tool discovery, where the agent lists the tools the page exposes. The second half calls one of those tools, `list-videos`.

![ChatGPT found the site's tools, called list-videos with the mcp tag, and got 27 matches back.](/images/blog/webmcp-on-my-site/05-debbie-chatgpt-list-videos.webp){width="1920" height="1168"}

Two things to know:

- Having the page open in Work's browser doesn't always mean WebMCP tool discovery is on, so it may just click around the page instead.
- Site tools are only available to accounts that have access.

To call the tools from code or a coding agent instead, see the Playwright and chrome-devtools-mcp parts of Try it yourself above. Puppeteer also has an experimental [WebMCP API](https://pptr.dev/api/puppeteer.webmcp) on `page.webmcp`, with its own [WebMCP guide](https://pptr.dev/guides/webmcp).

[Google says Gemini in Chrome will support WebMCP soon](https://developer.chrome.com/blog/chrome-at-io26), so more agents should be able to use these tools.

## The numbers

The numbers below were measured on 13 November 2026. Token counts use OpenAI's `o200k_base` tokenizer, so other models will count a little differently.

**Asking "what has Debbie published on MCP?"**

Before WebMCP, an agent answering this opened four tag pages and still had to count everything by hand. Now one tool call answers it in about 562 tokens.

| How | Requests | What the agent reads |
| --- | --- | --- |
| Read the four MCP tag pages as HTML | 4 | 256,713 bytes, about 99,013 tokens |
| Read the visible text of those four pages | 4 | about 2,764 tokens |
| Call `topic-brief` | 1 | 1,900 characters, about 562 tokens |

And the tool answer already has the counts, the first and latest dates and a link to the listing page. This run returned 7 of 46 highlights to fit the size limit. With the pages, the agent still has to count and sort, and it gets no chapter times.

The first tool call takes about 10 ms, because the index loads as soon as the tools register, and visitors without WebMCP never load it.

I haven't measured how long a full task takes with a real agent, or how many tokens a screenshot based agent would use, so I'm not claiming numbers for those.

## How it compares to other ways agents read a site

| Method | How it works | Trade offs |
| --- | --- | --- |
| Reading the HTML | Load each listing page and parse it | 4 page loads, no counts, no chapter times, and it breaks when the layout changes |
| Screenshots and clicking | Look at the screen and click filters | The problem WebMCP is meant to solve. I didn't measure it |
| A remote MCP server | The agent connects to a server | Works without the site open, but it's another service to host, secure and keep in sync, and the user has to set it up |
| llms.txt | Read one text file | Great for discovery, and I ship one. A static file can't be queried and has no chapters, even when the full catalog lists everything. See Get your site agent-ready and [llmstxt.org](https://llmstxt.org/) |
| WebMCP tools | One call to a typed tool in the open tab | One call returns a full answer, with checked inputs, chapter links and read only tools. Only works while the page is open, in a browser that supports it |

I did both. `llms.txt` is the static first step, and I wrote about that in Get your site agent-ready. The WebMCP tools are for agents already on the page. Both come from the same build time index, so they can't drift apart.

## What I'd tell you before adding WebMCP to your site

- **Use a static index if your site is static.** A JSON file is fast, cacheable and the same everywhere.
- **Build small tools with one job each.** Give each one a description that says when to use it. Chrome's [best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices) say the same.
- **Cap the answer size, and say what you left out.** Keep answers small so they don't fill the model's context. Always return the real total and a way to get the next page, so an agent never mistakes a short list for the full answer. Make errors full sentences an agent can act on.
- **Make tools read only where you can,** and say so.
- **Never make up data.** If a video has no chapters, it has no chapters.
- **Don't slow the site down for everyone else.** Feature detect first and load nothing if the browser doesn't support it.

Open [debbie.codes](https://debbie.codes) in ChatGPT's browser and ask it to discover the tools on the page and use them to find something about my work, like my MCP videos. If you have a site of your own, try adding a tool or two. It's a small step, and I'd love to hear what you build.

---
title: Automating Form Submissions with Playwright MCP and a Prompt file
date: 2025-07-10
description: Have you ever wished you could automate browser tasks — like filling out a form or uploading a file — without writing a full-blown test script? What if all you needed was a plain-text prompt written in natural language? Well now you can with Playwright's MCP server.
tags: [playwright, mcp, ai]
canonical: https://dev.to/debs_obrien/automating-form-submissions-with-playwright-mcp-and-a-prompt-file-43c3
published: true
---

Have you ever wished you could automate browser tasks — like filling out a form or uploading a file — without writing a full-blown test script? What if all you needed was a plain-text prompt written in natural language?

Well now you can with the **Playwright's MCP (Model Context Protocol) server**.

With just a `.prompt.md` file in VS Code, I was able to:

- Fill out a form
- Upload an image
- Submit it — all hands-free

And I can re-run it any time and easily update the prompt with a different title, date and guest for my event. No rewriting scripts. No code needed.

Let me show you how it works.

## What is MCP?

MCP stands for **Model Context Protocol**, and it's a new way to give LLMs tools to do things like automate your browser and fill in forms.

Instead of writing JavaScript or TypeScript to control the browser, you write a **prompt** — just like you would when chatting with an AI assistant. Behind the scenes the LLM (large language model) interprets your prompt and uses the Playwright MCP server to automate your browser.

You describe _what_ you want to do, and the MCP server opens a browser and navigates, clicks, types and even uploads an image.

## The Use Case: Form + File Upload

Here's what I wanted to automate:

- Open a webpage with a form I need to fill in every so often
- Fill in fields like title, date, social links
- Upload a local image file
- Click submit

### I wrote a .prompt.md like this:

```md
Navigate to https://example.com/form

1. Show: playwright live
2. Date: 15 July
3. Time: 1:00 AM
4. Topic: Playwright Live - Latest updates on Playwright MCP + Live Demo ....
13. image file `./selfie.png` in the upload section. Click the Submit button when done.
```

That's it.

## How It Works

I ran the prompt using the Playwright MCP server by clicking the play button in VS Code.

And just like that — the browser opened, filled out the form, uploaded the file, and submitted it for me. All powered by the LLM interpreting the prompt and interacting with the page in real time.

## Easily Repeatable and Editable

Here's what makes this workflow magical:

- ✅ I can re-run the same flow anytime.
- ✏️ I can update the form values by editing a markdown file
- 🤖 It's fast to prototype browser interactions with natural language

<iframe width="560" height="315" src="https://www.youtube.com/embed/NSpCfRDS7vo" title="Automate Form Filling with a Prompt file and the Playwright MCP" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## What's Next?

This is just scratching the surface of what the Playwright + MCP can do. I'll be exploring more of these use cases soon.

If you're interested in prompt-driven browser automation or AI + testing/dev tooling, follow along and let me know what you think in the comments. Would love to know what you automate.

## Links

- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Set up Playwright MCP](https://youtu.be/cifdyJkKs04)

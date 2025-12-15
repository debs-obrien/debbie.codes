---
title: Debugging My Zsh Config With Goose (and Why Agentic AI Actually Helped)
date: 2025-12-15
description: I've been playing around with a few things recently and wanted to share a real experience that genuinely surprised me. When Goose CLI wouldn't run, the agent investigated my .zshrc file and found a subtle syntax error that would have taken me much longer to debug manually.
canonical: https://dev.to/debs_obrien/debugging-my-zsh-config-with-goose-and-why-agentic-ai-actually-helped-1noh
tags: [ai, webdev]
published: true
---

I've been playing around with a few things recently and wanted to share a real experience that genuinely surprised me.

You might have seen the news from the Linux Foundation announcing the formation of the Agentic AI Foundation. As part of that, a few projects were donated into the foundation, including the Model Context Protocol (MCP), Agents.md, and Goose.

I'm guessing a lot of people haven't heard of Goose yet. I hadn't either until recently, so I figured I'd dig into it and see what it's actually about.

If you want the full announcement, you can read it on the Linux Foundation website. This post isn't about the announcement though — it's about what happened when I tried to use Goose for real.

## What is Goose?

Goose was released in early 2025, so it's still very new. It's open source (which I love), and it's a local-first AI agent framework. It combines language models with extensible tools like MCP so it can actually do things, not just talk about them.

There's both a desktop app and a CLI. I'm much more of a desktop app person than a CLI person, but everything seems to be going CLI these days, so I decided to give the Goose CLI a try.

The docs live at block.github.io, and I did start reading them. Like most people, I got through the first bit and then thought, "I'll figure it out as I go."

That decision led me directly into a very familiar kind of developer pain.

## The Problem: Goose Wouldn't Run

I installed the desktop app first and then followed the docs to install the CLI. The instructions said that after updating my `.zshrc`, I should be able to run the `goose` command.

I couldn't. No matter what I did, I kept getting:

```
zsh: command not found: goose
```

I sourced my `.zshrc`. I ran `goose --help`. Nothing worked. The agent kept telling me everything was done correctly, and I kept replying with some version of, "No, it's not working."

This is where it got interesting.

## Goose Didn't Argue — It Investigated

Instead of looping on generic advice, Goose pointed out something important: terminal config changes are only picked up when a new session starts. That's something I *always* forget.

So I closed the terminal, opened a new one, and tried again.

Still broken.

At this point, Goose acknowledged that something wasn't right. It explained that if sourcing the file and restarting the terminal didn't work, then one of two things was probably happening:

- The change didn't save correctly
- Another startup config was overriding the PATH

Honestly, that explanation alone would normally make me sigh and prepare to lose an hour.

Instead, Goose suggested checking the file directly.

## Letting an AI Read My `.zshrc`

Goose used a tool to open my `.zshrc` and read it. I didn't need to install this tool. Reading `.zshrc` files is not something I do often and I definitely don't enjoy debugging them.

Goose scanned through all the usual stuff, pnpm, bun, nvm, PATH exports and then immediately spotted the problem.

When it had added the Goose PATH export earlier, it didn't include a newline. That meant the new export was stuck onto the end of the previous line, creating a syntax error.

I wouldn't have noticed that quickly. I was looking at the file and just seeing noise.

Goose explained exactly what went wrong, showed me the broken line, and explained that it should really be two separate lines.

Then it fixed it. It replaced the bad line with two clean, correctly formatted lines and even added a comment to make it clearer for the future.

After that, Goose asked me to restart my terminal one more time. This time, when I typed goose, the command worked. I could see all the available commands. Sessions, MCP servers, bundled tools, everything was there.

At that point, I just sat back for a second. Not because this was some massive, complex bug, but because this is exactly the kind of small, annoying issue that can completely derail your flow.

## Why This Actually Matters

If I had debugged this myself, I would have figured it out eventually. But it would have taken time, frustration, and a lot of trial and error. Instead, the agent noticed something was off. It inspected a real config file and identified a subtle syntax error, fixed it safely and then it explained what happened.

That's the difference between AI that answers questions and AI that actually helps you get unstuck.

I also didn't know Goose could edit files like this. Seeing it work through the problem step by step, without pretending everything was fine when it wasn't, made a big difference.

We don't have the answers to everything as developers. That's normal. What is changing is how quickly we can get unblocked.

If something doesn't feel right, push back. Say it's not working. Let the agent iterate. Let it re-check assumptions. That's where this starts to become genuinely useful.

If you're curious about Goose, it's worth a look. And even if you're not, this kind of experience is a good reminder that using AI well isn't about shortcut, it's about reducing unnecessary friction.

That's it. Have fun experimenting with AI.

### Useful Links:

- [Goose](https://block.github.io/goose/docs/getting-started/installation/)
- [Linux Foudation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)

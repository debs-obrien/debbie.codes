---
title: "An Agent That Hunts Bugs in My App While I Sleep"
date: 2026-07-10
description: "Every hour, an agent opens our real app, clicks around like a tester, and files honest bug reports. A second agent fixes them. Here is how it works."
tags: [ai, agents, testing, playwright]
published: true
canonical: https://theaiplatform.app/blog/an-agent-that-hunts-bugs-while-i-sleep/
---

I have a teammate who never sleeps, never gets bored, and spends every hour poking at our app trying to break it. It is an agent. Every hour it opens the real app, clicks around like a tester would, and files a bug report for anything that looks off.

A second agent then picks up those reports and fixes them. I want to walk you through how it works, what it has actually found, and the parts that do not work at all.

## The setup

The app under test is [The AI Platform](https://theaiplatform.app) by [Zephyr Cloud](https://zephyr-cloud.io), a desktop app where teams work alongside AI specialists in channels. The agent drives the **real, signed-in desktop app** with [Playwright](https://playwright.dev) over CDP, the Chrome DevTools Protocol. Not a stripped-down test build, the same app a person uses.

That distinction matters. It is not clicking through a mockup or hitting an API. It is looking at the actual product, the way a new user would, and noticing when something feels wrong.

## Hunt, reproduce, fix

There are really two agents, running on their own schedules.

![The loop: one agent hunts and files, a second reproduces and fixes, and a human reviews the pull request](https://theaiplatform.app/blog/an-agent-that-hunts-bugs-while-i-sleep/loop-diagram.png)

The first one **hunts**. It explores routes, opens dialogs, fills forms, and watches how the app responds. When it finds something, it writes a proper bug report with reproduction steps and a screenshot, and files it as a GitHub issue.

The second one **fixes**. It picks up an issue, reproduces the bug for itself first, patches it, captures before and after proof, and opens a pull request. A human still reviews and merges. The agents just do the tedious middle bit.

## Finding bugs was the easy part

Here is the thing I did not expect. Getting an agent to find bugs is not hard. Getting it to be honest about what it found is the whole game.

An eager agent will report everything as a bug, including things that are working as designed, things caused by test data, and things it simply is not sure about. That noise is worse than silence, because you stop trusting it.

So the hunter has to classify every finding as one of:

- **Bug**: genuinely broken
- **Expected but bad UX**: works, but should not
- **Environment or data issue**: setup, not the product
- **Test gap**: missing coverage, not a live bug
- **Inconclusive**: could not confirm it

And it attaches a confidence level. High means it reproduced the issue in that run with clear steps. Medium means probably, but one thing is uncertain. Low means suspicious but not enough to file.

The rule that makes it trustworthy: it only files an issue for a high-confidence, reproducible product bug. Everything else it holds back. I would much rather it say "I could not confirm this" than guess and cry wolf.

## What it has actually found

The hunter has filed real issues, and they are the kind of quiet, low-key bug that is easy to miss when you are focused on shipping the next feature. A few real ones:

- A chat channel that just sits on "Fetching message history" forever. No error, no timeout, you are simply stuck.
- A GitHub token field that looks like it saved, but quietly did not because the token format was off. It never told you.
- A settings page that loads the home screen instead, and leaves the home buttons stuck and unclickable.
- A chat pane that shrinks down to a one-pixel sliver the moment you open all the side panels together.

None of these throw an error. None would have failed a normal test. They are just wrong in a small, quiet way, and having something patiently checking for them every hour means they get caught early instead of piling up.

## My favourite part: it fixed a bug it caused

Early on, the hunter found that our workflow editor had **no unsaved-changes guard**. You could edit a workflow, navigate away, and your changes vanished silently with no warning. It filed an issue. We added a guard.

Weeks later, the same hunter came back around and found a new problem: that guard now fired a spurious "Unsaved changes" dialog after **every** successful save, even when there was nothing unsaved. It filed that too.

Then the fixer picked it up, reproduced it, traced it to a save that navigated before React had re-rendered, patched it, and opened the pull request that closed it.

![After the fix: the workflow saves cleanly with no spurious dialog](https://theaiplatform.app/blog/an-agent-that-hunts-bugs-while-i-sleep/bug-after.png)

An agent flagged the absence of a feature, we built it, and the same agent later caught the bug that feature introduced, and another agent fixed it. A full circle, and I barely touched it. That is the moment this went from a fun experiment to something we can actually use.

## The rule I care about most: reproduce before you fix

The fixer is not allowed to touch code until it has reproduced the bug itself. No repro, no pull request.

It sounds obvious, but it is the difference between a fix and a guess. Plenty of times the honest outcome is "I could not reproduce this," or "this needs a human," and in those cases it deliberately does not open a PR. A confident-looking patch for a bug you never actually saw is not a fix, it is a liability.

When it does open a PR, it includes a before screenshot showing the real broken state and an after screenshot showing it resolved. And the before shot has to be genuine. An agent will happily produce a convincing "before" from an already-fixed branch if you let it, so that is exactly the thing we lock down.

## Now the honest part: what does not work

If I stopped here it would sound like magic. It is not. Here is where it breaks.

**The webview wall.** CDP only sees inside the app's web view. It cannot see the operating system around it. Native file pickers, the system login window, OS notifications, keychain prompts, none of that is visible to the agent. So a whole category of bugs lives just outside its reach, and it has to be honest about that boundary rather than pretend it checked.

**Silent failures make it hallucinate.** The hardest problems were never loud errors. They were the quiet ones, where something failed without saying so, and the agent happily narrated a success that did not happen. Most of the engineering went into making failure loud, so the agent notices and admits it instead of inventing a happy ending.

**It is not a CI gate.** These runs drive a real, running, signed-in app. That is wonderful for realism and useless as the fast check you run on every commit. It is a separate, slower tier, and treating it like a unit test would only make you sad.

## What I would tell you to steal

If you want to try something like this, the mechanics are not the hard part. Playwright over CDP, a schedule, a couple of prompts. The hard part, and the part worth your time, is the honesty.

Make the agent classify what it found. Make it attach a confidence level. Make it reproduce before it fixes, and let "I could not" be a perfectly good answer. An agent that files ten real bugs and admits to the three it was unsure about is worth far more than one that files thirteen and makes you check every one.

The bugs were never the impressive bit. Building something I could trust to be honest about them was.

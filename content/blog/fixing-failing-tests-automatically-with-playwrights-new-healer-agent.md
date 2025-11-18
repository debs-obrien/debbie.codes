---
title: Fixing Failing Tests Automatically with Playwright's New Healer Agent
date: 2024-11-13
description: If you've ever returned to your test suite to find a sea of red, you're going to love this one. The Playwright Healer Agent is here — and it's changing how we think about test maintenance.
tags: [playwright, ai, testing]
canonical: https://dev.to/debs_obrien/fixing-failing-tests-automatically-with-playwrights-new-healer-agent-13ck
published: true
---

If you've ever returned to your test suite to find a sea of red, you're going to love this one. The Playwright Healer Agent is here — and it's changing how we think about test maintenance.

## What Is the Healer Agent?

The Healer Agent is part of Playwright's new generation of AI-powered agents. Its goal is simple:

> Automatically diagnose, repair, and re-run your failing tests.

Instead of spending time manually debugging selector changes or broken assertions, the Healer Agent can step in, analyze what's wrong, and apply fixes directly to your test code.

And when it can't fix something because the real problem is in your app or backend, it's smart enough to mark that test with `test.fixme`, saving you time and frustration.

## Watching the Healer in Action

When I ran the agent, it immediately found nine failing tests. Then I walked away, literally went to grab a sandwich. By the time I came back, the agent had already finished its work.

Here's what it did under the hood:

1. **Debugged each failing test** — stepping through line by line to understand the failure.
2. **Identified UI mismatches** — for example, a test looking for a `textbox` when the app now uses a `combobox`.
3. **Applied fixes** — updated the locators and assertions to match the actual UI.
4. **Re-ran the tests** — verified that the fixes worked.

One particularly cool example: It saw that a test expected a heading with a certain regex pattern. But after checking a page snapshot, it found there were two separate heading elements. So it automatically adjusted the regex to make the test more flexible, then re-ran the test to confirm the fix.

## Smarter Than Just "Making Tests Pass"

One of my favorite moments was when the agent encountered a failing test that wasn't fixable through code alone.

The test was failing because the backend API wasn't responding, it saw a `Failed to fetch` error in the console logs. Instead of forcing a bad fix or skipping it silently, the agent marked the test as `test.fixme`, with a clear message explaining why:

> "Save operation is failing with `fail to fetch` error — likely a backend issue."

That's exactly how a responsible AI should behave — not hiding the problem, but documenting it.

## Reviewing the Results

At the end of the run, the agent produced a summary:

• ✅ 104 tests passing  
• ⚠️ 3 tests intentionally skipped (`test.fixme`)  
• 🧠 Clear explanations for every change

Every fix was committed right in the codebase, complete with comments and annotations. Reviewing those changes is as easy as opening your editor and scanning the updated tests.

## The Future of Test Maintenance

This is a huge leap forward for automated testing. The Playwright Healer Agent doesn't just "fix" your tests — it understands them.

It's capable of:

• Reading and interpreting test logs  
• Inspecting DOM snapshots  
• Updating selectors, regex patterns, and assertions  
• Recognizing backend or configuration issues  
• Writing and verifying code fixes automatically

You can literally tell it:

```bash
run and fix my tests
```

…and then walk away. When you return, your test suite will be passing (or clearly annotated), ready for your review.

## Final Thoughts

The Healer Agent isn't just a convenience, it's a glimpse of where developer tooling is headed.

We're moving toward a world where AI doesn't just write code, but maintains and adapts it alongside us.

If you haven't tried it yet, give it a spin. Ask the Healer Agent to fix your failing tests, grab a coffee, and come back to review the magic.

👉 Happy healing — and happy testing!

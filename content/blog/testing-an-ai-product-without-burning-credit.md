---
title: "How We Test an AI Product Without Burning Credit"
date: 2026-07-10
description: "Every message in an AI product is a paid model call. Here is how we test the full chat flow end to end and spend nothing doing it."
tags: [ai, testing, playwright]
published: true
canonical: https://theaiplatform.app/blog/testing-an-ai-product-without-burning-credit/
---

Most tests are cheap. You click a button, you assert something changed, you run it a thousand times and nobody notices. Testing an AI product is different, because the interesting behavior comes from a model, and every time you trigger it you pay for it.

We ran straight into this while building a course product on top of [The AI Platform](https://theaiplatform.app). I want to walk you through how we ended up testing the whole chat flow end to end with [Playwright](https://playwright.dev).

## First, what the platform is

[The AI Platform](https://theaiplatform.app) (TAP) by [Zephyr Cloud](https://zephyr-cloud.io) is a desktop app where teams collaborate with AI specialists in channels. Think Slack, but some of the people in the channel are AI agents you can talk to, mention, and hand work to.

You create a channel, mention a specialist, and it responds in the conversation like any other member would. That chat surface is the heart of the product, so it is also the thing we most need to trust.

## What Kent's course is

We partnered with [Kent C. Dodds](https://epicai.pro) to build a course pilot on top of the platform. You can read the [announcement here](https://x.com/_TheAIPlatform/status/2074599443241046105).

The course is a **Product Engineering Workshop**, and it lives inside the platform in a surface we call **Course Studio**. Instead of watching videos, a learner works through real exercises by chatting with AI stakeholders. There is a guide called Kody who helps you frame the problem, and stakeholder specialists like a VP of Product you interview to gather evidence. When you are done, you write a short memo, and a hidden AI evaluator reads the whole conversation and scores it against a rubric.

So it is a real AI product, layered on top of another AI product. Lovely to use. A little scary to test.

## Why testing it is hard

Look at one exercise from the test's point of view. To complete it, a learner:

- mentions the guide and gets a response
- interviews one or more stakeholders and gets responses
- submits a memo
- triggers the evaluator, which reads everything and returns a score

Every one of those steps is a real model call. Routing the message to decide who answers is a call. Each specialist reply is a call. The evaluator is another call, and it is a big one because it reads the entire conversation.

Now multiply that by five exercises, and again by every time the suite runs. If we tested this the obvious way, the cost would climb with every run, and the suite would get slower and flakier the more we added. That is not a suite anyone wants to run.

## The idea: swap the model, keep everything else real

Here is the part I like. We did not mock the whole app or stub out the UI. We kept all of it real, and swapped out only the one expensive piece: the model.

These tests drive the actual desktop app with Playwright, the same app a learner runs. To make that testable, the app exposes its chat provider on `window`. Our harness reaches in, keeps a reference to the real provider, and wraps the three functions that would otherwise talk to a model:

- the one that decides who should answer
- the one that sends a specialist's reply
- the event stream that pushes updates back to the UI

When a test mentions a specialist, the harness answers with a scripted reply instead of calling a model. When the evaluator runs, it returns a fixed rubric result. Everything else, the messages, the timeline, the avatars, the rubric bars, still goes through the real code and renders exactly as a learner would see it.

![Diagram: the real chat UI talks to the harness, which intercepts model calls and returns scripted specialist and evaluator replies, while messages still save through the real API](https://theaiplatform.app/blog/testing-an-ai-product-without-burning-credit/harness-diagram.png)

The messages are still saved through the real chat API. So we are testing the genuine product experience end to end. The only thing missing is the invoice.

You might ask why we did not just mock the network. We wanted the real routing, the real message plumbing, and the real UI to run, and those are exactly the parts a network mock skips over. Intercepting at the provider is the smallest possible swap that leaves everything a learner actually touches intact.

## What we actually test

We run all five exercises as full completions. For each one the test:

- opens a fresh attempt, which creates a real chat room
- mentions the guide and asserts the right reply lands
- interviews each stakeholder and checks their responses
- submits the memo
- watches the real rubric fill in to 100%

It reads almost like a description of what a learner does, which is exactly what you want a test to look like. Here is the shape of it:

```ts
test('learner completes the exercise, no credit burned', async ({ app }) => {
  await installDeterministicHarness(app.page, config);

  await openExerciseAttempt(app.page, config); // real chat room, real UI

  // mention a specialist and assert the scripted reply
  await sendMentionedMessage(app.page, 'Kody', 'Help me frame the problem.');
  await expectAssistantMessage(app.page, config.kodyResponseAnchor, 'Kody');

  // submit the memo, watch the real rubric fill in
  await sendPlainMessage(app.page, config.finalMemo);
  await expect(app.page.getByTestId('course-attempt-eval-chip')).toHaveText(
    /100%/,
  );

  // prove the evaluator was intercepted, not billed
  await expect
    .poll(async () => (await readHarnessCalls(app.page)).evaluatorCallCount)
    .toBeGreaterThan(0);
});
```

## The guardrail that keeps it honest

Here is the trap with an approach like this. A test that looks free but quietly makes one real call is worse than no test at all, because you trust it and the bill creeps up anyway.

So the harness is strict. Any message it does not have a script for does not fall through to a real call. It returns a harmless "ignore" instead. Specialist turns that are not the evaluator return a blocked stub. And we assert that the evaluator was genuinely intercepted, so a test can never silently skip the thing it is meant to check.

I know this matters because I shipped a fix titled exactly this:

> test(course-studio): prevent deterministic tests using providers

One unmatched message used to slip through to the real provider. It worked, the tests passed, and it was quietly costing money on every run. The fix was to make the harness refuse to do that, ever. The test projects are even named with `no-credit` in them, so it is obvious at a glance which suites are safe.

## What worked, and what did not

What worked better than I expected: keeping the UI real. Because we only swap the model, the tests catch real UI regressions. If the timeline stops rendering a reply, or the rubric chip stops updating, the test fails, and that is a genuine product bug, not a mock drifting out of sync.

What did not come for free:

- **Keeping scripts in step with the product.** The scripted replies have to stay believable as the exercises change. When the content moves, the fixtures have to move with it.
- **Making failure honest.** Most of the work was not faking the happy path, it was making sure the harness could not lie. The "ignore unmatched messages" rule and the evaluator assertion both exist because the naive version looked fine while doing the wrong thing.
- **The webview boundary.** These run against the real running app, which is great for confidence but means they are not the fast, isolated unit tests you run on every keystroke. They are their own tier.

## What this means for you

Testing used to be mostly about correctness. With AI products it is also about cost, and the two pull against each other. Mock too much and your tests pass while the real product quietly breaks. Mock too little and every run costs you money.

The way through, for us, was to find the single most expensive call in the stack and intercept it as close to the model as we could, then leave everything else running for real. You keep honest end to end coverage, and the cost stops scaling with your test count. If you are building on top of a model, you will hit this same wall, and I think most teams will end up drawing a line like this somewhere.

The only question really worth getting right is whether you can trust where you drew it. A test that looks free but quietly makes a real call is the dangerous one, because you stop watching the bill. So wherever you draw your line, make it loud when something crosses it. That is the part worth building carefully.

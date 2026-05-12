---
title: How I Used AI to Fix Our E2E Test Architecture
date: 2026-04-29
description: AI-led analysis of a 6% local pass rate — from tracer bullet planning to building an agent skill that transformed 38 spec files with measurable benchmarks.
tags: [testing, playwright, ai]
canonical: https://dev.to/debs_obrien/how-i-used-ai-to-fix-our-e2e-test-architecture-444a
published: true
---

I joined a project with an existing Playwright E2E test suite, 38 spec files, ~165 tests, around 14,000 lines of test infrastructure. My first step was simple: run the tests locally.

8 out of 130 non-skipped tests passed. A 6% pass rate.

The confusing part? CI was green. It turned out CI ran everything with `workers: 1`, multiple workers plus the dev environment meant running tests locally just wasn't possible.

## Step 1: Analysis — asking questions I didn't know the answers to

I had zero domain knowledge of this codebase. No context on why tests were written a certain way, what the custom wrappers did, or where the real problems were. So I started asking AI to analyze everything, the Playwright configs, the page objects, the spec files, the CI workflows. I asked questions to help me understand the codebase and to figure out what we could do to get tests running locally.

Over a few days, this produced 18 analysis documents covering **Architecture**, **Root causes**, **Anti-patterns**, **Silent bugs** and **Test isolation**

The analysis phase was about building a map of a codebase I didn't understand. Every document was a question answered.

## Step 2: The tracer bullet plan

With the analysis done, I had a clear picture of what needed to change. But the question was: in what order, and how do you avoid a big refactor that breaks everything?

The answer was tracer bullets, a concept from *The Pragmatic Programmer*. The idea is to build a thin end-to-end slice through all the layers to prove the architecture works, then expand from there.

I created 8 tracer bullets, each targeting a specific slice:

- **UI fixture chain** — Use worker-scoped and test-scoped fixtures. Prove: fixtures work, teardown works, tests pass in CI.
- **API fixture chain** — Same pattern for API tests. Prove: composable fixtures work for API scenarios.
- **Expand UI migrations** — Apply the proven UI pattern to more files.
- **MFE-scoped projects** — Split one Playwright project into 7 projects by MFE folder (Applications, Organizations, Projects, etc.), each with `dependencies: ['Setup']`.
- **Teardown project** — Add a cleanup project using Playwright's project dependencies.
- **API fixture expansion** — Composable API fixtures (`ownerOrg` → `ownerProject`).
- **UI migration at scale** — Remaining UI spec files.
- **API setup project** — Replace the no-op `globalSetup` with a proper setup project.

The key insight: the dependency graph told me which bullets could run in parallel. Bullets 1 and 2 were independent. Bullet 4 was independent. Bullet 3 depended on 1. This became important later when running multiple AI sessions.

### What a tracer bullet looked like in practice

Bullet 1 targeted a single file with 5 tests. The steps:

- Add the fixture infrastructure (`currentUser` → `sharedOrg` → `project`)
- Migrate `projects-settings-general.spec.ts` to use the fixtures
- Run locally, verify tests pass
- Push, verify CI is green

## Step 3: I created a skill to do the work

Once I had a plan with all 33 tasks organized into phases. I needed something to work through them consistently — same process every time, same quality bar, same benchmarking. So I built a skill: `pw-test-improvement`.

### What the skill does

A strict 7-step process for every change:

- **Identify** — Pick one item from the implementation tracker
- **Baseline** — Run the affected tests 3× before changes, record pass rate and timing
- **Fix** — Apply the change following embedded Playwright best practices
- **Test** — Run 3× after changes, all must pass
- **Compare** — Document before/after benchmarks
- **Update** — Mark the tracker item done
- **Commit** — Only when asked, with a structured PR description

The skill had built-in knowledge: Playwright's locator priority (`getByRole` > `getByLabel` > `getByText` > ...), a list of anti-patterns to avoid (`waitForTimeout`, no-op assertions, CSS class selectors, forced clicks without justification), and migration patterns for replacing the `Actions` wrapper with direct Playwright calls.

It used the Playwright CLI to run tests directly and capture results.

## The architecture changes

### Fixtures replaced boilerplate

The biggest change was moving from repeated `beforeAll`/`afterAll` blocks to Playwright fixtures. Before: each of 5 test files independently called `getUser()`, `createOrg()`, `createProject()` — 15 API calls total. After: worker-scoped fixtures shared across files — 7 calls total (53% reduction).

The key distinction was **worker-scoped vs test-scoped**:

- **Worker-scoped** (`{ scope: 'worker' }`) — created once, shared across all tests in that worker. Good for expensive setup like orgs and projects.
- **Test-scoped** (default) — created fresh for each test. Good for data that tests mutate.

### Project structure

The Playwright config went from one project running all 38 spec files to 7 projects, each pointing to its MFE folder:

```
{ name: 'Applications', testDir: 'apps/ui/applications/e2e', dependencies: ['Setup'] },
{ name: 'Organizations', testDir: 'apps/ui/organizations/e2e', dependencies: ['Setup'] },
{ name: 'Projects', testDir: 'apps/ui/projects/e2e', dependencies: ['Setup'] },
// ... Subscriptions, Host, User Profile
```

This meant you could run `--project=Applications` to test just what you need, HTML reports grouped by area, and heavy specs got their own parallelism settings.

### The serial cascade fix

4 actual test failures looked like 57. Application tests used `serial` mode, so when the first test failed, all subsequent tests in that describe block were marked "did not run." The fix: split heavy specs into a dedicated project, increase timeouts (30s → 60s for `beforeAll`), cap workers to prevent API overload, and use worker-scoped fixtures to share expensive setup.

## What went wrong

Not everything worked first time.

**The cleanup project broke CI.** We added a teardown project with Playwright's project dependencies to clean up test data after runs. It worked locally. In CI, it caused failures — the cleanup ran against a shared environment and interfered with other pipelines. Had to revert it.

**Not everything should be a fixture.** We tried converting everything to fixtures. After reviewing Playwright docs, we rejected one of the fixtures before doing it as worker-scoped fixtures share across files, which would pollute serial tests that need per-file isolation with different options.

## How I worked with AI

This wasn't "tell AI to fix it." It was a collaboration process:

- **Ask questions relentlessly** — "What does this method do?" "Why is this test flaky?" "According to Playwright docs we can do X, can you verify your suggestion based on the docs" I asked hundreds of questions during the analysis phase which lasted a few days.

- **Challenge every suggestion** — "Are you sure? What about edge case X?" If the AI suggested a pattern, I'd ask it to explain why and if it was sure that was a good way of doing it.

- **Use docs as ground truth** — I'd link to Playwright docs and ask "does this align with what's in the docs?" The AI's training data can be outdated; the docs are current.

- **Validate with multiple tools** — I used Goose, Claude Code, and GitHub Copilot. Different tools catch different blind spots and have different opinions just like when you work with different team mates.

- **Check confidence explicitly** — "What's your confidence level on this? why only a 7? How can we get a 10 confidence level?" This surfaces uncertainty the AI might not volunteer and also goes deeper to understanding what we haven't thought about and how we can improve things.

### Running it in practice

I ran up to 4 AI sessions in parallel — based on which tracer bullets were independent of each other. The dependency graph from the implementation plan told me what could safely run at the same time.

I'd switch between sessions to check progress, read through what was being changed, and step in when something needed verifying. The AI did the mechanical work, applying patterns, running tests, capturing benchmarks. I did the oversight, deciding what to fix next, catching when a suggestion didn't look right, and verifying against the actual Playwright docs.

Never more than 4 at a time. I wanted to read and understand everything that was happening.

## What we measured

| Metric | Before | After | Change |
|---|---|---|---|
| API calls per file | 15 | 7 | 53% reduction |
| UI test setup lines | 8 | 3 | 62% reduction |
| API setup/cleanup lines | 15 | 3 | 80% reduction |
| Files with manual try/finally | 15 | 0 | Fixtures handle it |
| Boilerplate removed | — | — | ~1,000 lines |

## What we created along the way

- 18 analysis documents
- 5 implementation guides
- 33 tasks with verification commands
- 1 skill (test improvement)

## Lessons learned

**About testing:**

- Green CI doesn't mean tests work locally
- One real failure can cascade into dozens of phantom failures in serial mode
- Web-first assertions (`expect(locator)`) catch timing issues that manual checks miss
- Fixtures aren't always the answer, some setup belongs in `beforeAll`

**About working with AI:**

- AI is better at applying known patterns than inventing new ones, give it a clear process
- The analysis phase was the highest-leverage use of AI, it found things I'd have missed for weeks
- Multiple tools > one tool, cross-checking catches hallucinations and enhances confidence in the approach
- The skill made it scalable, without it, every fix would need the same instructions repeated
- Keep the human in the loop, 4 parallel sessions, never unattended
- Find the time to do these kind of tasks. They take time at first but then you achieve so much more.
- Use AI just like it's a new colleague that you don't know very well who never turns on their camera so it's hard to get to know them and therefore you can't fully trust them but you know they have good opinions and are good at their job but you need to be sure they have thought things through and are not just being lazy and making bad decisions.

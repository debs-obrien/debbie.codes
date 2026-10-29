---
title: "I Used Skill Creator v2 to Improve One of My Agent Skills in VS Code"
date: 2026-03-21
description: "I just published a video showing how I used Skill Creator v2 to improve an existing AI skill inside VS Code, and honestly, I was seriously surprised at how much this thing does."
tags: [ai, githubcopilot, webdev]
published: true
canonical: https://dev.to/debs_obrien/i-used-skill-creator-v2-to-improve-one-of-my-agent-skills-in-vs-code-fhd
image: /images/blog/covers/skill-creator-v2-agent-skills-vs-code.webp
ogImage: /images/blog/covers/skill-creator-v2-agent-skills-vs-code.webp
---

I just published a video showing how I used Skill Creator v2 to improve an existing AI skill inside VS Code, and honestly, I was seriously surprised at how much this thing does.

What impressed me most is that it does much more than just rewrite instructions.

It can:

- review an existing skill
- suggest targeted improvements
- run evals against a baseline
- compare outputs side by side
- generate benchmark summaries
- help optimize descriptions for better triggering

In the video, I ran it against a skill I had already created to see whether the updated version actually performed better, or if there was anything I was missing.

And it was a ton of fun.

## The Skill I Tested

The skill I used for the demo was a skill I had already created called README Wizard.

It basically generates a polished, professional README for any project and is meant to kick in whenever someone mentions:

- improving a README
- project documentation
- badges
- first impressions for a repo
- making a GitHub repo look more professional

It also checks project metadata, reads best practices, uses badges, Mermaid diagrams, and works from a README template. (need to create a video for this too.. on it)

So rather than creating a skill from scratch, I wanted to see if Skill Creator v2 could improve something real that I had already built.

## Finding Skill Creator v2

The first thing I did was go to `skills.sh` and search for Anthropic.

From there, I found Skill Creator, and it now shows a summary of the skill which is nice.

The skill covers test case creation, evaluation and also runs parallel test cases with and without the skill to measure impact, capturing timing and token usage for comparison.

And on top of that, it generates an interactive browser-based reviewer showing outputs, qualitative feedback, and benchmark metrics.

It also includes description optimization, which is really important for improving skill triggering accuracy by testing realistic trigger and non-trigger queries.

## Installing the Skill

Installing it was pretty straightforward.

I copied the install command from the page, pasted it into the terminal, and then selected where I wanted the skill installed.

## Looking Inside the Skill

Before running it, I wanted to see what was actually inside the Skill Creator skill.

Skills are written for agents, not really for you to sit there and read through line by line, but I always like to have a look.

And this one is pretty complex.

It includes:

- the SKILL.md file
- its own agents
- references and schemas
- Python scripts
- an eval viewer
- review tooling

What I found really cool is that it comes with its own agents:

- an analyzer agent
- a comparator
- a grader

The analyzer looks at comparison results and tries to understand why the winner won and generate better suggestions.

The comparator compares two outputs without knowing which skill produced them.

The grader evaluates expectations against the execution transcript and outputs.

## Running It Against a Real Skill

I then used Skill Creator against my README Wizard skill.

I’ve done this a couple of times now, and I found that in VS Code I sometimes need to be a little more explicit if I want the full benefit of the sub agents.

Claude seems to pick that up more naturally because the skill was built for it, but in VS Code I wanted to make sure it really used everything available.

So I’d definitely encourage being explicit there.

## What It Found

Very quickly, it started identifying issues with my skill.

Things like:

- the workflow being under-specified
- missing guidance for handling existing or missing READMEs
- README best practices being too thin
- sections that should only appear if relevant links exist
- eval coverage being too small
- missing edge cases
- limited project detection

For example, it pointed out that a personal learning repo probably doesn’t need the same sections as every other project.

It also spotted that I only had two evals and suggested adding more realistic test cases, including edge cases like minimal projects and badge-focused README requests.

## Applying Improvements

Once it had reviewed everything, it started applying targeted improvements across the skill files.

This part was honestly kind of exciting to watch because it moved fast.

It updated the skill instructions and made the guidance more explicit.

It improved the best practices.

It tightened up the logic around when certain sections should or shouldn’t be included.

And it expanded the eval coverage.

I could go through the changed files while it was working and see that it wasn’t just randomly changing things. It was making focused improvements that actually made sense.

That part gave me a lot of confidence.

## Adding More Evals

One thing I really liked was how it expanded the eval set.

I had two evals.

It added more.

For example, it created cases around:

- minimal project README generation
- badge-focused requests

And these evals work like tests.

They include assertions such as whether the output has:

- a project description
- a quick start or usage section
- appropriate badges
- the right structure for the kind of project being documented

This was super useful because it meant I wasn’t just guessing whether the skill was better. I could actually measure it.

## Running Sub Agents in Parallel

Then came one of the coolest parts.

It launched sub-agent runs in parallel.

It ran:

- the improved skill
- the old skill baseline

side by side across multiple test cases.

That meant it could directly compare the version with the new changes against the original version.

This is where the workflow really stood out to me. It wasn’t just making edits and calling it a day. It was actually testing whether the changes improved results.


## The Results

After the runs completed, it graded all the outputs against their assertions and generated benchmark results.

The improved skill outperformed the baseline on two out of four evals and tied on the other two.

The overall result improved from 81 to 97.5.

That’s a 20.4% improvement.

Some of the biggest wins came from improving the skill’s ability to:

- generate good content even when metadata is sparse
- adapt README length and sections to different project types instead of always forcing the full template

## The Workspace It Creates

Another thing I wanted to show in the video was the workspace it creates while doing all this.

It creates a workspace folder where it stores things like:

- skill snapshots
- old skill outputs
- grading results
- benchmark data
- iteration files

You don’t necessarily need to go through all of that manually, but it’s very cool that you can.

If you want to inspect exactly what happened at each stage, it’s all there.

That level of visibility is really nice.

## The HTML Eval Viewer

Then I asked whether there was a way to see the benchmarks in HTML.

And yes, there is.

Skill Creator has an eval viewer for that.

This was another really nice surprise.

It launched an HTML review page showing:

- old skill vs improved skill
- formal grades
- pass/fail results
- benchmark comparisons
- review flows for feedback submission

It’s made for a human to read.

You can actually review what happened and decide whether you agree with the results.

I really liked that.

## Description Optimization

And then, because apparently this skill wasn’t done showing off yet, I ran the description optimization flow as well.

This generates trigger and non-trigger queries to see whether your skill description is actually good enough to fire when it should, and stay out of the way when it shouldn’t.

That workflow lets you:

- review trigger queries
- review non-trigger queries
- edit them
- export the eval set
- run the optimization loop

That is super valuable.

A lot of the time, the problem with a skill is not the logic inside it. It’s that the description is not specific enough, or not clear enough, for the agent to trigger it properly.

So I really liked that this was built in too.

## Final Thoughts

If you’re already building custom skills for:

- GitHub Copilot
- Claude Code
- or other coding agents

this is absolutely worth checking out.

And yes, the video is long.

But the skill does a lot, and I found it hard to cut it down because I kept finding more things it could do.

So I pretty much left it as is.

Have fun.

## Watch the Video

<lite-youtube
        videoid="WplS5lycPHM"
        playlabel="Build Better AI Agent Skills With Skill Creator v2 from Anthropic">
</lite-youtube>

If you’re creating your own skills already, or even just experimenting with prompts and instructions, I’d be really curious to know how you’re approaching it.

---
title: I Built an Agent Skill That Turns Rough READMEs Into Polished Docs
date: 2026-03-24
description: How I turned a single-file agent skill into a maintainable README workflow with scripts, references, and evals.
tags: [ai, githubcopilot, webdev]
published: true
---

If you're new to agent skills, start with my beginner guide first:

[What Are Agent Skills? Beginners Guide](https://dev.to/debs_obrien/what-are-agent-skills-beginners-guide-e2n)

That post covers what skills are, how they get loaded, and how to build a tiny one from scratch.

This post picks up where that one stops.

Instead of another tiny example, I want to show you what a practical skill looks like when it solves a real problem.

We are going to take the idea of a skill and use it to turn rough project READMEs into polished docs that are consistent, accurate, and reusable across repos. I picked README generation because the output is easy to judge, it comes up again and again, and once you get it right for one project you want the same quality bar everywhere.

![Before vs After](https://raw.githubusercontent.com/debs-obrien/learn-agent-skills/main/assets/before-vs-after.png)

## The problem with one-off README prompts

You can absolutely ask an agent to improve your README and get something decent back.

Sometimes it will even be very good.

But if you do that across multiple projects, the cracks show up quickly:

- badge styles are inconsistent
- section order changes from repo to repo
- install commands drift away from the actual package manager
- social links get guessed
- simple projects end up with bloated READMEs
- the agent repeats the same repo-scanning work every time

That is exactly the kind of problem skills are good at solving.

Not because they magically make the model smarter, but because they turn a vague prompt into a reusable workflow.

## The first version was just one file

I did not start with a big architecture.

The first version of `readme-wizard` was just a single `SKILL.md` with instructions telling the agent to:

- detect the project name, description, license, git remote, package manager, and CI setup
- add a better structure to the README
- use shields.io badges
- include a Quick Start section with real commands
- show a project structure tree
- add contributor avatars, documentation links, and optional social badges

That first version worked.

And that matters.

One of the easiest mistakes to make with agent workflows is over-engineering too early. A single file is often enough to prove whether the workflow is useful before you invest more time into it.

Here is the important part: start with the smallest thing that can produce a useful result on a real project.

## What broke in practice

Once I started testing the skill on real repos, the limitations showed up quickly.

The main issue was not that the agent could not write a README. It could.

The issue was consistency.

The single-file version was asking the `SKILL.md` to do too many jobs at once:

- writing guidance
- badge formats
- project-type adaptation rules
- README structure templates
- Mermaid diagram templates
- instructions for how to detect project metadata

That creates a few problems.

First, the file gets bloated fast. By the time I had all those rules and templates inline, it was over 150 lines and hard to maintain.

Second, the agent had to figure out how to inspect the repo on every single run. There was no scanning script yet — just instructions saying "detect the package manager, find the license, parse the git remote." The agent would improvise that detection work each time. Sometimes it got it right. Sometimes it missed a CI workflow file, guessed at the wrong package manager, or invented social links that did not exist.

Third, all of that detection reasoning burned tokens and produced inconsistent results. The kind of work that should be boring and repeatable was instead fuzzy and error-prone.

## The turning point: treat the skill like a workflow, not a prompt

That was the point where the skill stopped being just a better prompt and started becoming a real workflow.

The structure ended up looking like this:

```text
.agents/skills/readme-wizard/
├── SKILL.md
├── scripts/
│   └── scan_project.sh
├── references/
│   └── readme-best-practices.md
├── assets/
│   ├── badges.json
│   ├── diagrams.md
│   └── readme-template.md
└── evals/
    └── evals.json
```

Every part has a different job. And that is the point.

## `SKILL.md` became the orchestrator

Instead of being one giant wall of instructions, `SKILL.md` became the thin coordinator.

Its job is to define the workflow:

1. run the scan script
2. read the README best-practices guide
3. build from the template
4. pull badge formats from the badge catalog
5. validate against the eval assertions
6. only load diagram templates if the project actually needs them

That is a much better use of the main skill file.

It keeps the top-level instructions focused on sequence and judgment instead of burying everything in one place.

Here is what the workflow section of the final `SKILL.md` looks like:

```markdown
## Workflow

### 1. Scan the project
Run `scripts/scan_project.sh <project-directory>` to collect structured JSON metadata.

### 2. Read the best practices guide
Read `references/readme-best-practices.md` before writing.

### 3. Build the README
Use `assets/readme-template.md` as the base structure.
Replace {{PLACEHOLDER}} markers with actual project data from the scan.

### 4. Add badges
Read `assets/badges.json` for the full badge catalog.
Only include badges for things that actually exist.

### 5. Validate the output
Review the generated README against the assertions in `evals/evals.json`.

### 6. Optionally add a diagram
Only read `assets/diagrams.md` if the project has multiple components.
```

Short, focused, and easy to follow. Each step points to another file instead of trying to carry everything inline.

## The script handled the mechanical work

The biggest improvement was moving repo scanning into a script.

The skill now runs `scripts/scan_project.sh <project-directory>` and gets structured JSON back with things like:

- project name
- description
- license
- owner and repo
- package manager
- CI provider and workflows
- social links
- directory structure

Instead of the agent improvising that detection work every time, it runs one script and gets clean, structured data back. Boring and repeatable. Exactly what you want for metadata gathering.

The current reference version also goes a bit further. It checks local files first, then uses the GitHub API to look up the repo homepage and crawls it for additional social links. That is a good example of how a skill can evolve — start with the reliable local-file path, then add enrichment once the core workflow is stable.

## References and assets gave everything a home

The remaining pieces fell into two folders.

`references/readme-best-practices.md` holds the writing guidance: section order, tone, project-type adaptation, badge rules, and common pitfalls. The agent only reads it when it is about to write, not every time the skill loads.

`assets/` holds reusable inputs: `badges.json` for badge formats, `readme-template.md` for the base README structure, and `diagrams.md` for Mermaid templates when a project is complex enough to justify one.

This is where the skill becomes easy to customize. Want to change badge styles? Edit the badge catalog. Want a different README structure? Edit the template. Want to skip diagrams for simpler repos? The skill just avoids loading that asset entirely.

Keeping domain knowledge and data out of the main instructions makes the whole thing much easier to maintain.

## Evals made the quality bar explicit

Once the skill was doing real work, I wanted a way to define what good actually meant.

That is what the evals are for.

The `evals/evals.json` file includes prompts for different cases:

- a straightforward README improvement request
- a casual "make this look professional" request
- a minimal project that should not get bloated
- a badge-focused request that should only generate real badges

I like this part because it forces the standards out into the open.

Instead of vaguely feeling that the README is better, you can check for specific things:

- no placeholder text
- badges only for real metadata
- Quick Start commands that match the detected package manager
- section depth proportional to the project
- no fabricated social links

That makes the skill easier to improve without drifting.

## The larger lesson

The interesting thing about this project is not really README generation.

The larger lesson is that a useful skill usually stops looking like a prompt pretty quickly.

It becomes a small system.

Some parts should stay flexible and language-driven.

Some parts should be deterministic.

Some parts should be reusable data.

Some parts should act as tests.

Once you see that pattern, it applies to a lot more than READMEs:

- commit message workflows
- code review checklists
- release note generation
- internal documentation standards
- repo audits
- team-specific engineering conventions

That is the shift I find most useful when working with agents.

You stop asking the model to improvise the whole workflow every time.

Instead, you give it a structure that makes good behavior easier.

## If you want to build your own skill

If you want to build your own skill, this is the path I would recommend:

1. Start with one `SKILL.md`.
2. Test it on a real project as early as possible.
3. Watch for repeated logic and consistency failures.
4. Move mechanical work into scripts.
5. Move domain knowledge into references.
6. Move templates and data into assets.
7. Add evals once the skill matters enough to maintain.

That sequence keeps the architecture earned.

You are not building a folder structure for its own sake. You are extracting parts only when they prove they deserve to exist.

## Try it yourself

If you want to explore the full tutorial series or inspect the finished reference implementation, the repo is here:

[debs-obrien/learn-agent-skills](https://github.com/debs-obrien/learn-agent-skills)

And if you just want to try the skill without building it yourself:

```bash
npx skills add debs-obrien/readme-wizard
```

Then open any project and tell your agent:

```
Improve the README for this project using the readme-wizard skill.
```

The point is not just that a skill can write a better README.

The point is how you get from a useful first draft to something reusable.

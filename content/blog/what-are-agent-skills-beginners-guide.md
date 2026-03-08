---
title: "What Are Agent Skills? Beginners Guide"
date: 2026-03-04
description: A beginner's guide to AI agent skills — what they are, how they work, and how to build your first skill in minutes.
tags: [ai, webdev]
published: true
canonical: https://dev.to/debs_obrien/what-are-agent-skills-beginners-guide-e2n
---

AI agents are smart. But they're generic. Your agent is trained on a ton of general knowledge, but it doesn't have your specific domain knowledge. It doesn't know your preferences, your team's conventions, or how you personally want things done.

When we learn a new skill — playing basketball, riding a bike — we're adding knowledge we didn't have before. Skills work the same way for your agent. You give it the domain knowledge it's missing, personalized to how you want things done.

### What is a skill?

A skill is a reusable set of instructions that teaches an AI agent how to do a specific task well. Think of it like a recipe card you hand to a talented chef. The chef knows how to cook, but they don't know your family's secret sauce. The recipe card tells them exactly what to do.

- **Without a skill** → the agent produces generic output
- **With a skill** → the agent follows your instructions and produces exactly what you want, every time

At its simplest, a skill is just **one file**: a `SKILL.md` with a name, description, and instructions. That's it. You can add extras like scripts, references, assets, and evals — but you don't have to. All you need right now is the `SKILL.md` file.

<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ys1th2hfjfp7d29oam26.png" alt="anatomy of a skill" />

Let's build one.

### Build your first skill

Open VS Code in your project directory. We're going to create a `good-morning` skill step by step.

**Step 1: Create the folder structure**

Create a new folder in your project root. You can use `.agents/`, `.github/`, or `.claude/` — they all work. The `.agents/skills/` path is the cross-agent convention that works with Copilot. Inside that, create a `skills` folder, and inside that, create a folder called `good-morning`. This folder name is your skill's name.

```
your-project/
└── .agents/
    └── skills/
        └── good-morning/
```

**Step 2: Create the SKILL.md file**

Inside the `good-morning` folder, create a file called `SKILL.md`. It must be in capital letters — that's how agents find it.

```
your-project/
└── .agents/
    └── skills/
        └── good-morning/
            └── SKILL.md
```

**Step 3: Add the frontmatter**

Open `SKILL.md` and add the YAML frontmatter at the top:

```
---
name: good-morning
description: "A skill that responds to good morning with a cheerful greeting"
---
```

Two important things here:

- **The name must match the folder name.** If the folder is called `good-morning`, the name must be `good-morning`. If they don't match, your editor will flag it.
- **The name and description are always in context.** Every time you're working in this project, the agent sees the name and description so it knows what skills are available. Keep the description short and specific, this is how the agent knows when to use the skill.

**Step 4: Write the instructions**

Everything below the frontmatter is the skill body. This only gets added to context **when the skill is called**, not all the time. The agent only loads these instructions when it decides to use the skill.

Add the body below the frontmatter:

```
---
name: good-morning
description: A skill that responds to good morning with a cheerful greeting
---

# Good Morning Skill

When the user says good morning, respond with:
- "Hi Debbie, hope you have a great day!"
- Ask if they have done any sport today
- Include a funny joke about sports

## Example

**User:** Good morning
**Agent:** Hi Debbie, have you done any sport today? Here's a funny joke about sports: Why did the soccer player bring string to the game? Because he wanted to tie the score!
```

That's the complete skill. One file. A few lines of instructions. Make it as personal as you like, put your own name in there, change the topic from sports to whatever you want.

### Test it

Start a **new session** from the same directory (skills are discovered at session start) and type:

> Good morning

The agent finds the skill, reads the `SKILL.md` file, and responds.

**In GitHub Copilot**: *"Hi Debbie, have you done any sport today? Here's a funny joke about sports: Why did the bicycle fall over? Because it was too tired from all that cycling!"*

**In Claude Code**: Open Claude Code from the same project directory, say "good morning", and you get the same thing: *"Hi Debbie, have you done any sport today? Here's a funny joke for you: Why do basketball players love donuts? Because they can always dunk them!"*

Skills work across agents. The same `SKILL.md` file works in Copilot, Claude Code, and others. Each agent discovers the skill, reads the instructions, and follows them.

That's a skill in action. Now imagine instead of "good morning", the instructions told the agent how to generate a polished README, write commit messages in your team's format, or review code against your standards. Same idea, bigger impact.

### How skills get loaded

Skills are designed to be efficient with context windows. They use a three-level loading system. The agent only loads what it needs, when it needs it.

<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a1kun34lhdwapm8s56py.png" alt="how skills get loaded" />

**Level 1** is always in the agent's context. It's just the name and description (~100 words). This is how the agent decides whether to use the skill. If someone says "improve my README", the agent scans its available skills and picks the one whose description matches.

**Level 2** loads when the skill triggers. The full SKILL.md body with all the instructions, steps, and examples. This is ideally under 500 lines.

**Level 3** loads on demand. Scripts, references, and assets that the agent pulls in only when it needs them. Scripts can even run without being loaded into context at all, saving tokens. And some resources might not load at all for certain projects. For example, a diagram template file only needs to be read if the project is complex enough to need an architecture diagram. Simple projects skip it entirely.

This matters because context windows are limited. A well-designed skill is lean at the top and detailed at the bottom.

### Where skills live

Skills can be installed at two levels:

- **Project-level**: in your project directory, available only when you're in that directory
- **Global**: in your home directory, available from anywhere

Each agent checks slightly different locations:

**GitHub Copilot (VS Code)**:

```
# Project-level (any of these work)
your-project/.github/skills/
your-project/.claude/skills/
your-project/.agents/skills/

# Personal (works from any directory)
~/.copilot/skills/
~/.claude/skills/
~/.agents/skills/
```

**Claude Code**:

```
# Project-level
your-project/.claude/skills/

# Personal (works from any directory)
~/.claude/skills/
```

The `.agents/skills/` path is part of the [Agent Skills open standard](https://agentskills.io) which is a cross-tool standard, but Claude Code uses its own `.claude/` directory structure, not `.agents/`.

### The skills ecosystem

There's a whole directory of skills at [skills.sh](https://skills.sh) where you can browse and discover skills built by the community.

To install a skill, use the skills CLI:

```
npx skills add anthropics/skills --skill skill-creator
```

This installs the `skill-creator` skill from Anthropic. A skill that helps you create other skills. One command and it's ready to use.

You can see what you have installed:

```
npx skills list
```

And search for skills:

```
npx skills find
```

Skills work across multiple AI agents — Copilot, Claude Code, Cursor, Goose, and many more. The skills CLI handles installing to the right location for each agent.

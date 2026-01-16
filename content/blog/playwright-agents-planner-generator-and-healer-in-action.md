---
title: Playwright Agents Planner, Generator, and Healer in Action
date: 2025-10-06
description: Playwright has introduced a powerful new feature, Playwright Agents. These agents can generate test plans, create tests based on those plans, and even debug and fix failing tests automatically.
tags: [playwright, testing, ai]
canonical: https://dev.to/playwright/playwright-agents-planner-generator-and-healer-in-action-5ajh
published: true
---

Playwright has introduced a powerful new feature: Playwright Agents, new in Version 1.56. These agents can generate test plans, create tests based on those plans, and even debug and fix failing tests automatically. This post demonstrates how Planner, Generator, and Healer agents work together using a movies application as an example.

• 🎭 Planner generates comprehensive test plans.
• 🎭 Generator produces runnable test files from the plans.
• 🎭 Healer debugs and fixes failing tests automatically.

## Getting Started with Playwright Agents

To begin make sure you have the latest version of Playwright installed. Then, run the `init-agents` command with your preferred loop, vscode, claude, or opencode:

```bash
npx playwright init-agents --loop=vscode
```

This command generates the agents along with a seed file.

## Seeding your tests

The seed file is used to seed tests and will be copied into generated tests by the agent. It can be left blank, but it is typically used to include fixtures or setup logic that must run before tests.

For example, in a movies application, a fixture can be defined to create a page containing a list of movies. This page becomes the starting point for the tests and is copied into each generated test file.

```javascript
/* eslint-disable @typescript-eslint/no-unused-vars */
import { listTest as test } from '../helpers/list-test';
import { expect } from '@playwright/test';

test.describe('seed for logged in user', () => {
  test('seed using listPage fixture', async ({ listPage }) => {
    const page = listPage; // set the page to the listPage fixture
  });
});
```

If you don't have any setup logic you can leave the seed file empty or add a `page.goto()` to a starting URL.

## Planner Agent – Creating a Test Plan

The first step is to use the Planner agent to generate a test plan for a specific feature, for example managing the movies list. The plan should be saved in a `specs` folder as it is possible you will have multiple plans.

In VS Code open chat mode and select the Playwright Planner Agent. If using the seed file, it should be added to the context before generating the plan.

### Example Prompt

```
Generate a test plan for managing movies list and save as movies-list-plan.md in specs folder
```

The Playwright Planner Agent explores the site, analyzes the "managing lists" feature, and produces a structured test plan in markdown format. The generated plan can be reviewed and refined as needed.

## Generator Agent – Creating the Tests

The Playwright Generator agent is used to generate test files from the test plan. As the test plan may include numerous testing scenarios you may want to choose to generate tests for a specific section of the plan.

In VS Code open the chat and select the Playwright Generator Agent.

### Example Prompt

```
Generate tests for the "Adding a Movie" section of the movies-list-plan.md
```

The Playwright Generator Agent navigates through the site and executes each of the scenarios from the chosen section of the test plan.

The result is a set of generated test files, a file for each scenario. If you had any setup logic in the seed file, you will see it will have been copied into each test file.

Next step is to run the generated tests.

## Healer Agent – Fixing a Failing Test

Sometimes the generated tests will all pass, but sometimes there might be some test failures. Instead of debugging manually you can leverage the Playwright Healer agent. Start a new chat and select the Playwright Healer agent, and ask it to help fix the failing test.

### Example Prompt

```
Run and fix failing tests
```

The Playwright Healer Agent will run the tests in debug mode, check console logs, network requests and the page snapshots to identify the root cause of the failure. It will keep trying to fix the test until it passes or if the agent believes the functionality is broken it marks the test as skipped.

## Conclusion

Playwright Agents enable AI-powered test generation, execution, and healing with minimal manual effort.

To get started, update to the latest version of Playwright (v1.56)

```bash
npm install -D @playwright/test@latest
```

Then initialise your agents and choose your preferred agent loop:

```bash
npx playwright agents --loop=vscode/claude/opencode
```

With Planner, Generator, and Healer working together, maintaining end-to-end tests becomes faster, smarter, and more reliable.

Happy testing with AI and Playwright Agents!

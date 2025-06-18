---
title: Generate Playwright tests without code access using MCP and Copilot
date: 2025-06-18
description: Discover how to use MCP (Model Context Protocol) and GitHub Copilot to generate Playwright tests without needing access to your application's source code, perfect for testing external sites or black-box testing scenarios.
image: v1734624000/debbie.codes/blog/2024/playwright-mcp-copilot_2x.png
ogImage: https://res.cloudinary.com/debsobrien/image/upload/f_webp,q_80,c_fit,w_480/v1734624000/debbie.codes/blog/2024/playwright-mcp-copilot_2x.png
provider: cloudinary
tags: [playwright, testing, mcp, copilot, automation]
published: true
loading: eager
---

Getting GitHub Copilot to write end-to-end tests usually requires giving it access to your source code. That’s because Copilot on its own can’t open a browser, explore a webpage, or understand how a UI behaves, so it lacks the context needed to generate accurate tests.

But that changes with **Playwright MCP (Model Context Protocol)**.

An MCP acts as a bridge between Copilot and the real browser, allowing it to open websites, interact with UI elements, and take snapshots of the page. This unlocks a whole new capability: generating Playwright tests from natural language instructions, even when you don’t have access to the application’s codebase.

In this post, we’ll show how Copilot, with the help of the Playwright MCP, can generate, run, and validate E2E tests just by telling it what you want in plain English and with no access to the source code.


## 🧠 Why Not Just Use Copilot Alone?

GitHub Copilot is powerful—but it typically works best when it has access to your source code. If you're only interacting with a web app in the browser and need to generate tests, Copilot doesn’t have the context it needs.

That's where the **Model Context Protocol (MCP)** changes the game. It gives Copilot the ability to interact with the browser through a real-time interface, gather contextual data like **ARIA snapshots**, and perform UI actions that can be converted into executable Playwright tests.


## 🛠️ Setting Up the Test Prompt

We start with a custom **test generation prompt** inside a `.github/prompts/generate.prompt.md` file. It instructs Copilot to act as a test generator and use all available tools through the MCP agent.

```md
- You are a playwright test generator.
- You are given a scenario and you need to generate a playwright test for it.
- DO NOT generate test code based on the scenario alone. 
- DO run steps one by one using the tools provided by the Playwright MCP.
- Only after all steps are completed, emit a Playwright TypeScript test that uses @playwright/test based on message history
- Save generated test file in the tests directory
- Execute the test file and iterate until the test passes
```

Here’s a sample instruction we give to Copilot in plain English:

```md
Generate a Playwright test for the following scenario:
1. Navigate to https://debs-obrien.github.io/playwright-movies-app
2. search for 'Garfield'
3. verify the movie is in the list
```

From here, Copilot and MCP take over.


## 🌐 From Browser Interaction to Test Code

Once the command is triggered in Copilot Chat (using **Cloud 3.5 Sonnet** in this example), the MCP spins up a browser session and starts executing the steps.

### Key highlights:
- It navigates to the given URL using the Playwright MCP server.
- It encounters a challenge locating the search field, so it uses a **page snapshot** to analyze the DOM.
- It identifies the right input, types “Garfield,” and proceeds.
- Finally, it auto-generates a Playwright test using those interactions.

The MCP provides Copilot with rich contextual insight about the page, like a vision system for your LLM.


## ✅ Validating the Test

Because our prompt included test validation, Copilot runs the test it just wrote, and it passes ✅

```ts
import { test, expect } from '@playwright/test';

test('Movie search - Search for a movie by title', async ({ page }) => {
  // Navigate to the movies app
  await page.goto('https://debs-obrien.github.io/playwright-movies-app');

  // Click on the search button to activate the search input
  await page.getByRole('search').click();
  
  // Type 'Garfield' into the search input and press Enter
  await page.getByRole('textbox', { name: 'Search Input' }).fill('Garfield');
  await page.getByRole('textbox', { name: 'Search Input' }).press('Enter');

  // Verify that 'The Garfield Movie' appears in the search results
  await expect(page.getByRole('heading', { name: 'The Garfield Movie', level: 2 })).toBeVisible();
});
```


🔁 What’s Next?
From here, you can:
- Review or refine the test
- Use GitHub MCP to open a pull request
- Merge it into your test suite

And remember this all happened without needing access to the codebase.

💡 Why This Matters
This workflow is a major win for:

- QA testers in black-box environments
- Agencies testing external or client-owned websites
- Regulated industries with restricted code access
- Developers wanting to speed up test creation with natural language

🎬 Watch It in Action
Want to see the full demo? Watch the YouTube video and experience how easy it is to generate reliable Playwright tests with the Playwright MCP and Copilot: [Watch the Demo](https://youtu.be/AaCj939XIQ4)

🎉 Final Thoughts
The combination of Playwright, Copilot, and the Model Context Protocol (MCP) unlocks a new level of intelligent automation. 

Go give it a try. Happy testing!

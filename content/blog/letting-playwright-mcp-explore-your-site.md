---
title: Letting Playwright MCP explore your site and write your tests
date: 2025-06-18
description: Learn how to use Playwright MCP (Model Context Protocol) to explore your website and automatically generate comprehensive tests, making web testing more efficient and thorough.
tags: [playwright, testing, mcp, ai]
published: true
loading: eager
canonical: https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1
---

What if your tests could write themselves — just by using your app like a real user?

In this post, we explore how the Playwright MCP (Model Context Protocol) in Agent Mode can autonomously navigate your app, discover key functionality, and generate runnable tests — no manual scripting required.

We’ll walk through a live demo of generating and running a test against a Movies app, highlighting how the MCP uncovers edge cases, builds coverage, and even surfaces bugs you might miss.

🔧 Setting the Stage
For this demo, I’ve got the MCP Playwright server running locally inside my `.vscode` project folder in a file called `mcp.json`. 

```json
{
    "servers": {
        "playwright": {
            "command": "npx",
            "args": [
                "@playwright/mcp@latest"
            ]
        }
    }
}
```

I’ve prepared a simple test prompt which is located in the `.github` folder and named it `generate_tests.prompt.md`:

```md
---
tools: ['playwright']
mode: 'agent'
---

- You are a playwright test generator.
- You are given a scenario and you need to generate a playwright test for it.
- DO NOT generate test code based on the scenario alone. 
- DO run steps one by one using the tools provided by the Playwright MCP.
- When asked to explore a website:
  1. Navigate to the specified URL
  2. Explore 1 key functionality of the site and when finished close the browser.
  3. Implement a Playwright TypeScript test that uses @playwright/test based on message history using Playwright's best practices including role based locators, auto retrying assertions and with no added timeouts unless necessary as Playwright has built in retries and autowaiting if the correct locators and assertions are used.
- Save generated test file in the tests directory
- Execute the test file and iterate until the test passes
- Include appropriate assertions to verify the expected behavior
- Structure tests properly with descriptive test titles and comments
```

Then in VS Code I use Agent Mode and make sure my prompt is added to context and then I simply type:

```md
Explore https://debs-obrien.github.io/playwright-movies-app
``` 

Agent mode uses the Playwright MCP to navigate to the site and use the browser to explore the app like a real user.

🧠 Goal: Let the agent freely navigate, discover functionality, and generate tests automatically based on its interactions.

🧪 Exploration Begins
Once the agent starts exploring, the first thing it tries is the search feature. It types “Star Wars” into the search bar — and immediately, we uncover a bug.

The search results show “Star Wars”, but the movie title returned is “Kill”. That’s clearly wrong.

This is an edge case I hadn’t noticed in manual testing. I’d previously searched terms like Garfield, Deadpool, and Avengers — and everything worked fine. But now, thanks to the agent’s autonomous behavior, I’ve uncovered a regression.

✅ Result: The agent discovered a search issue — something I’d missed entirely.

🌓 Theme Toggling and UI Coverage
Next, the agent toggles the app’s theme switch — switching between dark and light mode. It verifies that the toggle works, clicks through navigation links, and continues its exploratory crawl.

After wrapping up the interactions, the agent summarizes its findings:

- Homepage
- Search functionality
- Movie details page
- Theme toggle
- Navigation

From that list, it selects search functionality as the focus for the test it will generate.

🎯 Note: You can tell the agent how many tests you want. In this case, I requested just one for the demo.

🧾 Test Generation & Execution
The agent generates a full Playwright test file based on the interactions. It even fixes a lint error automatically before running the test.

Here’s the test it generated:
```ts
import { test, expect } from '@playwright/test';

test.describe('Movie search', () => {
  test('Search for a movie by title', async ({ page }) => {
    // Navigate to the movies app
    await page.goto('https://debs-obrien.github.io/playwright-movies-app');

    // Click on the search button to activate the search input
    await page.getByRole('search').click();
    
    // Type 'Star Wars' into the search input and press Enter
    const searchTerm = 'Star Wars';
    await page.getByRole('textbox', { name: 'Search Input' }).fill(searchTerm);
    await page.getByRole('textbox', { name: 'Search Input' }).press('Enter');

    // Verify we're on the search results page with correct title
    await expect(page).toHaveTitle(`${searchTerm} - Search Results`);
    
    // Verify the search results heading contains the search term
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(searchTerm);
    await expect(page.getByRole('heading', { name: 'search results', level: 2 })).toBeVisible();
    
    // Verify that search results are displayed
    await expect(page.getByRole('list', { name: 'movies' })).toBeVisible();
    
    // Click on a movie from search results
    const firstMovie = page.getByRole('list', { name: 'movies' }).getByRole('link').first();
    const movieTitleElement = firstMovie.getByRole('heading', { level: 2 });
    const movieTitle = await movieTitleElement.textContent() || '';
    await firstMovie.click();

    // Verify that the movie details page is loaded with the correct title
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(movieTitle);
    
    // Verify movie details sections are present
    await expect(page.getByText('The Synopsis')).toBeVisible();
    await expect(page.getByText('The Cast')).toBeVisible();

    // Verify recommended movies section is present
    await expect(page.getByRole('heading', { name: 'Recommended Movies' })).toBeVisible();
    
    // Go back to search results
    await page.getByRole('button', { name: 'Back' }).click();
    
    // Verify we're back on the search results page
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(searchTerm);
  });
});
```

Once generated, it opens a terminal and runs the test. It passes ✅.

We then open the Trace Viewer in VS Code to visually inspect the steps taken:

- It searched for Star Wars.
- Clicked through results like Deadpool.
- Verified titles on the movie details page.

It’s a full cycle: exploration → generation → execution → review.

💡 Why This Matters
This might seem like magic — but it’s a real example of AI-assisted development.

Here’s what’s powerful about this approach:
- It caught a real bug I hadn’t seen.
- It saved me time writing boilerplate.
- It provided test coverage ideas based on actual usage paths.
- It produced runnable code I can commit right away or extend into more tests.

You can iterate, refine the prompt, increase test count, or tell the agent to explore different areas. It’s like pairing with an AI-powered tester that never gets tired.

🚀 Try It Yourself
If you're building modern apps and want better test coverage without writing everything by hand, this is your sign to give the Playwright MCP a try.

Just point it at your app, give it a prompt, and let it explore.
You’ll be surprised what it finds — and how quickly you can go from zero tests to real coverage. Test out different models and see what works best for you. For this demo I used Claude Sonnet 3.7.

Check out the (video demo)[https://youtu.be/IixdI2bTR1g]

🧪 Happy testing — and let the bots write your tests. Let me know what you think in the comments and if you tried it out on your site and had some success. It may do things a little different depending on the model and version etc. 

Tip: In my `.vscode` folder in a file called `settings.json` I add this line of code so I don't have to click continue each time. It's great for demos.

```json
{
    "chat.tools.autoApprove": true
}
```

---

*This post was originally published on [DEV.to](https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1).*

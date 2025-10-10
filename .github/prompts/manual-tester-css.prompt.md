---
mode: agent
description: 'Manual testing with Playwright MCP Server'
tools: ['changes', 'search/codebase', 'edit/editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'search/searchResults', 'runCommands/terminalLastCommand', 'runCommands/terminalSelection', 'testFailure', 'microsoft/playwright-mcp/*']
model: 'Claude Sonnet 4'
---

# Manual Testing Instructions

1. Use the Playwright MCP Server to manually test the scenario provided by the user.
2. Navigate to the specified page and perform the described interactions.
3. Observe and verify the expected behavior, focusing on accessibility, UI structure, and user experience.
4. Add a thick red border around all the areas tested.
5. Take a screenshot of the entire page from top to bottom not just what is in viewport. Take several screenshots if necessary and save it/them in the `manual-tests` directory.

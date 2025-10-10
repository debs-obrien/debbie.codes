---
mode: agent
description: 'Generate Playwright tests based on user scenarios'
tools: ['changes', 'search/codebase', 'edit/editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'search/searchResults', 'runCommands/terminalLastCommand', 'runCommands/terminalSelection', 'testFailure', 'microsoft/playwright-mcp/*']
model: 'Claude Sonnet 4'
---

# Test Generation with Playwright MCP

Your goal is to generate a Playwright test based on the provided scenario after completing all prescribed steps.

## Specific Instructions

- You are given a scenario and you need to generate a playwright test for it. If the user does not provide a scenario, you will ask them to provide one.
- DO NOT generate test code based on the scenario alone.
- DO run steps one by one using the tools provided by the Playwright MCP.
- Only after all steps are completed, emit a Playwright TypeScript test that uses `@playwright/test` based on message history
- Save generated test file in the tests directory
- Execute the test file and iterate until the test passes

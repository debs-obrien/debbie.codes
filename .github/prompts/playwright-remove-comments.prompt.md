---
mode: agent
description: 'Remove unnecessary comments from Playwright tests'
tools: ['changes', 'search/codebase', 'edit/editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'search/searchResults', 'runCommands/terminalLastCommand', 'runCommands/terminalSelection', 'testFailure', 'microsoft/playwright-mcp/*']
model: 'Claude Sonnet 4'
---

Remove any unnecessary comments from the Playwright tests. Comments should only be used to explain complex logic or non-obvious interactions. Remove comments that simply restate what the code is doing, as this clutters the code and makes it harder to read.

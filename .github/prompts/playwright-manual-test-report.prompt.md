---
mode: agent
description: 'Manually test a site and create a report'
tools: ['changes', 'search/codebase', 'edit/editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'search/searchResults', 'runCommands/terminalLastCommand', 'runCommands/terminalSelection', 'testFailure', 'microsoft/playwright-mcp/*']
model: 'Claude Sonnet 4'
---

# Manual Testing Instructions

1. Use the Playwright MCP Server to manually test the scenario provided by the user. If no scenario is provided, ask the user to provide one.
2. Navigate to the url provided by the user and perform the described interactions. If no url is provided, ask the user to provide one.
3. Observe and verify the expected behavior, focusing on accessibility, UI structure, and user experience.
4. Report back in clear, natural language:
   - What steps you performed (navigation, interactions, assertions).
   - What you observed (outcomes, UI changes, accessibility results).
   - Any issues, unexpected behaviors, or accessibility concerns found.
5. Reference URLs, element roles, and relevant details to support your findings.

Example report format:
- **Scenario:** [Brief description]
- **Steps Taken:** [List of actions performed]
- **Outcome:** [What happened, including any assertions or accessibility checks]
- **Issues Found:** [List any problems or unexpected results]

Generate a .md file with the report in the `manual-tests` directory and include any relevant screenshots or snapshots.

Take screenshots or snapshots of the page if necessary to illustrate issues or confirm expected behavior.

close the browser after completing the manual test.

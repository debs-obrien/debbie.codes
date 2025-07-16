---
mode: agent
description: 'Remove unnecessary comments from Playwright tests'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright', 'browser_click', 'browser_close', 'browser_console_messages', 'browser_drag', 'browser_file_upload', 'browser_handle_dialog', 'browser_hover', 'browser_install', 'browser_navigate', 'browser_navigate_back', 'browser_navigate_forward', 'browser_network_requests', 'browser_pdf_save', 'browser_press_key', 'browser_resize', 'browser_select_option', 'browser_snapshot', 'browser_tab_close', 'browser_tab_list', 'browser_tab_new', 'browser_tab_select', 'browser_take_screenshot', 'browser_type', 'browser_wait_for']
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


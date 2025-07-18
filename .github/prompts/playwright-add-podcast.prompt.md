---
mode: agent
description: 'Add a new podcast to the content/podcasts directory'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'Claude Sonnet 4'
---

# Add a new podcast

You can add a new podcast by creating a new file in the `content/podcasts` directory.

Add a new podcast using the MCP server to navigate to the URL to get the required info you need. 
- Ask the user for the url if not provided.
- Ask the user for the image if its a new podcast
- Do not invent titles and descriptions. 
- Do not add extra tags only add ones that already exist in the other video files. 
- Make sure the date for the podcast is correct. If you do not know the date ask for it.
- Make sure you add a host
- Close the browser when done.

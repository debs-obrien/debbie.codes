---
mode: agent
description: 'Add a new blog to the content/blog directory'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'Claude Sonnet 4'
---

# Add a new blog

You can add a new blog by creating a new file in the `content/blog` directory.

Add a new blog using the MCP server to navigate to the URL to get the required info you need. 
- Ask the user for the url if not provided.
- Do not invent content. 
- Do not add extra tags only add ones that already exist in the other video files. 
- Make sure the date for the blog is correct. If you do not know the date ask for it.
- if the blog is hosted elsewhere then state that and add the canonical url but take the complete content from the blog.
- Don't add an image
- Close the browser when done.

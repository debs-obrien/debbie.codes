---
agent: agent
description: 'Add a new blog to the content/blog directory'
tools: ['search/changes', 'search/codebase', 'edit/editFiles', 'web/fetch', 'read/problems', 'execute/getTerminalOutput', 'execute/runInTerminal', 'read/terminalLastCommand', 'read/terminalSelection', 'execute/createAndRunTask', 'execute/getTaskOutput', 'execute/runTask', 'execute/runTests', 'search/searchResults', 'read/terminalLastCommand', 'read/terminalSelection', 'execute/testFailure', 'playwright/*']
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

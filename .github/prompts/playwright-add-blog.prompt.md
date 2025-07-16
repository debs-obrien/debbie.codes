---
mode: agent
description: 'Add a new blog to the content/blog directory'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright', 'browser_click', 'browser_close', 'browser_console_messages', 'browser_drag', 'browser_file_upload', 'browser_handle_dialog', 'browser_hover', 'browser_install', 'browser_navigate', 'browser_navigate_back', 'browser_navigate_forward', 'browser_network_requests', 'browser_pdf_save', 'browser_press_key', 'browser_resize', 'browser_select_option', 'browser_snapshot', 'browser_tab_close', 'browser_tab_list', 'browser_tab_new', 'browser_tab_select', 'browser_take_screenshot', 'browser_type', 'browser_wait_for']
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

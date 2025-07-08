---
description: 'convert parts of test to use toMatchAriaSnapshot'
---

use `toMatchAriaSnapshot` instead of `toBeVisible()` for visibility checks when 2 or more elements are involved.

Do not add long paragraph texts to the yaml. You can add the node paragraph and node text if it is important but not the text content.

Add `url` to the yaml if not already present. You can find the correct url by navigating to the page with the Playwright MCP Server and viewing the page snapshot.

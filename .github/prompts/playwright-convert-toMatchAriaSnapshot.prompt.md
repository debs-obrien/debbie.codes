---
description: 'convert parts of test to use toMatchAriaSnapshot'
---

use `toMatchAriaSnapshot` instead of `toBeVisible()` for visibility checks when 2 or more elements are involved.

 - Do not add text content or paragraph content to the yaml. Choose one of the following strategies:   
    - Omit the text content entirely - Just reference the element without its text:
    - Use partial text matching - Include just the beginning of the text:
    - Focus on structure over content - Test the presence and hierarchy of elements without their text content.
  - Add `url` to the yaml for any links if not already present. You can find the correct url by navigating to the page with the Playwright MCP Server and viewing the page snapshot. 

add examples here of to be visible and toMatchAriaSnapshot

```typescript
await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
```


```typescript
await expect(page.getByRole('button', { name: 'Submit' })).toMatchAriaSnapshot();
```

ask it to put an empty aria and match the test.... start there then trim it down

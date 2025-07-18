---
mode: agent
description: 'Convert parts of test to use toMatchAriaSnapshot'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'playwright']
model: 'Claude Sonnet 4'
---

use `toMatchAriaSnapshot` instead of `toBeVisible()` for visibility checks when 2 or more elements are involved.

 - Do not add text content or paragraph content to the yaml. Choose one of the following strategies:   
    - Omit the text content entirely - Just reference the element without its text:
    - Use partial text matching - Include just the beginning of the text:
    - Focus on structure over content - Test the presence and hierarchy of elements without their text content.
  - Add `url` to the yaml for any links if not already present. You can find the correct url by navigating to the page with the Playwright MCP Server and viewing the page snapshot. 

Create an empty `toMatchAriaSnapshot` as this will populate when you run the tests so no need to add any YAML in here. 

When selecting an element don't go too high in the hierarchy, try to select the element that is closest to the group of elements you want to test.

## Example Usage

```typescript
await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
```
Change to:

```typescript
await expect(page.getByRole('main')).toMatchAriaSnapshot('');
```

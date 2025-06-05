---
mode: 'agent'
description: 'fixing broken tests'
---

  - run all tests using `npx playwright test `
  - then only use `npx playwright test --last-failed` and fix the ones that are broken using the playwright MCP to help you manually test the site, navigate, click and take a snapshot for better understanding of the page layout and functionality. 
- Don't re run all passing tests. only focus on the broken tests. Use the --last-failed flag to run only the last failed tests.
- when finished run all tests using `npx playwright test` to ensure all tests are passing.

---
mode: 'agent'
description: 'fixing broken tests'
---

- identify the tests that are failing and understand the reason for the failure by reading the error messages and stack traces.
- check the test code and the application code to see if there are any obvious issues that can be fixed.
- if the issue is with the test code, fix the test code to make it pass.
- if the issue is with the application code, fix the application code to make the tests pass.
- only re-run the test that you are working on. Don't run all tests again until you have completed all fixes.
- Use the playwright MCP to help you manually test the site, navigate, click and take a snapshot for better understanding of the page layout and functionality.
- Don't re-run all passing tests. only focus on the broken tests. Use the --last-failed flag to run only the last failed tests.
- when finished run all tests using `npx playwright test` to ensure all tests are passing.

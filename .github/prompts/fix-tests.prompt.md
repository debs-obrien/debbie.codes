---
mode: 'agent'
description: 'fixing broken tests'
---
# Fixing Broken Tests

When you encounter broken tests in a Playwright project, follow these steps to identify and fix the issues:
1. **Run the Tests**: Start by running the tests to see which ones are failing. Use the command npx playwright test followed by the file name.
   ```bash
   npx playwright test <file-name>
   ```

2. **Review the Output**: Look at the output of the test run to identify which tests are failing. The output will provide error messages and stack traces that can help you understand the issues.

3. **Investigate the Failures**: For each failing test:
   - Read the error messages and stack traces to understand what went wrong.
   - Check the test code to see if there are any obvious issues, such as incorrect selectors, timeouts, or assertions.

4. **Fix the Issues**:
    - If the issue is with the test code (e.g., incorrect selectors, assertions, or setup), fix the test code to make it pass.
    - If the issue is with the application code (e.g., a bug in the feature being tested), fix the application code to resolve the issue.

5. **Re-run the Tests**: After making changes, re-run the tests to see if the issues are resolved. Use the command:
   ```bash
   npx playwright test <filename>
   ```
   This will run only the tests that failed in the last run, allowing you to focus on the issues you are currently addressing.

6. **Use Playwright MCP**: If you need to manually test the site, use the Playwright MCP (Model Context Protocol) to navigate, click, and take snapshots of the page. This can help you understand the layout and functionality of the page better.
7. **Final Run**: Once you have fixed all the issues, run all tests to ensure everything is working correctly:
   ```bash
   npx playwright test
   ```
8. **Iterate**: If there are still failing tests, repeat the process:
   - Investigate the failures.
   - Fix the issues.
   - Re-run the tests.

9. **Commit Changes**: Once all tests are passing, commit your changes to the repository with a clear message indicating that you have fixed the broken tests.

10. **Push Changes**: Push your changes to the remote repository:
    ```bash
    git push origin <branch-name>
    ```

11. **Create a Pull Request**: Create a pull request to merge your changes into the main branch. Provide a clear description of the changes made and the issues fixed.

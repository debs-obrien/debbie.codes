---
mode: 'agent'
description: 'fixing broken tests'
---
# Fixing Broken Tests

Make sure the local dev server is running before starting the tests. 
```bash
npm run dev
```

1. **Run the Tests**: Start by running the tests to see which ones are failing.
   ```bash
   npx playwright test
   ```

2. **Review the Output**: Look at the output of the test run to identify which tests are failing. The output will provide error messages and stack traces that can help you understand the issues. 

3. **Investigate the Failures**: For each failing test:
   - Read the error messages and stack traces to understand what went wrong.
   - Check the test code to see if there are any obvious issues, such as incorrect selectors, timeouts, or assertions.

4. **Fix the Issues**:
    - If the issue is with the test code (e.g., incorrect selectors, assertions, or setup), fix the test code to make it pass.
    - If the issue is with the application code (e.g., a bug in the feature being tested), fix the application code to resolve the issue.

5. **Re-run the Tests**: After making changes, re-run only the last failed tests to see if the issues are resolved. Use the command:
   ```bash
   npx playwright test --last-failed
   ```
   This will run only the tests that failed in the last run, allowing you to focus on the issues you are currently addressing.

6. **Use Playwright MCP**: Use the Playwright MCP SERVER to check the tests are passing. manually test it like a manual tester to make sure it works as expected then make any fixes needed to the tests or the codebase.
Then create a pr with a detailed description of the changes made.

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

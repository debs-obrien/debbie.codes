---
title: Playwright MCP Servers Explained Automation and Testing
date: 2024-11-17
description: Did you know Playwright has two MCP servers? Learn about the Playwright MCP server for browser automation and the Playwright Test MCP server for testing, both designed to work with AI agents and GitHub Copilot.
tags: [playwright, mcp, ai, testing]
canonical: https://dev.to/debs_obrien/playwright-mcp-servers-explained-automation-and-testing-4mo0
published: true
---

Did you know Playwright has two MCP servers? Yes, kinda confusing, let me explain it. The Playwright MCP server is great for Browser Automation, filling out forms for example or even using so LLMs can verify their work by opening the browser and taking a page snapshot to see it actually implemented what it said it did. It is built into GitHub Copilot Coding Agent so if you assign a PR to Copilot it will use Playwright which you can see in the session logs. It is very cool indeed.

Then we have another Playwright MCP server called Playwright Test MCP which is built into Playwright test and is for, yes you guessed it, testing. It has some similar tools as the Playwright MCP server but it also has other ones that you only need if you are testing. It starts running when you use the Playwright Agents, Planner, Generator and Healer. However this MCP server only supports TypeScript/JavaScript for now.

## The Two Different MCP Servers

### Playwright MCP Server

The Playwright MCP server is designed for general browser automation tasks. It's perfect for:

- Filling out forms automatically
- Browser automation workflows
- Allowing LLMs to verify their work by taking page snapshots
- Integration with GitHub Copilot Coding Agent

When you assign a pull request to GitHub Copilot, it will automatically use the Playwright MCP server behind the scenes, which you can see in the session logs.

### Playwright Test MCP Server

The Playwright Test MCP server is specifically built for testing scenarios. It includes:

- Similar tools to the regular Playwright MCP server
- Additional testing-specific tools and capabilities
- Integration with Playwright Agents (Planner, Generator, and Healer)
- Currently supports TypeScript/JavaScript only

## Getting Started

So depending on your needs you can use one MCP server or the other. The Playwright MCP server you need to install while the Playwright Test MCP server is installed when you run an npx command when using the latest version of Playwright.

```bash
npx playwright init-agents --loop=vscode
```

The installing of the MCP server is done for you and it doesn't matter what other MCP server you have as the agent will only use the tools that it has assigned to it.

## Conclusion

Both MCP servers serve different purposes but complement each other well in a comprehensive testing and automation workflow. Whether you're doing browser automation or writing tests, there's a Playwright MCP server designed for your specific needs.

Check out the docs for more info on how to get started. Have fun and happy testing with Playwright MCPs!

## Useful Links

- [Playwright Test Agents Documentation](https://playwright.dev/docs/test-agents)
- [Playwright MCP GitHub Repository](https://github.com/microsoft/playwright-mcp)

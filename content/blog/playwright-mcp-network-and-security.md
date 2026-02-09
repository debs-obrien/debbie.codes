---
title: Networking and Security with Playwright MCP
date: 2025-01-16
description: Network, proxy and security-related configuration options for Playwright MCP.
tags: [playwright, mcp, ai, agents, security]
published: true
---

Never use Playwright or Playwright MCP to browse untrusted web content.
Playwright is not a secure sandbox, and web content can escape the browser context and execute code on your machine.

You can configure network policies to ensure that your agent only accesses trusted content.
To learn more about session and state see [Session and State](/blog/playwright-mcp-browser-profiles-and-emulation#browser-profiles-and-state).

## Allowing and Blocking Origins

You can control which domains the browser is allowed to access. Use `--allowed-origins` to whitelist specific domains and `--blocked-origins` to blacklist them.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--allowed-origins",
        "https://www.good.com",
        "--blocked-origins",
        "https://www.bad.com"
      ]
    }
  }
}
```

## Using a Proxy Server

If you need to route traffic through a proxy, you can use the `--proxy-server` flag.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--proxy-server",
        "http://myproxy:3128"
      ]
    }
  }
}
```

To bypass the proxy for certain domains, use the `--proxy-bypass` flag with a comma-separated list of domains.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--proxy-server",
        "http://myproxy:3128",
        "--proxy-bypass",
        ".com,chromium.org"
      ]
    }
  }
}
```

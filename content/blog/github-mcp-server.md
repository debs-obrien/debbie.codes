---
title: Getting Started with Playwright Testing
date: 2025-04-16
description: The GitHub MCP (Model Context Protocol) Server is a powerful tool that provides seamless integration with GitHub APIs, enabling advanced automation and interaction capabilities. This guide will walk you through how to set up and use the official GitHub MCP Server.
image: v1648106423/debbie.codes/blog/2025/GitHub_MCP_server_2x_1_jizwlw
ogImage: https://res.cloudinary.com/debsobrien/image/upload/f_webp,q_80,c_fit,w_480/v1648106423/debbie.codes/blog/2025/GitHub_MCP_server_2x_1_jizwlw
provider: cloudinary
tags: [mcp, github, ai]
published: true
---

The GitHub MCP (Model Context Protocol) Server is a powerful tool that provides seamless integration with GitHub APIs, enabling advanced automation and interaction capabilities. This guide will walk you through how to set up and use the official GitHub MCP Server.

## What is the GitHub MCP Server?

The GitHub MCP Server implements the [Model Context Protocol](https://modelcontextprotocol.io/introduction), allowing AI tools and applications to interact with GitHub's ecosystem. This server acts as a bridge between AI tools and GitHub's APIs, making it easier to automate workflows, extract data, and build powerful integrations.

## Use Cases

- Automating GitHub workflows and processes
- Extracting and analyzing data from GitHub repositories
- Building AI-powered tools that interact with GitHub's ecosystem

## Prerequisites

Before getting started, make sure you have:

1. [Docker](https://www.docker.com/) installed and running on your system
2. A [GitHub Personal Access Token](https://github.com/settings/personal-access-tokens/new) with appropriate permissions for the GitHub APIs you plan to use

## Installation Options

There are several ways to set up the GitHub MCP Server:

### Option 1: One-Click Installation for VS Code

The easiest way to get started is using the one-click installation buttons that [GitHub provides in the repository README](https://github.com/github/github-mcp-server).

### Option 2: Manual Configuration in VS Code

To manually set up the GitHub MCP Server in VS Code:

1. Open VS Code and press `Ctrl + Shift + P` to open the command palette
2. Type "Preferences: Open User Settings (JSON)" and select it
3. Add the following JSON configuration:

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "github_token",
        "description": "GitHub Personal Access Token",
        "password": true
      }
    ],
    "servers": {
      "github": {
        "command": "docker",
        "args": [
          "run",
          "-i",
          "--rm",
          "-e",
          "GITHUB_PERSONAL_ACCESS_TOKEN",
          "ghcr.io/github/github-mcp-server"
        ],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
        }
      }
    }
  }
}
```

### Option 3: Using with Claude Desktop

To use the GitHub MCP Server with Claude Desktop, add the following configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Conclusion

The GitHub MCP Server provides a powerful way to integrate AI tools with GitHub's ecosystem. Open Copilot in VS Code and choose agent mode and simply ask it to create an issue on one of your repos, or list the open issues or get the amount of stars. Play around with it and see what you can do!


Remember to keep your personal access token secure and to only grant the permissions necessary for your use case.

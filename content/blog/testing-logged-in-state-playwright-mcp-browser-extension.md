---
title: Testing in a Logged-In State with the Playwright MCP Browser Extension
date: 2025-08-21
description: If you've ever needed to test an application that requires authentication, you know the pain of logging in every time or, worse, handing over your credentials to an LLM. With the new Playwright MCP Browser Extension for Chrome and Edge, that's no longer necessary.
tags: [playwright, mcp, testing, ai]
canonical: https://dev.to/debs_obrien/testing-in-a-logged-in-state-with-the-playwright-mcp-browser-extension-4cmg
published: true
---

If you've ever needed to test an application that requires authentication, you know the pain: logging in every time or, worse, handing over your credentials to an LLM.

With the new **Playwright MCP Browser Extension** for Chrome and Edge, that's no longer necessary. You can now launch the MCP server against an **existing browser profile** — one that's already logged in — and test your app.

## Why This Matters for Testers

Previously, using the Playwright MCP server meant:

- Starting from a **clean browser state**
- Manually logging in every time
- Or passing credentials into the LLM (not ideal for security!)

Now, you can:
✅ Reuse a browser profile you already use for testing
✅ Start directly in a logged-in session
✅ Run Playwright MCP commands in that context

This opens up more realistic testing workflows for QA engineers, especially when working with enterprise apps that live behind authentication.

## Installing the Playwright MCP Browser Extension

The extension is available for **Chrome, Edge, or any Chromium-based browser**.

- Download the [Playwright MCP extension](https://github.com/microsoft/playwright-mcp/blob/main/extension/README.md).
- Unzip the file.
- Open `chrome://extensions` or `edge://extensions` in your browser.
- Enable **Developer Mode**.
- Click **Load unpacked** and select the extension folder.

You'll now see the **Playwright MCP Bridge** in your extensions list.

## Configuring the MCP Server

Next, configure your Playwright MCP server to use the extension.

- In VS Code, go to the MCP server settings.
- Add the `--extension` flag to enable extension support.
- If you don't have the Playwright MCP extension installed yet, you can do so directly from VS Code.

```json
"playwright": {
  "type": "stdio",
  "command": "npx",
  "args": [
    "@playwright/mcp@latest",
    "--extension"
  ],
},
```

**Tip**: In VS Code from the extensions tab you can install Playwright MCP server and then use the gear icon to choose the "show configuration JSON" option to easily add "--extension".

That's it — your MCP server is now aware of the extension.

## Testing on a Logged-In Profile

Here's the exciting part:

- Open your browser on the profile you want to use and login to the site you want to test (e.g. GitHub).
- Start your MCP server and ask it to Navigate to a site.
- Choose the tab you want the MCP Server to connect to.

From there, you can instruct Copilot in Agent mode to interact with your app in a **logged-in state**. For example:

- Navigating to your profile page
- Changing account settings
- Generating tests for authenticated user flows

In my demo, I updated GitHub profile pronouns — and MCP handled it seamlessly from the logged-in session.

## Why This is a Game-Changer

This extension makes it possible to:

- Test **real user sessions** without worrying about logging-in
- Run automation against enterprise apps that require authentication
- Keep your login credentials **safe** by staying within your own profile

For testers, this means **faster setup, more realistic tests, and improved security**.

## Get Started

👉 Check out the [Playwright MCP Browser Extension docs](https://github.com/microsoft/playwright-mcp/blob/main/extension/README.md) and try it out for yourself.

I'd love to hear how you use logged-in profiles in your testing workflows. Drop a comment and share your scenarios!

<iframe width="560" height="315" src="https://www.youtube.com/embed/uE0r51pneSA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

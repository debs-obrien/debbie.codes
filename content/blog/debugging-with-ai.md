---
title: Debugging with AI
date: 2025-01-16
description: Debugging with AI using the copy prompt button and fix with AI feature in VS Code.
tags: [playwright, ai, debugging, testing]
published: true
---

# Debugging with AI

## Overview

Debugging is a crucial part of the test development lifecycle, but it can often be time-consuming.
Agents can help you identify and fix test failures.
This guide will show you how to leverage tools like GitHub Copilot directly within your Playwright workflow.  
You'll learn how to use features like "Copy Prompt" and "Fix with AI" to instantly get suggestions and
fix failing tests from the Test Explorer, UI Mode, the HTML report, and the Trace Viewer, turning hours of debugging into minutes.

## 1. Copy Prompt (Faster Test Debugging)

When a test fails (in the HTML report, trace viewer, or UI mode) a **Copy prompt** button appears beside the error. It copies a pre-filled, context-rich prompt including:
- Error message & stack
- Snippet of the failing test body
- Relevant stdout / stderr (when available)

Paste it directly into your AI chat and ask: "Suggest the minimal fix and explain why." This eliminates manual summarizing, reducing time-to-fix.

## 2. Fix with AI In VS Code

When a test fails while in VS Code (with the Playwright VS Code extension), a sparkly button appears in the Test Explorer and the editor gutter.
Click it to engage Copilot's "Fix with AI" feature.

Copilot has access to wealth of context on the error (page snapshot, git diff, source code, error messages) and tries to provide contextual, accurate fix suggestions.
This enables one-click problem resolution.

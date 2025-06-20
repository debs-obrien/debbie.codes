---
title: Vibe Coding with Copilot and Gemini 2.5 pro - Simplifying My Blog with AI-Assisted Refactoring
date: 2025-06-20
description: I have been wanting to share more content on my blog, but ironically, the process of publishing has been slowing me down. In a recent vibe coding session, I decided to remove images from the blog entirely and explore a content-first approach with AI assistance.
tags: [webdev, ai, githubcopilot, vscode]
published: true
loading: eager
canonical: https://dev.to/debs_obrien/vibe-coding-with-copilot-and-gemini-25-pro-simplifying-my-blog-with-ai-assisted-refactoring-3033
---

I have been wanting to share more content on my blog, but ironically, the process of publishing has been slowing me down.

One of the biggest points of friction was managing images. Whether I was searching for the right visuals, generating AI images, or uploading and optimizing them, the effort added more overhead than value. In a recent vibe coding session, I decided to remove images from the blog entirely and explore a content-first approach instead.

To streamline the changes, I brought in some AI assistance with Copilot in VS Code and Gemini 2.5 Pro.

## Using AI for Real-World Development Tasks

This was not just an experiment in AI usage. It was an exploration of how well a coding assistant could help with a live production codebase. I had a few goals for the session:

- Remove images from the homepage and blog post layouts
- Adjust the featured post section to work well without images
- Allow multiple featured posts to improve the layout
- Maintain passing tests and catch any regressions

Copilot handled most of the layout changes with confidence. There were some hiccups, such as accidentally removing unrelated components, but thanks to having tests in place, I was able to identify those quickly and guide the AI to restore the correct content.

## The Role of Tests When Pairing with AI

This session was a good reminder that test coverage is essential when collaborating with an AI tool. It is easy for an assistant to refactor or delete something that seems unused, only to discover later that it was important for functionality.

I spent some time updating my locators to be more dynamic rather than tied to specific static text. That small change helped the tests remain reliable and more resilient to future changes.

## Watch the Full Coding Session

If you are curious about how Gemini 2.5 pro performed, you can watch the full coding session on YouTube. You will see the back-and-forth of using an AI assistant to remove image dependencies, refactor layouts, restore unintended changes, and iterate toward a cleaner and simpler blog experience.

Watch here: [Vibe Coding with Copilot and Gemini 2.5: Removing Blog Images, Fixing Layouts, and Debugging with AI](https://www.youtube.com/watch?v=wqhnjI131rk)

## Final Thoughts

This session reminded me that small barriers, like managing images, can hold back your momentum as a creator. By removing friction and getting help from AI, it becomes easier to ship improvements and stay focused on what matters.

If you have not tried coding with an AI assistant yet, this is a good example of how it can be helpful. It is not perfect, but it is a powerful partner when combined with tests and a clear workflow.

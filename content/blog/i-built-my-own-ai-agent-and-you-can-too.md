---
title: I Built My Own AI Agent using n8n — And You Can Too
date: 2024-11-06
description: I recently built my own AI agent. Not because I needed one, but because I wanted to see how far I could take the current tools available. It turned out to be surprisingly straightforward, extremely flexible, and genuinely useful.
tags: [ai]
canonical: https://dev.to/debs_obrien/i-built-my-own-ai-agent-and-you-can-too-56l1
published: true
---

I recently built my own AI agent. Not because I needed one, but because I wanted to see how far I could take the current tools available. It turned out to be surprisingly straightforward, extremely flexible, and genuinely useful.

This post will show you what the agent can do and how you can build your own using n8n, without needing to write much code.

## What My Agent Can Do

The agent runs as a simple chat interface where I can ask it different questions and request actions. For example:

1. Ask for the weather in a city.
2. Get my current YouTube subscriber count.
3. Check my recent running stats from Strava.
4. Have it send me an email containing a summary of the full conversation.

This is not necessarily something you must have, but it is a great demonstration of what is possible when you combine multiple data sources and let an AI model reason across them.

## The Tool I Used: n8n

I built everything using n8n, a visual workflow automation tool. It allows you to drag and drop nodes to create automation steps, including AI reasoning steps.

One workflow contains:

1. A chat trigger
2. A large language model (Gemini in my case, but OpenAI also works)
3. Tools such as:
   • YouTube API statistics
   • Strava activity data
   • Weather API queries
   • GitHub issues
   • Gmail actions (send summaries, notifications, etc)

One important component is conversation memory, which allows the agent to recall previous messages in the chat.

## Step-by-Step Quick Start Guide

Follow these steps to create your first simple agent.

### Step 1: Create an n8n Account

Go to [https://n8n.io](https://n8n.io/) and create a free account. You do not need to enter payment details to start.

### Step 2: Create a New Workflow

Inside n8n, click Workflows and choose New Workflow or use a template for free like the one I used: [https://n8n.io/workflows/6270-build-your-first-ai-agent/](https://n8n.io/workflows/6270-build-your-first-ai-agent/)

### Step 3: Add a Chat Trigger

Search for AI Chat Trigger and add it to your workflow. This will provide the public chat interface URL.

### Step 4: Add an AI Model Node

Search for Google Gemini or OpenAI Chat Model.

You will need:
• A Google Cloud key (if using Gemini) [https://console.cloud.google.com/](https://console.cloud.google.com/)
• Or an OpenAI key (if using GPT models)

Set a system prompt, such as:

```
You are a personal assistant that can answer questions and use tools when needed.
```

### Step 5: Add Conversation Memory

Search for Memory and connect it to your agent. This allows your agent to remember context across multiple messages.

### Step 6: Add Your First Tool (Example: Weather API)

Search for HTTP Request. Set a request such as:

```
GET https://api.open-meteo.com/v1/forecast
```

### Step 7: Save and Activate the Workflow

Click Save and then toggle the workflow to Active.

Copy the chat URL and open it in your browser.

Ask your agent something like:

```
What is the weather right now in Palma?
```

You just built your first agent.

## Expanding with More Tools

Once the foundation is set, add tools one at a time. Examples from my workflow:

1. YouTube Data API to fetch subscriber counts
2. Strava API to retrieve recent runs
3. GitHub API to check open issues
4. Gmail node to send email summaries

Each tool is added as a separate node. Connect it as a tool to the AI model. Test each step individually before chaining them.

## Final Thoughts

Building an AI agent today does not require advanced development skills. The hardest part is usually obtaining and configuring API credentials. Once those are set, everything becomes easier.

Experiment, try small ideas, and let your agent grow naturally as new needs appear.

If you build one, I would be interested in hearing how it went and what use cases you explored.

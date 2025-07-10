---
title: "Building Your First MCP Server: A Beginners Tutorial"
date: 2025-07-01
description: Have you ever wanted your AI assistant to access real-time data? Model Context Protocol (MCP) servers make this possible, and they're surprisingly simple to build and use! Learn how to build an MCP server from scratch using TypeScript, connect it to a real weather API, and integrate it with VS Code and GitHub Copilot.
tags: [mcp, webdev, ai, typescript]
published: true
loading: eager
canonical: https://dev.to/debs_obrien/building-your-first-mcp-server-a-beginners-tutorial-5fag
---

Have you ever wanted your AI assistant to access real-time data? Model Context Protocol (MCP) servers make this possible, and they're surprisingly simple to build and use!

You may have already seen my videos and posts on using the Playwright MCP to go to a website and generate test ideas and then generate actual Playwright tests after first interacting with the site. Or how I used it to go shopping for me. This is the power of MCPs. It gives the AI agents tools to be able to do things such as connect to a browser or as in the GitHub MCP, create pull requests etc.

In this tutorial, you'll create a weather server that connects AI agents like GitHub Copilot to live weather data. We will use TypeScript for this demo but you can build MCP servers in other languages, links at the end of the post. By the end, you'll be able to ask your AI for weather information in any city and get real, up-to-date responses.

**What you'll learn:**

- How to build an MCP server from scratch using the TypeScript SDK
- Connect it to a real weather API
- Integrate it with VS Code and GitHub Copilot
- Test and debug your server

**What you'll need:**

- Basic TypeScript/JavaScript knowledge
- Node.js installed on your machine
- VS Code (optional, but recommended)

Let's get started!

## What is an MCP Server?

Model Context Protocol (MCP) servers are bridges that connect AI agents to external tools and data sources. Think of them as translators that help AI understand and interact with real-world applications.

**The Problem:** When you ask GitHub Copilot for weather information in VS Code, you'll get a response like this:

> "I don't have access to real-time weather data or weather APIs through the available tools in this coding environment."

**The Solution:** MCP servers provide the missing link, giving AI agents the tools they need to access live data and perform real actions.

Our weather server will act as a tool that any MCP-compatible AI can call to get current weather information for any city worldwide.

## Step 1: Project Setup

Let's create a new project and set up our development environment.

### 1. Initialize the Project

Create a new directory and initialize it with npm:

```bash
mkdir mcp-weather-server
cd mcp-weather-server
npm init -y
```

### 2. Create the Main File

Create our main TypeScript file:

```bash
touch main.ts
```

### 3. Configure Package.json

Open the project in VS Code (or your preferred editor) and modify `package.json` to enable ES modules by adding the `type` field:

```json
{
  "name": "mcp-weather-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

> **Why ES modules?** The MCP SDK uses modern JavaScript modules, so we need to enable them in our project.

## Step 2: Install Dependencies

Our MCP server needs two key libraries:

### 1. Install the MCP SDK

The Model Context Protocol SDK provides everything needed to build MCP servers:

```bash
npm install @modelcontextprotocol/sdk
```

### 2. Install Zod for Data Validation

Zod ensures our server receives valid data from AI agents:

```bash
npm install zod
```

Your `package.json` dependencies should now look like this:

```json
"dependencies": {
  "@modelcontextprotocol/sdk": "^1.13.1",
  "zod": "^3.25.67"
}
```

## Step 3: Building the Basic Server

Now let's create our MCP server. Open `main.ts` and let's build it step by step.

### 1. Add the Required Imports

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";
```

### 2. Create the Server Instance

```typescript
const server = new McpServer({
  name: "Weather Server",
  version: "1.0.0"
});
```

The server manages all communication using the MCP protocol between clients (like VS Code) and your tools.

### 3. Define Your First Tool

Tools are functions that AI agents can call. Let's create a `get-weather` tool:

```typescript
server.tool(
  'get-weather',
  'Tool to get the weather of a city',
  {
    city: z.string().describe("The name of the city to get the weather for")
  },
  async ({ city }) => {
    // For now, return a simple static response
    return {
      content: [{
        type: "text",
        text: `The weather in ${city} is sunny`
      }]
    };
  }
);
```

**Breaking down the tool definition:**

- **Tool ID:** `'get-weather'` - Unique identifier
- **Description:** Helps AI agents understand what this tool does
- **Schema:** Defines parameters (city must be a string)
- **Function:** The actual code that runs when called

**How it works:**

- AI agent sees: "Tool to get the weather of a city"
- AI agent calls it with: `{ city: "Paris" }`
- Zod validates the input
- Function returns: "The weather in Paris is sunny"

### 4. Set Up Communication

Finally, we need to set up how our server communicates with AI clients:

```typescript
const transport = new StdioServerTransport();
server.connect(transport);
```

**What's happening here:**

- `StdioServerTransport` uses your terminal's input/output for communication
- Perfect for local development
- The server reads requests from `stdin` and writes responses to `stdout`
- MCP protocol handles all the message formatting automatically

### 5. Complete Basic Server Example

Your complete `main.ts` should now look like this:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";

const server = new McpServer({
  name: "Weather Server",
  version: "1.0.0"
});

server.tool(
  'get-weather',
  'Tool to get the weather of a city',
  {
    city: z.string().describe("The name of the city to get the weather for")
  },
  async ({ city }) => {
    return {
      content: [{
        type: "text",
        text: `The weather in ${city} is sunny`
      }]
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
```

🎉 **Congratulations!** You've built your first MCP server. Let's test it!

## Step 4: Testing with MCP Inspector

Before adding real weather data, let's test our server using the MCP Inspector, a web-based debugging tool for MCP servers.

### Launch the Inspector

Run this command to open the MCP Inspector for your server:

```bash
npx -y @modelcontextprotocol/inspector npx -y tsx main.ts
```

After running the command, you'll see terminal output with:

- A localhost URL (like `http://127.0.0.1:6274`)
- A unique session token
- A direct link with the token pre-filled

**💡 Tip:** Click the link with the token already included to avoid manual entry.

### Connect and Test

1. **Connect:** Click the "Connect" button in the Inspector
2. **Navigate:** Click "Tools" in the top navigation
3. **Select:** Choose your `get-weather` tool
4. **Test:** Enter a city name (like "Palma de Mallorca") and click "Run Tool"

You should see the response: `"The weather in Palma de Mallorca is sunny"`

**Troubleshooting:**

- **Connection Error?** Make sure you used the link with the pre-filled token

Perfect! Your MCP server is working. Now let's make it actually useful.

## Step 5: Adding Real Weather Data

Time to make our server actually useful! We'll integrate with [Open-Meteo](https://open-meteo.com/), a free weather API that requires no API key.

### How the Weather API Works

To get weather data, we need a two-step process:

1. **Convert city name → coordinates** (using the Geocoding API)
2. **Get weather using coordinates** (using the Weather API)

### Update Your Tool Function

Replace your existing tool function with this enhanced version:

```typescript
server.tool(
  'get-weather',
  'Tool to get the weather of a city',
  {
    city: z.string().describe("The name of the city to get the weather for")
  },
  async ({ city }) => {
    try {
      // Step 1: Get coordinates for the city
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
      const geoData = await geoResponse.json();

      // Handle city not found
      if (!geoData.results || geoData.results.length === 0) {
        return {
          content: [{
            type: "text",
            text: `Sorry, I couldn't find a city named "${city}". Please check the spelling and try again.`
          }]
        };
      }

      // Step 2: Get weather data using coordinates
      const { latitude, longitude } = geoData.results[0];
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code&hourly=temperature_2m,precipitation&forecast_days=1`);
      const weatherData = await weatherResponse.json();

      // Return the complete weather data as JSON
      return {
        content: [{
          type: "text",
          text: JSON.stringify(weatherData, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error fetching weather data: ${error.message}`
        }]
      };
    }
  }
);
```

### Test the Real Data

1. **Restart** your MCP Inspector (Ctrl+C, then re-run the command)
2. **Reconnect** in the web interface
3. **Test** with a real city like "Tokyo" or "New York"

You should now see actual weather data instead of "sunny"! 🌤️

## Step 6: Integration with VS Code and GitHub Copilot

Now let's connect your weather server to VS Code so you can use it with GitHub Copilot!

### Register the Server

1. **Open Command Palette:** `Cmd/Ctrl + Shift + P`
2. **Type:** `MCP: Add Server`
3. **Choose:** "Local server using stdio"
4. **Enter Command:** `npx -y tsx main.ts`
5. **Name:** `my-weather-server`
6. **Setup Type:** Local setup

This creates a `.vscode/mcp.json` file in your project:

```json
{
  "inputs": [],
  "servers": {
    "my-weather-server": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/Users/your-username/path/to/main.ts"
      ]
    }
  }
}
```

### Start and Test

1. **Start the server:** Click the "Start" button next to your server name in the MCP panel
2. **Verify:** You should see "Running" status
3. **Switch to Agent Mode:** Click the Copilot sidebar → "Agent Mode"
4. **Ask:** "What's the weather like in Tokyo?"

GitHub Copilot will ask permission to use your weather tool, click "Continue" to proceed.

**Expected Result:** Instead of raw JSON, you'll get a beautifully formatted weather report like this:

```markdown
> **Weather in Tokyo Today**
> **Temperature:** 28°C (feels like 32°C)
> **Humidity:** 75%
> **Conditions:** Partly cloudy with light rain expected in the evening
```

**Perfect!** The AI transforms your raw weather data into a beautiful, human-readable format automatically.

## Why This is Powerful

Your weather server demonstrates the true power of MCP:

**🤖 AI Does the Heavy Lifting**

- You provide raw data, AI creates beautiful presentations
- No need to format responses, the AI handles user experience

**🔗 Universal Compatibility**

- Works with any MCP-compatible tool (VS Code, Claude, etc.)
- Write once, use everywhere

**⚡ Real-time Integration**

- Always current data, no caching issues
- Works seamlessly within your development environment

**📈 Easy to Extend**

- Add weather alerts, forecasts, or air quality data
- Build additional tools in the same server

## Complete Code Reference

Here's your final `main.ts` file:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";

const server = new McpServer({
  name: "Weather Server",
  version: "1.0.0"
});

server.tool(
  'get-weather',
  'Tool to get the weather of a city',
  {
    city: z.string().describe("The name of the city to get the weather for")
  },
  async ({ city }) => {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
      const data = await response.json();

      if (data.results.length === 0) {
        return {
          content: [{
            type: "text",
            text: `No results found for city: ${city}`
          }]
        };
      }

      const { latitude, longitude } = data.results[0];
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,apparent_temperature,relative_humidity_2m&forecast_days=1`);
      const weatherData = await weatherResponse.json();

      return {
        content: [{
          type: "text",
          text: JSON.stringify(weatherData, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error fetching weather data: ${error.message}`
        }]
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
```

## Next Steps: Enhance Your Server

Ready to take your weather server to the next level? Here are some ideas:

### 🚀 Additional Weather Tools

**Extended Forecasts**

```typescript
server.tool('get-forecast', 'Get 7-day weather forecast', ...)
```

**Weather Alerts**

```typescript
server.tool('get-alerts', 'Get severe weather warnings', ...)
```

**Air Quality**

```typescript
server.tool('get-air-quality', 'Get air pollution data', ...)
```

### 📦 Sharing Your Server

- **Publish to NPM:** Make it available for others to use

## Conclusion

🎉 **Congratulations!** You've successfully built your first MCP weather server!

**What You've Accomplished:**

- ✅ Created a functional MCP server from scratch
- ✅ Integrated real-time weather data from an external API
- ✅ Connected it to VS Code and GitHub Copilot
- ✅ Learned the fundamentals of the Model Context Protocol

**Key Takeaways:**

- **Simplicity:** MCP servers are much easier to build than they appear
- **Power:** Real data makes AI interactions dramatically more valuable
- **Flexibility:** The same server works across multiple AI platforms
- **Future-ready:** You're building the infrastructure for next-gen AI

**What's Next?** The possibilities are endless! Weather was just the beginning, now you can connect AI to databases, APIs, file systems, and any service you can imagine.

Happy building! 🚀

## 📚 Resources and Further Reading

**Official Documentation**

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/) - Complete MCP reference
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Java SDK](https://github.com/modelcontextprotocol/java-sdk)
- [Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk)
- [C# SDK](https://github.com/modelcontextprotocol/csharp-sdk)

**APIs Used in This Tutorial**

- [Open-Meteo Weather API](https://open-meteo.com/) - Free weather data service
- [Zod Documentation](https://zod.dev/) - TypeScript schema validation

**MCP Examples**

- [MCP Examples Repository](https://github.com/modelcontextprotocol/servers) - Sample servers
- [Playwright MCP](https://github.com/microsoft/playwright-mcp) - Provides browser automation capabilities using Playwright.
- [GitHub MCP](https://docs.github.com/en/copilot/how-tos/context/model-context-protocol/using-the-github-mcp-server)

**Demo Repo** [Demo available on GitHub](https://github.com/debs-obrien/mcp-weather-server-demo)

**Watch the Video**

[Build your first MCP Server: Tutorial for Beginners.](https://www.youtube.com/watch?v=egVm_z1nnnQ)

Shoutout to Miguel Angel Duran for his great course and explanation. Check out his video in Spanish for a similar demo: [Learn MCP! For Beginners + Create Our First MCP From Scratch"](https://youtu.be/wnHczxwukYY?si=6TlZiYpc_XKkn46v)

---
title: Building Your First MCP Server - A Beginner's Tutorial
date: 2024-07-03
description: Learn how to build your first Model Context Protocol (MCP) server from scratch. This beginner-friendly tutorial walks you through the fundamentals of MCP and guides you step-by-step through creating your own server to enhance AI applications.
tags: [mcp, ai, tutorial, development, javascript]
published: true
loading: eager
canonical: https://dev.to/debs_obrien/building-your-first-mcp-server-a-beginners-tutorial-5fag
---

Learn how to build your first Model Context Protocol (MCP) server from scratch. This beginner-friendly tutorial walks you through the fundamentals of MCP and guides you step-by-step through creating your own server to enhance AI applications.

## What is MCP?

Model Context Protocol (MCP) is an emerging standard that enables AI applications to securely access external data sources and tools. Think of it as a bridge between AI models and the real world - allowing them to interact with databases, APIs, file systems, and other resources in a controlled and secure way.

## Getting Started

In this tutorial, we'll build a simple MCP server that can:
- Provide context about files in a directory
- Execute simple commands
- Return structured data to AI applications

## Prerequisites

Before we begin, make sure you have:
- Node.js (version 18 or higher)
- Basic knowledge of JavaScript/TypeScript
- A text editor or IDE
- Terminal access

## Setting Up Your Project

Let's start by creating a new directory for our MCP server:

```bash
mkdir my-first-mcp-server
cd my-first-mcp-server
npm init -y
```

## Installing Dependencies

We'll need the MCP SDK to build our server:

```bash
npm install @modelcontextprotocol/sdk
npm install --save-dev typescript @types/node
```

## Creating Your First MCP Server

Create a new file called `server.ts` in your project directory:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

class MyMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'my-first-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'hello',
            description: 'Say hello to the world',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name to greet',
                },
              },
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'hello':
          const nameToGreet = args?.name || 'World';
          return {
            content: [
              {
                type: 'text',
                text: `Hello, ${nameToGreet}! This is your first MCP server responding.`,
              },
            ],
          };
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP server running on stdio');
  }
}

const server = new MyMCPServer();
server.run().catch(console.error);
```

## Testing Your Server

To test your MCP server, you'll need an MCP client. You can use the MCP Inspector tool or integrate it with Claude Desktop.

First, compile your TypeScript:

```bash
npx tsc server.ts --target es2022 --module node16 --moduleResolution node16
```

Then run your server:

```bash
node server.js
```

## Adding More Functionality

Let's enhance our server with more useful tools:

```typescript
// Add this to your tools list
{
  name: 'get-time',
  description: 'Get the current time',
  inputSchema: {
    type: 'object',
    properties: {},
  },
},
{
  name: 'calculate',
  description: 'Perform basic mathematical calculations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide'],
        description: 'Mathematical operation to perform',
      },
      a: {
        type: 'number',
        description: 'First number',
      },
      b: {
        type: 'number',
        description: 'Second number',
      },
    },
    required: ['operation', 'a', 'b'],
  },
}
```

And handle these new tools:

```typescript
case 'get-time':
  return {
    content: [
      {
        type: 'text',
        text: `Current time: ${new Date().toISOString()}`,
      },
    ],
  };

case 'calculate':
  const { operation, a, b } = args as {
    operation: string;
    a: number;
    b: number;
  };
  
  let result: number;
  switch (operation) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      if (b === 0) throw new Error('Division by zero');
      result = a / b;
      break;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
  
  return {
    content: [
      {
        type: 'text',
        text: `${a} ${operation} ${b} = ${result}`,
      },
    ],
  };
```

## Integrating with Claude Desktop

To use your MCP server with Claude Desktop, add it to your configuration file:

**On macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**On Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "my-first-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/server.js"]
    }
  }
}
```

## Best Practices

When building MCP servers, keep these best practices in mind:

1. **Security First**: Always validate inputs and sanitize outputs
2. **Clear Documentation**: Provide comprehensive descriptions for your tools
3. **Error Handling**: Implement robust error handling for all operations
4. **Performance**: Be mindful of response times and resource usage
5. **Logging**: Implement proper logging for debugging and monitoring

## Next Steps

Now that you have a basic MCP server running, you can:

- Add file system operations
- Integrate with external APIs
- Implement database connections
- Create more complex data processing tools
- Build domain-specific functionality

## Conclusion

Building your first MCP server opens up exciting possibilities for AI integration. You've learned the fundamentals and created a working server that can respond to tool calls and provide useful functionality.

The MCP ecosystem is rapidly evolving, and there are many opportunities to create powerful integrations that enhance AI applications. Keep experimenting and building!

## Resources

- [MCP Official Documentation](https://modelcontextprotocol.io/)
- [MCP SDK GitHub Repository](https://github.com/modelcontextprotocol/servers)
- [Claude Desktop MCP Integration Guide](https://docs.anthropic.com/claude/docs/mcp)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers/tree/main/src)

Happy building! 🚀
export const SITE = 'https://debbie.codes'
export const MAX_OUTPUT_CHARS = 1500

export const webmcpTools = {
  listVideos: {
    name: 'list-videos',
    title: 'List videos',
    description:
      "List Debbie O'Brien's videos (conference recordings, interviews, live streams and tutorials) about Playwright, testing, MCP, AI agents and Nuxt, newest first. "
      + 'Optionally filter by topic tag, conference or host. Returns title, date, conference, host, tags and links.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: { type: 'string', maxLength: 40, description: 'Topic tag such as "playwright", "mcp", "ai" or "nuxt".' },
        conference: { type: 'string', maxLength: 80, description: 'Part of a conference name, e.g. "JSNation".' },
        host: { type: 'string', maxLength: 80, description: 'Part of the host or show name for interviews and streams.' },
        limit: { type: 'integer', minimum: 1, maximum: 10, default: 5, description: 'How many videos to return.' },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  },
} as const

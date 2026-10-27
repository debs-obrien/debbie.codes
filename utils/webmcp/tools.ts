export const MAX_OUTPUT_CHARS = 1500

export const webmcpTools = {
  listVideos: {
    name: 'list-videos',
    title: 'List videos',
    description: 'Lists Debbie\'s videos, newest first. Use when browsing her talks, interviews, or tutorials by topic, conference, or host.',
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
  topicBrief: {
    name: 'topic-brief',
    title: 'Topic brief',
    description: 'Summarizes how much Debbie has published on one topic across videos, posts, podcasts, and courses. Use when the task needs counts, a date range, and a few highlights.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', maxLength: 80, description: 'Topic name or alias, such as mcp or model context protocol.' },
      },
      required: ['topic'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  },
  searchContent: {
    name: 'search-content',
    title: 'Search content',
    description: 'Finds a specific piece of Debbie\'s content by keywords in titles, tags, descriptions, and chapter titles. Use when locating one video, post, podcast, or course.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', maxLength: 200, description: 'Keywords to match in a title, tag, description, or chapter title.' },
        type: { type: 'string', maxLength: 20, description: 'Limit results to blog, video, podcast, or course.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  },
  getCurrentPage: {
    name: 'get-current-page',
    title: 'Current page',
    description: 'Describes the debbie.codes page already open, and related content when that page is one post, video, or podcast. Use when the task needs context for the current URL.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  },
} as const

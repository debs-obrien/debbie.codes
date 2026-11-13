/** Soft cap for tool JSON. Raised from 1500 to 2000 so pagination fields, id, and chaptersAvailable fit without cutting a limit:10 page as often; still small for agents. */
export const MAX_OUTPUT_CHARS = 2000

export const MAX_OFFSET = 500

export const webmcpTools = {
  listVideos: {
    name: 'list-videos',
    title: 'List videos',
    description: 'Lists Debbie\'s videos, newest first. Returns videos, total, returned, hasMore, and nextOffset (null when done). Pass offset to page. If trimmed is true, the page was cut to fit the size limit; use nextOffset to continue.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: { type: 'string', maxLength: 40, description: 'Topic tag such as "playwright", "mcp", "ai" or "nuxt".' },
        conference: { type: 'string', maxLength: 80, description: 'Part of a conference name, e.g. "JSNation".' },
        host: { type: 'string', maxLength: 80, description: 'Part of the host or show name for interviews and streams.' },
        limit: { type: 'integer', minimum: 1, maximum: 10, default: 5, description: 'How many videos to return.' },
        offset: { type: 'integer', minimum: 0, maximum: 500, default: 0, description: 'Skip this many matches before the next page.' },
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
    description: 'Finds Debbie\'s content by keywords in titles, tags, descriptions, and chapter titles. Returns results, total, returned, hasMore, and nextOffset. Pass offset to page. Chapter hits need every query word in the chapter title.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', maxLength: 200, description: 'Keywords to match in a title, tag, description, or chapter title.' },
        type: { type: 'string', maxLength: 20, description: 'Limit results to blog, video, podcast, or course.' },
        offset: { type: 'integer', minimum: 0, maximum: 500, default: 0, description: 'Skip this many matches before the next page.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  },
  getVideo: {
    name: 'get-video',
    title: 'Get video',
    description: 'Returns one video by YouTube id (from list-videos or search-content): title, date, clipped description, tags, conference or host, link, chaptersAvailable, and chapters with startSeconds and timestamped URLs. Pass offset to page chapters; response includes total, returned, hasMore, and nextOffset.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', maxLength: 40, description: 'YouTube video id from list-videos or search-content.' },
        offset: { type: 'integer', minimum: 0, maximum: 500, default: 0, description: 'Skip this many chapters before the next page.' },
      },
      required: ['id'],
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

export const WEBMCP_LIST_VIDEOS_EVENT = 'debbie:webmcp-list-videos'

export interface ListVideosAnnounce {
  /** Normalized tag the agent passed, if any. */
  tag?: string
  /** Tool error sentence when the call failed (e.g. no matches). */
  error?: string
  /** YouTube ids from a successful response (for card highlight). */
  videoIds?: string[]
}

/** Tell the page an agent just ran list-videos. Tool response stays unchanged. */
export function announceListVideos(detail: ListVideosAnnounce) {
  if (typeof document === 'undefined')
    return
  document.dispatchEvent(new CustomEvent(WEBMCP_LIST_VIDEOS_EVENT, { detail }))
}

/** Board team slug (Vercel scope). */
export const BOARD_TEAM = 'dobriendev-3232s-projects'

/** Channel to watch for ready tasks. */
export const BOARD_CHANNEL = 'debbie-codes'

/** Watcher id registered with the Board (profile name for this watcher). */
export const WATCHER_ID = 'ready-tasks'

/**
 * `vb tail` expression. Board matches this server-side and only wakes the
 * deployment on a match. See docs/01-board/06-watchers.md.
 */
export const WATCHER_TAIL = `${BOARD_CHANNEL} --label board.task=ready`

/** Board team slug (Vercel scope). */
export const BOARD_TEAM = 'dobriendev-3232s-projects'

/** Channel to watch for ready tasks. */
export const BOARD_CHANNEL = 'debbie-codes'

/** Watcher id registered with the Board (profile name for this watcher). */
export const WATCHER_ID = 'ready-tasks'

/**
 * Profile name of the engineer agent. Assignment events use
 * `payload.for` as `<owner>+<profile>` (or null to unassign). See
 * @vercel/board docs/04-reference/03-http.md (`task.assigned`) and
 * docs/01-board/11-tasks.md (`vb tasks assign <id> <profile>`).
 */
export const ENGINEER_AGENT = 'engineer'

/**
 * `vb tail` expression. Board matches this server-side and only wakes the
 * deployment on a match. See docs/01-board/06-watchers.md.
 *
 * Uses `--label board.task` (any task state), not `board.task=ready`, so
 * `task.assigned` still matches when the task is claimed or blocked. The
 * run-side filters keep wakes limited to new ready tasks and engineer assigns.
 */
export const WATCHER_TAIL = `${BOARD_CHANNEL} --label board.task`

/**
 * Decide whether a wake from the ready-task tail should notify the webhook.
 *
 * The watcher's `tail` is `debbie-codes --label board.task=ready`, so Vercel's
 * Board service only wakes this route for that channel while the root carries
 * `board.task=ready` (or when a thread enters/leaves that view). See
 * @vercel/board docs/01-board/06-watchers.md and docs/01-board/11-tasks.md.
 *
 * On create, `message.posted` lands before `board.task=ready` is set, so it
 * does not match the tail. The event that enters the ready view is
 * `task.created`. Replies, label changes, and claims still match the tail
 * (labels match the root; claims fire as the thread leaves), so this check
 * keeps exactly one webhook per new ready task.
 */
export interface WatcherEvent {
  type: string
  message?: {
    re: string | null
    labels?: Record<string, string>
  } | null
}

export function isNewReadyTask(event: WatcherEvent): boolean {
  if (event.type !== 'task.created') {
    return false
  }
  const message = event.message
  if (!message || message.re !== null) {
    return false
  }
  // Tail already requires board.task=ready; keep the check explicit.
  return message.labels?.['board.task'] === 'ready'
}

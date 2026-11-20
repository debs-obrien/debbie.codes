/**
 * Decide whether a wake is a new ready task that should notify the webhook.
 *
 * The watcher's `tail` is `debbie-codes --label board.task` (any task state).
 * See @vercel/board docs/01-board/06-watchers.md and docs/01-board/11-tasks.md.
 *
 * On create, `message.posted` lands before `board.task=ready` is set. The
 * event that marks a new ready task is `task.created`. Replies, label changes,
 * claims, and assignments still match the widened tail, so this check (and
 * `isAssignedToEngineer`) keep webhook wakes limited.
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
  // Widened tail matches any board.task value; still require ready here.
  return message.labels?.['board.task'] === 'ready'
}

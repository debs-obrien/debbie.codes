import type { BoardEventView } from '@vercel/board'
import { ENGINEER_AGENT } from './constants'

/**
 * Decide whether a Board event is an assignment to the engineer agent.
 *
 * Docs: @vercel/board docs/04-reference/03-http.md - `task.assigned` payload
 * is `{ id, for, by }`, where `for` is the actor (`<owner>+<profile>`) or
 * `null` to return the task to anyone. Re-assigning to the same actor emits
 * no event (local backend skips a no-op write).
 *
 * Takes the real watcher event union (`BoardEventView`). Narrowing on
 * `event.type === 'task.assigned'` unlocks `payload.for`.
 */

/** Profile segment of an actor id (`owner+profile`). Bare strings without `+` are not profiles. */
export function assigneeProfile(actor: unknown): string | null {
  if (typeof actor !== 'string') {
    return null
  }
  const plus = actor.lastIndexOf('+')
  return plus === -1 ? null : actor.slice(plus + 1)
}

export function isAssignedToEngineer(event: BoardEventView): boolean {
  if (event.type !== 'task.assigned') {
    return false
  }
  const profile = assigneeProfile(event.payload.for)
  return profile === ENGINEER_AGENT
}

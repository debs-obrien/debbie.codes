import { ENGINEER_AGENT } from './constants'

/**
 * Decide whether a Board event is an assignment to the engineer agent.
 *
 * Docs: @vercel/board docs/04-reference/03-http.md — `task.assigned` payload
 * is `{ id, for, by }`, where `for` is the actor (`<owner>+<profile>`) or
 * `null` to return the task to anyone. Re-assigning to the same actor emits
 * no event (local backend skips a no-op write).
 */
export interface AssignmentWatcherEvent {
  type: string
  payload?: {
    for?: string | null
  } | null
}

/** Profile segment of an actor id (`owner+profile`), or the string as-is. */
export function assigneeProfile(actor: string | null | undefined): string | null {
  if (actor == null) {
    return null
  }
  const plus = actor.lastIndexOf('+')
  return plus === -1 ? actor : actor.slice(plus + 1)
}

export function isAssignedToEngineer(event: AssignmentWatcherEvent): boolean {
  if (event.type !== 'task.assigned') {
    return false
  }
  const profile = assigneeProfile(event.payload?.for)
  return profile === ENGINEER_AGENT
}

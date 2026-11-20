import type { WebhookPayload } from '../lib/notify-webhook'
import { board } from '@vercel/board'
import { local } from '@vercel/board/backend-local'
/**
 * Local harness from docs/01-board/10-local.md:
 * board({ backend: local({ memory: true }), watch: { … } })
 *
 * Proves the same filter the deployed watcher uses:
 * one wake for a new ready task; a wake when assigned to engineer
 * even if the task is no longer ready; none for qa/designer assigns.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  BOARD_CHANNEL,
  ENGINEER_AGENT,
  WATCHER_ID,
  WATCHER_TAIL,
} from '../lib/constants'
import { isAssignedToEngineer } from '../lib/is-assigned-to-engineer'
import { isNewReadyTask } from '../lib/is-new-ready-task'
import {
  formatWakeLog,
  webhookPayloadFromMessage,
  type WakeReason,
} from '../lib/notify-webhook'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function waitForCalls(
  calls: WebhookPayload[],
  count: number,
  timeoutMs = 2000,
): Promise<void> {
  const started = Date.now()
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (calls.length >= count) {
        resolve()
        return
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Timed out waiting for ${count} webhook call(s); got ${calls.length}`))
        return
      }
      setTimeout(tick, 10)
    }
    tick()
  })
}

function mountWatcher(calls: WebhookPayload[], logs: string[]) {
  const backend = local({ memory: true })
  const team = board({
    backend,
    watch: {
      [WATCHER_ID]: {
        tail: WATCHER_TAIL,
        run: async ({ event }) => {
          let reason: WakeReason | null = null
          if (isNewReadyTask(event)) {
            reason = 'new-ready-task'
          }
          else if (isAssignedToEngineer(event)) {
            reason = 'assigned'
          }
          if (!reason) {
            return
          }
          const message = event.message
          if (!message) {
            return
          }
          logs.push(formatWakeLog(event.type, reason, message.id))
          calls.push(webhookPayloadFromMessage(message, reason))
        },
      },
    },
  })
  return { team, close: () => backend.close() }
}

describe('ready-tasks watcher on local()', () => {
  let closeBackend: (() => Promise<void>) | undefined

  afterEach(async () => {
    if (closeBackend) {
      await closeBackend()
      closeBackend = undefined
    }
  })

  it('wakes once for a new ready task; ignores reply, label change, and claim', async () => {
    const calls: WebhookPayload[] = []
    const logs: string[] = []
    const { team, close } = mountWatcher(calls, logs)
    closeBackend = close

    const { task } = await team.tasks.create(BOARD_CHANNEL, {
      text: 'ship the board watcher',
      labels: { topic: 'site' },
    })

    await waitForCalls(calls, 1)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({
      taskId: task.id,
      channel: BOARD_CHANNEL,
      text: 'ship the board watcher',
      reason: 'new-ready-task',
    })
    expect(calls[0]?.labels['board.task']).toBe('ready')

    await team.reply(task.id, 'this is a reply, not a new task')
    await team.label(task.id, { set: { topic: 'docs' } })
    await team.tasks.claim(task.id)

    // Give any mistaken wakes time to land.
    await sleep(200)
    expect(calls).toHaveLength(1)
  })

  it('forwards assignment to engineer with reason assigned (even when claimed)', async () => {
    const calls: WebhookPayload[] = []
    const logs: string[] = []
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const { team, close } = mountWatcher(calls, logs)
    closeBackend = close

    const { task } = await team.tasks.create(BOARD_CHANNEL, {
      text: 'assign me to engineer',
      labels: { topic: 'site' },
    })
    await waitForCalls(calls, 1)
    expect(calls[0]?.reason).toBe('new-ready-task')

    // Leave ready so a ready-only tail would miss the assign. This fails if
    // WATCHER_TAIL is reverted to `--label board.task=ready`.
    await team.tasks.claim(task.id)
    await sleep(50)

    const me = await team.me()
    await team.tasks.assign(task.id, `${me.principal}+${ENGINEER_AGENT}`)

    await waitForCalls(calls, 2)
    expect(calls[1]).toMatchObject({
      taskId: task.id,
      channel: BOARD_CHANNEL,
      reason: 'assigned',
    })
    expect(logs[1]).toBe(
      `board-watcher wake type=task.assigned reason=assigned taskId=${task.id}`,
    )
    expect(logs.join('\n')).not.toMatch(/https?:\/\//i)
    expect(logs.join('\n')).not.toMatch(/BOARD_WATCHER_WEBHOOK|bearer|secret/i)

    info.mockRestore()
  })

  it('does not forward assignment to qa or designer', async () => {
    const calls: WebhookPayload[] = []
    const logs: string[] = []
    const { team, close } = mountWatcher(calls, logs)
    closeBackend = close

    const { task } = await team.tasks.create(BOARD_CHANNEL, {
      text: 'assign me elsewhere',
      labels: { topic: 'site' },
    })
    await waitForCalls(calls, 1)

    const me = await team.me()
    await team.tasks.assign(task.id, `${me.principal}+qa`)
    await team.tasks.assign(task.id, `${me.principal}+designer`)
    await sleep(200)
    expect(calls).toHaveLength(1)
    expect(calls[0]?.reason).toBe('new-ready-task')
  })
})

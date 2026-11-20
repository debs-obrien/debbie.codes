/**
 * Local harness from docs/01-board/10-local.md:
 * board({ backend: local({ memory: true }), watch: { … } })
 *
 * Proves the same filter the deployed watcher uses:
 * one wake for a new ready task; none for reply, label change, or claim.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { board } from '@vercel/board'
import { local } from '@vercel/board/backend-local'
import { BOARD_CHANNEL, WATCHER_ID, WATCHER_TAIL } from '../lib/constants'
import { isNewReadyTask } from '../lib/is-new-ready-task'
import type { WebhookPayload } from '../lib/notify-webhook'
import { webhookPayloadFromMessage } from '../lib/notify-webhook'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
    const backend = local({ memory: true })
    closeBackend = () => backend.close()

    const team = board({
      backend,
      watch: {
        [WATCHER_ID]: {
          tail: WATCHER_TAIL,
          run: async ({ event }) => {
            if (!isNewReadyTask(event)) return
            const message = event.message
            if (!message) return
            calls.push(webhookPayloadFromMessage(message))
          },
        },
      },
    })

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
    })
    expect(calls[0]?.labels['board.task']).toBe('ready')

    await team.reply(task.id, 'this is a reply, not a new task')
    await team.label(task.id, { set: { topic: 'docs' } })
    await team.tasks.claim(task.id)

    // Give any mistaken wakes time to land.
    await sleep(200)
    expect(calls).toHaveLength(1)
  })
})

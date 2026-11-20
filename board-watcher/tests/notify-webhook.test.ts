import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  formatWakeLog,
  notifyWebhook,
  webhookPayloadFromMessage,
} from '../lib/notify-webhook'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('webhookPayloadFromMessage', () => {
  it('maps message fields to the webhook body with reason', () => {
    expect(
      webhookPayloadFromMessage(
        {
          id: '812',
          channel: 'debbie-codes',
          text: 'fix the footer',
          labels: { 'topic': 'site', 'board.task': 'ready' },
        },
        'new-ready-task',
      ),
    ).toEqual({
      taskId: '812',
      channel: 'debbie-codes',
      text: 'fix the footer',
      labels: { 'topic': 'site', 'board.task': 'ready' },
      reason: 'new-ready-task',
    })
  })

  it('defaults missing labels to an empty object', () => {
    expect(
      webhookPayloadFromMessage(
        {
          id: '1',
          channel: 'debbie-codes',
          text: 'hi',
        },
        'assigned',
      ),
    ).toEqual({
      taskId: '1',
      channel: 'debbie-codes',
      text: 'hi',
      labels: {},
      reason: 'assigned',
    })
  })
})

describe('formatWakeLog', () => {
  it('includes type, reason, and task id only (no url or key)', () => {
    const line = formatWakeLog('task.assigned', 'assigned', '812')
    expect(line).toBe(
      'board-watcher wake type=task.assigned reason=assigned taskId=812',
    )
    expect(line).not.toMatch(/https?:\/\//i)
    expect(line).not.toMatch(/BOARD_WATCHER_WEBHOOK/i)
    expect(line).not.toMatch(/bearer/i)
    expect(line).not.toMatch(/secret|key|token/i)
  })
})

describe('notifyWebhook', () => {
  it('pOSTs JSON with Authorization Bearer from env', async () => {
    vi.stubEnv('BOARD_WATCHER_WEBHOOK_URL', 'https://hooks.example/board')
    vi.stubEnv('BOARD_WATCHER_WEBHOOK_KEY', 'test-secret')

    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(null, { status: 204 }))

    await notifyWebhook(
      {
        taskId: '812',
        channel: 'debbie-codes',
        text: 'hello',
        labels: { 'board.task': 'ready' },
        reason: 'new-ready-task',
      },
      fetchImpl,
    )

    expect(fetchImpl).toHaveBeenCalledOnce()
    const [url, init] = fetchImpl.mock.calls[0]!
    expect(url).toBe('https://hooks.example/board')
    expect(init?.method).toBe('POST')
    const headers = init?.headers as Record<string, string>
    expect(headers['content-type']).toBe('application/json')
    expect(headers.authorization).toBe('Bearer test-secret')
    expect(JSON.parse(String(init?.body))).toEqual({
      taskId: '812',
      channel: 'debbie-codes',
      text: 'hello',
      labels: { 'board.task': 'ready' },
      reason: 'new-ready-task',
    })
  })

  it('throws when env vars are missing without including their values', async () => {
    await expect(
      notifyWebhook({
        taskId: '1',
        channel: 'debbie-codes',
        text: 'x',
        labels: {},
        reason: 'new-ready-task',
      }),
    ).rejects.toThrow(/BOARD_WATCHER_WEBHOOK_URL is not set/)
  })
})

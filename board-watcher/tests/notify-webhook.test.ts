import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifyWebhook, webhookPayloadFromMessage } from '../lib/notify-webhook'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('webhookPayloadFromMessage', () => {
  it('maps message fields to the webhook body', () => {
    expect(
      webhookPayloadFromMessage({
        id: '812',
        channel: 'debbie-codes',
        text: 'fix the footer',
        labels: { 'topic': 'site', 'board.task': 'ready' },
      }),
    ).toEqual({
      taskId: '812',
      channel: 'debbie-codes',
      text: 'fix the footer',
      labels: { 'topic': 'site', 'board.task': 'ready' },
    })
  })

  it('defaults missing labels to an empty object', () => {
    expect(
      webhookPayloadFromMessage({
        id: '1',
        channel: 'debbie-codes',
        text: 'hi',
      }),
    ).toEqual({
      taskId: '1',
      channel: 'debbie-codes',
      text: 'hi',
      labels: {},
    })
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
    })
  })

  it('throws when env vars are missing without including their values', async () => {
    await expect(
      notifyWebhook({
        taskId: '1',
        channel: 'debbie-codes',
        text: 'x',
        labels: {},
      }),
    ).rejects.toThrow(/BOARD_WATCHER_WEBHOOK_URL is not set/)
  })
})

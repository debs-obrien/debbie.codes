import process from 'node:process'

export interface WebhookPayload {
  taskId: string
  channel: string
  text: string
  labels: Record<string, string>
}

/**
 * POSTs the payload to BOARD_WATCHER_WEBHOOK_URL.
 * Auth header: Authorization: Bearer <BOARD_WATCHER_WEBHOOK_KEY>
 * Never logs the URL or key.
 */
export async function notifyWebhook(
  payload: WebhookPayload,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const url = process.env.BOARD_WATCHER_WEBHOOK_URL
  const key = process.env.BOARD_WATCHER_WEBHOOK_KEY

  if (!url) {
    throw new Error('BOARD_WATCHER_WEBHOOK_URL is not set')
  }
  if (!key) {
    throw new Error('BOARD_WATCHER_WEBHOOK_KEY is not set')
  }

  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Webhook POST failed with status ${response.status}`)
  }
}

export function webhookPayloadFromMessage(message: {
  id: string
  channel: string
  text: string
  labels?: Record<string, string>
}): WebhookPayload {
  return {
    taskId: message.id,
    channel: message.channel,
    text: message.text,
    labels: message.labels ?? {},
  }
}

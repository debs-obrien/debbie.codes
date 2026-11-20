import { board } from '@vercel/board'
import { BOARD_TEAM, WATCHER_ID, WATCHER_TAIL } from '@/lib/constants'
import { isNewReadyTask } from '@/lib/is-new-ready-task'
import { notifyWebhook, webhookPayloadFromMessage } from '@/lib/notify-webhook'

/**
 * Board handle with the ready-task watcher.
 * Pattern from docs/01-board/06-watchers.md and docs/01-board/01-mounting.md.
 *
 * Does not claim, reply, or label on the Board. A downstream bot does that
 * after receiving the webhook.
 */
export const team = board({
  team: BOARD_TEAM,
  watch: {
    [WATCHER_ID]: {
      // Board-side filter: only wake this deployment for ready tasks in channel.
      tail: WATCHER_TAIL,
      run: async ({ event }) => {
        // run still sees replies / label changes / claims that match the tail;
        // keep exactly one webhook per new ready task (task.created).
        if (!isNewReadyTask(event)) {
          return
        }
        const message = event.message
        if (!message) {
          return
        }
        await notifyWebhook(webhookPayloadFromMessage(message))
      },
    },
  },
})

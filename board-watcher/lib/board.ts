import { board } from '@vercel/board'
import { BOARD_TEAM, WATCHER_ID, WATCHER_TAIL } from '@/lib/constants'
import { isAssignedToEngineer } from '@/lib/is-assigned-to-engineer'
import { isNewReadyTask } from '@/lib/is-new-ready-task'
import {
  formatWakeLog,
  notifyWebhook,
  webhookPayloadFromMessage,
  type WakeReason,
} from '@/lib/notify-webhook'

/**
 * Board handle with the ready-task / engineer-assign watcher.
 * Pattern from docs/01-board/06-watchers.md and docs/01-board/01-mounting.md.
 *
 * Does not claim, reply, or label on the Board. A downstream bot does that
 * after receiving the webhook.
 */
export const team = board({
  team: BOARD_TEAM,
  watch: {
    [WATCHER_ID]: {
      // Board-side filter: any task in channel (see WATCHER_TAIL). Run filters
      // keep wakes to new ready tasks and assignments to engineer.
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
        console.info(formatWakeLog(event.type, reason, message.id))
        await notifyWebhook(webhookPayloadFromMessage(message, reason))
      },
    },
  },
})

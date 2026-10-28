/** Max characters allowed in the voice widget text box (client-side). */
export const CONVAI_INPUT_MAX_LENGTH = 500

/**
 * Caps text inputs inside the open-shadow `elevenlabs-convai` widget.
 * The embed re-renders its textarea when chat opens/changes mode, so we
 * observe the shadow root and re-apply `maxLength` whenever it appears.
 */
export function useConvaiInputLimit() {
  let observer: MutationObserver | null = null
  let hostWaiter: MutationObserver | null = null
  let pollId: ReturnType<typeof setInterval> | null = null

  const applyMaxLength = (root: ParentNode) => {
    root.querySelectorAll('textarea, input[type="text"], input:not([type])').forEach((node) => {
      if (!(node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement))
        return
      if (node.maxLength !== CONVAI_INPUT_MAX_LENGTH)
        node.maxLength = CONVAI_INPUT_MAX_LENGTH
    })
  }

  const watchShadow = (shadow: ShadowRoot) => {
    applyMaxLength(shadow)
    observer?.disconnect()
    observer = new MutationObserver(() => applyMaxLength(shadow))
    observer.observe(shadow, { childList: true, subtree: true })
  }

  const tryAttach = (): boolean => {
    const host = document.querySelector('elevenlabs-convai')
    if (!host?.shadowRoot)
      return false
    watchShadow(host.shadowRoot)
    return true
  }

  const stopWaiting = () => {
    hostWaiter?.disconnect()
    hostWaiter = null
    if (pollId != null) {
      clearInterval(pollId)
      pollId = null
    }
  }

  onMounted(() => {
    if (!import.meta.client)
      return

    if (tryAttach())
      return

    hostWaiter = new MutationObserver(() => {
      if (tryAttach())
        stopWaiting()
    })
    hostWaiter.observe(document.body, { childList: true, subtree: true })

    // Shadow root may attach after the host without a childList mutation.
    pollId = setInterval(() => {
      if (tryAttach())
        stopWaiting()
    }, 200)
  })

  onBeforeUnmount(() => {
    stopWaiting()
    observer?.disconnect()
    observer = null
  })
}

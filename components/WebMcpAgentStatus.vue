<script setup lang="ts">
import type { ListVideosAnnounce } from '~/utils/webmcp/announce'
import { WEBMCP_LIST_VIDEOS_EVENT } from '~/utils/webmcp/announce'

const DISMISS_MS = 4500
const HIGHLIGHT_MS = 3200
const HIGHLIGHT_CLASS = 'webmcp-agent-match'

const route = useRoute()
const message = ref('')
const visible = ref(false)
let dismissTimer: ReturnType<typeof setTimeout> | undefined
let highlightTimer: ReturnType<typeof setTimeout> | undefined
let highlightIds: string[] = []

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clearHighlight() {
  if (highlightTimer) {
    clearTimeout(highlightTimer)
    highlightTimer = undefined
  }
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS)
  })
  highlightIds = []
}

function applyHighlight(ids: string[]) {
  clearHighlight()
  if (!ids.length)
    return
  highlightIds = ids
  const idSet = new Set(ids)
  let first: Element | null = null
  document.querySelectorAll<HTMLElement>('[data-video-id]').forEach((el) => {
    const id = el.getAttribute('data-video-id')
    if (!id || !idSet.has(id))
      return
    el.classList.add(HIGHLIGHT_CLASS)
    if (!first)
      first = el
  })
  first?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'center',
  })
  highlightTimer = setTimeout(clearHighlight, HIGHLIGHT_MS)
}

function showPill(text: string) {
  if (dismissTimer)
    clearTimeout(dismissTimer)
  message.value = text
  visible.value = true
  dismissTimer = setTimeout(() => {
    visible.value = false
  }, DISMISS_MS)
}

function pillText(detail: ListVideosAnnounce) {
  if (detail.error) {
    if (detail.tag)
      return `Agent used list-videos · no match for '${detail.tag}'`
    return `Agent used list-videos · ${detail.error}`
  }
  if (detail.tag)
    return `Agent used list-videos · ${detail.tag}`
  return 'Agent used list-videos'
}

async function waitForMatchingCards(ids: string[], attempts = 40) {
  const idSet = new Set(ids)
  for (let i = 0; i < attempts; i++) {
    const cards = [...document.querySelectorAll('[data-video-id]')]
    if (cards.some(el => idSet.has(el.getAttribute('data-video-id') || '')))
      return
    await new Promise(r => setTimeout(r, 50))
  }
}

async function onAnnounce(event: Event) {
  const detail = (event as CustomEvent<ListVideosAnnounce>).detail || {}
  showPill(pillText(detail))

  if (detail.error || !detail.tag)
    return

  const target = `/videos/tags/${detail.tag}`
  if (route.path !== target && route.path !== `${target}/`)
    await navigateTo(target)

  if (detail.videoIds?.length) {
    await waitForMatchingCards(detail.videoIds)
    await nextTick()
    applyHighlight(detail.videoIds)
  }
}

function onRouteReady() {
  if (highlightIds.length)
    applyHighlight(highlightIds)
}

onMounted(() => {
  document.addEventListener(WEBMCP_LIST_VIDEOS_EVENT, onAnnounce)
})

onBeforeUnmount(() => {
  document.removeEventListener(WEBMCP_LIST_VIDEOS_EVENT, onAnnounce)
  if (dismissTimer)
    clearTimeout(dismissTimer)
  clearHighlight()
})

watch(() => route.fullPath, () => {
  // Re-apply after in-app navigation paints the filtered cards.
  nextTick(() => onRouteReady())
})
</script>

<template>
  <div
    v-show="visible"
    class="webmcp-agent-status"
    role="status"
    aria-live="polite"
    data-testid="webmcp-agent-status"
  >
    {{ message }}
  </div>
</template>

<style scoped>
.webmcp-agent-status {
  position: fixed;
  z-index: 60;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  max-width: min(92vw, 28rem);
  padding: 0.4rem 0.9rem;
  border-radius: 9999px;
  border: 1px solid #d8002d;
  background: #fff;
  color: #111827;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.12);
  text-align: center;
  pointer-events: none;
}

:global(.dark) .webmcp-agent-status {
  background: rgb(15 23 42);
  color: rgb(243 244 246);
  border-color: #fd213b;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
}

@media (prefers-reduced-motion: no-preference) {
  .webmcp-agent-status {
    animation: webmcp-status-in 180ms ease-out;
  }
}

@keyframes webmcp-status-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>

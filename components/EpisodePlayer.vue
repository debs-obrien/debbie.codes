<script setup lang="ts">
import LiteYoutube from '~/components/content/LiteYoutube.vue'
import { youtubeWatchUrl } from '~/utils/youtube'

const props = defineProps<{
  videoId: string
  playlabel: string
}>()

const start = ref(0)
const playerKey = ref(0)
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const wrap = ref<HTMLElement | null>(null)

const watchUrl = computed(() => youtubeWatchUrl(props.videoId, start.value))

function findLite(): HTMLElement | null {
  return wrap.value?.querySelector('lite-youtube') as HTMLElement | null
}

function observeActivation(el: HTMLElement) {
  const existing = el.querySelector('iframe')
  if (existing) {
    status.value = 'ready'
    return
  }

  const observer = new MutationObserver(() => {
    const iframe = el.querySelector('iframe')
    if (!iframe)
      return
    observer.disconnect()
    iframe.addEventListener('load', () => {
      status.value = 'ready'
    }, { once: true })
    iframe.addEventListener('error', () => {
      status.value = 'error'
    }, { once: true })
    window.setTimeout(() => {
      if (status.value === 'loading')
        status.value = 'ready'
    }, 10000)
  })
  observer.observe(el, { childList: true, subtree: true })
}

function activateLite() {
  const el = findLite()
  if (!el) {
    status.value = 'error'
    return
  }
  status.value = 'loading'
  if (!el.classList.contains('lyt-activated'))
    el.click()
  observeActivation(el)
}

async function waitForLite(attempts = 40): Promise<HTMLElement | null> {
  for (let i = 0; i < attempts; i++) {
    const el = findLite()
    if (el)
      return el
    await new Promise(resolve => setTimeout(resolve, 25))
  }
  return findLite()
}

/** Seek to a chapter start (seconds) and play the privacy-friendly embed. */
async function playFrom(seconds: number) {
  const next = Math.max(0, Math.trunc(seconds))
  const el = findLite()
  const alreadyOn = start.value === next && el?.classList.contains('lyt-activated')
  if (alreadyOn) {
    status.value = 'ready'
    return
  }
  start.value = next
  status.value = 'loading'
  playerKey.value += 1
  await nextTick()
  const lite = await waitForLite()
  if (!lite) {
    status.value = 'error'
    return
  }
  activateLite()
}

function onFacadeClick() {
  if (status.value === 'idle')
    status.value = 'loading'
  const el = findLite()
  if (el)
    observeActivation(el)
}

defineExpose({ playFrom, status })
</script>

<template>
  <div ref="wrap" class="min-w-0">
    <div
      class="relative w-full aspect-video rounded-2xl overflow-hidden bg-black"
      :aria-busy="status === 'loading' ? 'true' : undefined"
      @click="onFacadeClick"
    >
      <LiteYoutube
        :key="playerKey"
        :videoid="videoId"
        :playlabel="playlabel"
        :start="start"
      />
      <p
        v-if="status === 'loading'"
        class="absolute inset-x-0 bottom-3 text-center text-sm text-white/90 pointer-events-none"
      >
        Loading video…
      </p>
    </div>
    <p
      v-if="status === 'error'"
      class="mt-2.5 mb-0 text-sm text-gray-600 dark:text-gray-300"
    >
      The video didn't load.
      <a
        :href="watchUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-[#d8002d] dark:text-[#ff5a73] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
      >Watch on YouTube</a>.
    </p>
    <p
      v-else
      class="mt-2.5 mb-0 text-sm text-gray-600 dark:text-gray-300"
    >
      The video loads from YouTube only when you press play.
    </p>
  </div>
</template>

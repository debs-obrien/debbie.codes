<script setup lang="ts">
/**
 * Mounts only after the visitor opts in. Runs the input-length guard here so
 * nothing watches the embed until the widget is on the page.
 */
const props = defineProps<{
  agentId: string
  actionText: string
  startCallText: string
  endCallText: string
}>()

useConvaiInputLimit()

const host = ref<HTMLElement | null>(null)
let focusPoll: ReturnType<typeof setInterval> | null = null

function tryFocus(): boolean {
  const el = host.value
  if (!el)
    return false
  const inShadow = el.shadowRoot?.querySelector<HTMLElement>(
    'button, [role="button"], [tabindex]:not([tabindex="-1"])',
  )
  const target = inShadow ?? el
  if (inShadow || el.tabIndex >= 0) {
    target.focus()
    return document.activeElement === target || document.activeElement === el || Boolean(inShadow && el.shadowRoot?.activeElement)
  }
  el.setAttribute('tabindex', '-1')
  el.focus()
  return document.activeElement === el
}

onMounted(() => {
  if (tryFocus())
    return
  focusPoll = setInterval(() => {
    if (tryFocus() && focusPoll != null) {
      clearInterval(focusPoll)
      focusPoll = null
    }
  }, 100)
  // Give the embed a few seconds to paint its shadow UI, then stop.
  setTimeout(() => {
    if (focusPoll != null) {
      clearInterval(focusPoll)
      focusPoll = null
    }
  }, 5000)
})

onBeforeUnmount(() => {
  if (focusPoll != null) {
    clearInterval(focusPoll)
    focusPoll = null
  }
})
</script>

<template>
  <elevenlabs-convai
    ref="host"
    :agent-id="props.agentId"
    :action-text="props.actionText"
    :start-call-text="props.startCallText"
    :end-call-text="props.endCallText"
    disable-banner="true"
  />
</template>

<script setup lang="ts">
/**
 * Nuxt Content turns <lite-youtube> in markdown into a LiteYoutube Vue
 * component. This wrapper mounts the real lite-youtube-embed custom element
 * (registered by plugins/youtube.client.js).
 *
 * lite-youtube-embed reads start time from the `params` attribute
 * (`start=N`), not a bare `start` attribute. We map `start` → params here.
 * The iframe loads from youtube-nocookie.com only after the visitor presses play.
 */
const props = withDefaults(defineProps<{
  videoid: string
  playlabel?: string
  start?: string | number
}>(), {
  playlabel: 'Play video',
  start: 0,
})

const params = computed(() => {
  const seconds = Math.trunc(Number(props.start) || 0)
  return seconds > 0 ? `start=${seconds}` : undefined
})
</script>

<template>
  <ClientOnly>
    <lite-youtube
      :videoid="videoid"
      :playlabel="playlabel"
      :params="params"
      :style="youtubePosterStyle(videoid, 'sddefault')"
    />
  </ClientOnly>
</template>

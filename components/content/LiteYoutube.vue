<script setup lang="ts">
/**
 * Nuxt Content turns <lite-youtube> in markdown into a LiteYoutube Vue
 * component. This wrapper mounts the real lite-youtube-embed custom element
 * (registered by plugins/youtube.client.js).
 */
withDefaults(defineProps<{
  videoid: string
  playlabel?: string
  start?: string | number
}>(), {
  playlabel: 'Play video',
  start: 0,
})
</script>

<template>
  <ClientOnly>
    <lite-youtube
      :videoid="videoid"
      :playlabel="playlabel"
      :start="start"
    />
  </ClientOnly>
</template>

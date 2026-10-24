<script setup lang="ts">
// Unknown routes must answer 404, not 200: in dev/SSR, and during prerender
// (so crawled broken links aren't written out as pages). Netlify then serves
// 404.html with a 404 status.
const event = useRequestEvent()
if (event)
  setResponseStatus(event, 404, 'Page Not Found')
</script>

<template>
  <NotFound />
</template>

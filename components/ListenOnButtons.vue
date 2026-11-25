<script setup lang="ts">
import { coffeeListenLinks } from '~/utils/coffee-with-debbie'

const linkClass
  = 'inline-flex items-center gap-2 px-[18px] py-2.5 rounded-[10px] text-base font-semibold no-underline bg-[#0d2538] text-white hover:bg-[#16344a] hover:no-underline hover:text-white dark:bg-[#f3f5f4] dark:text-[#0d2538] dark:hover:bg-white dark:hover:text-[#0d2538] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]'
</script>

<template>
  <div
    class="flex flex-wrap gap-3"
    role="group"
    aria-label="Listen on"
  >
    <a
      :href="coffeeListenLinks.spotify"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Listen on Spotify (opens in a new tab)"
      :class="linkClass"
    >
      <svg class="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.18c-.3.42-.84.6-1.26.3-3.22-1.98-8.14-2.58-11.94-1.38-.48.12-.96-.18-1.08-.66-.12-.48.18-.96.66-1.08 4.38-1.32 9.76-.66 13.48 1.62.36.18.54.78.14 1.2zm.12-3.3C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.54-1.02.72-1.56.42z" /></svg>
      Spotify
    </a>

    <a
      :href="coffeeListenLinks.youtube"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch on YouTube (opens in a new tab)"
      :class="linkClass"
    >
      <svg class="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 00-2.12-2.14C19.5 3.7 12 3.7 12 3.7s-7.5 0-9.38.36A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.12 2.14C4.5 20.3 12 20.3 12 20.3s7.5 0 9.38-.36A3 3 0 0023.5 17.8 31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.75 15.57V8.43L15.84 12l-6.09 3.57z" /></svg>
      YouTube
    </a>

    <a
      :href="coffeeListenLinks.apple"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Listen on Apple Podcasts (opens in a new tab)"
      :class="linkClass"
    >
      <svg class="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.72 12.73c-.03-2.25 1.84-3.33 1.92-3.38-1.05-1.53-2.68-1.74-3.26-1.76-1.38-.14-2.7.82-3.4.82-.7 0-1.79-.8-2.95-.78-1.51.02-2.91.88-3.69 2.24-1.58 2.74-.4 6.8 1.13 9.02.75 1.09 1.64 2.31 2.81 2.27 1.13-.05 1.56-.73 2.93-.73 1.36 0 1.75.73 2.95.7 1.22-.02 1.99-1.11 2.73-2.21.86-1.25 1.21-2.47 1.23-2.53-.03-.01-2.36-.9-2.4-3.66zM14.9 6.4c.62-.75 1.04-1.79.92-2.83-.89.04-1.97.6-2.61 1.35-.57.66-1.07 1.73-.94 2.75 1 .08 2.01-.51 2.63-1.27z" /></svg>
      Apple Podcasts
    </a>
  </div>
</template>

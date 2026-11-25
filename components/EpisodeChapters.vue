<script setup lang="ts">
import type { ShowChapter } from '~/utils/coffee-with-debbie'
import { formatChapterTime } from '~/utils/coffee-with-debbie'
import { youtubeWatchUrl } from '~/utils/youtube'

const props = defineProps<{
  videoId: string
  chapters: ShowChapter[]
}>()

const emit = defineEmits<{
  (e: 'select', seconds: number): void
}>()

function onChapterClick(event: MouseEvent, chapter: ShowChapter) {
  // Keep middle-click / ctrl-click / cmd-click as real watch-URL fallbacks.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return
  }
  event.preventDefault()
  emit('select', chapter.time)
}
</script>

<template>
  <nav
    class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
    aria-labelledby="chapters-heading"
  >
    <h3 id="chapters-heading" class="text-base font-bold text-[#0d2538] dark:text-white mb-2 px-2">
      Chapters
    </h3>
    <ol class="list-none m-0 p-0">
      <li v-for="chapter in chapters" :key="`${chapter.time}-${chapter.title}`">
        <a
          :href="youtubeWatchUrl(props.videoId, chapter.time)"
          class="grid grid-cols-[4.2rem_1fr] gap-2 py-[7px] px-3 rounded-lg no-underline text-[15px] leading-snug text-[#0d2538] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:no-underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73] group"
          @click="onChapterClick($event, chapter)"
        >
          <span class="text-[#d8002d] dark:text-[#ff5a73] font-semibold text-[13px] tabular-nums group-hover:text-[#d8002d] dark:group-hover:text-[#ff5a73]">
            {{ formatChapterTime(chapter.time) }}
          </span>
          <span class="font-medium group-hover:text-[#d8002d] dark:group-hover:text-[#ff5a73]">
            {{ chapter.title }}
          </span>
        </a>
      </li>
    </ol>
  </nav>
</template>

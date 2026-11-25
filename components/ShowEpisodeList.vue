<script setup lang="ts">
import type { ShowEpisode } from '~/utils/coffee-with-debbie'

defineProps<{
  episodes: ShowEpisode[]
}>()
</script>

<template>
  <section class="mb-16" aria-labelledby="all-episodes-heading">
    <h2 id="all-episodes-heading" class="text-[1.75rem] font-bold text-[#0d2538] dark:text-white mb-6">
      All episodes
    </h2>
    <ol class="list-none m-0 p-0">
      <li v-for="episode in episodes" :key="episode.number">
        <NuxtLink
          :to="episode.blogPath"
          class="grid grid-cols-[3.5rem_1fr] gap-4 py-5 border-t border-gray-200 dark:border-gray-700 no-underline text-inherit hover:no-underline group focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
        >
          <span class="font-extrabold text-[#d8002d] dark:text-[#ff5a73] text-lg pt-0.5">
            #{{ episode.number }}
          </span>
          <span>
            <h3 class="m-0 mb-1 text-xl font-bold text-[#0d2538] dark:text-white leading-snug group-hover:text-[#d8002d] dark:group-hover:text-[#ff5a73]">
              {{ episode.title }}
            </h3>
            <p class="m-0 mb-3 text-[15px] font-medium text-gray-600 dark:text-gray-300">
              <Date :date="episode.date" /> · {{ episode.duration }}
            </p>
            <p class="m-0 text-[inherit] max-w-3xl">
              {{ episode.short }}
            </p>
          </span>
        </NuxtLink>
      </li>
    </ol>
    <p
      v-if="episodes.length"
      class="mt-4 mb-0 text-base text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4"
    >
      New episodes most weeks. Check back soon.
    </p>
    <p
      v-else
      class="mt-0 mb-0 text-base text-gray-600 dark:text-gray-300"
    >
      New episodes most weeks. Check back soon.
    </p>
  </section>
</template>

<script setup lang="ts">
import {
  coffeeShowCover,
  coffeeWithDebbieEpisodes,
} from '~/utils/coffee-with-debbie'

const latest = coffeeWithDebbieEpisodes[0]
</script>

<template>
  <section
    class="mb-12 max-w-4xl mx-auto"
    aria-labelledby="my-show-heading"
    data-testid="my-show-section"
  >
    <div class="bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <div class="md:w-[280px] flex items-center justify-center p-5 md:p-6 bg-[#f4e9da]">
          <NuxtLink
            to="/coffee-with-debbie"
            class="block no-underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
            aria-label="Coffee with Debbie cover, go to the show page"
          >
            <picture>
              <source :srcset="coffeeShowCover.src600" type="image/webp">
              <img
                :src="coffeeShowCover.jpg600"
                width="232"
                height="232"
                :alt="coffeeShowCover.alt"
                class="w-full max-w-[280px] md:max-w-[232px] aspect-square object-contain rounded-xl"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              >
            </picture>
          </NuxtLink>
        </div>
        <div class="p-7 md:px-8 md:py-8 flex flex-col justify-center md:flex-1">
          <div class="inline-flex items-center gap-2 mb-3">
            <div
              class="relative w-2.5 h-2.5 bg-primary rounded-full motion-safe:animate-pulse"
              aria-hidden="true"
            />
            <span class="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              My show
            </span>
          </div>
          <h2
            id="my-show-heading"
            class="text-[1.6rem] font-bold text-gray-900 dark:text-white mb-2 leading-tight"
          >
            <NuxtLink
              to="/coffee-with-debbie"
              class="text-inherit no-underline hover:text-[#d8002d] dark:hover:text-[#ff5a73] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
            >
              Coffee with Debbie
            </NuxtLink>
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-5">
            A weekly video podcast about life in tech. Grab a coffee and join me.
          </p>
          <ListenOnButtons />
        </div>
      </div>

      <div
        v-if="latest"
        class="border-t border-gray-200 dark:border-slate-700 px-7 py-6 md:px-8"
        data-testid="my-show-latest-episode"
      >
        <p class="m-0 mb-1 text-[13px] font-bold uppercase tracking-[0.12em] text-[#d8002d] dark:text-[#ff5a73]">
          Latest episode
        </p>
        <h3 class="m-0 mb-1 text-xl font-bold leading-snug text-gray-900 dark:text-white">
          <NuxtLink
            to="/coffee-with-debbie"
            class="text-inherit no-underline hover:text-[#d8002d] dark:hover:text-[#ff5a73] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
          >
            {{ latest.title }}
          </NuxtLink>
        </h3>
        <p class="m-0 mb-2 text-[15px] font-medium text-gray-600 dark:text-gray-300">
          <Date :date="latest.date" /> · {{ latest.duration }}
        </p>
        <p class="m-0 mb-3 text-gray-600 dark:text-gray-300">
          {{ latest.short }}
        </p>
        <NuxtLink
          to="/coffee-with-debbie"
          class="inline-flex items-center gap-2 font-semibold text-[#d8002d] dark:text-[#ff5a73] no-underline hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
        >
          Open the show page
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { coffeeShowCover } from '~/utils/coffee-with-debbie'
</script>

<template>
  <article class="mb-12 max-w-4xl mx-auto">
    <NuxtLink
      to="/coffee-with-debbie"
      class="group block no-underline hover:no-underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
      aria-label="Listen to Coffee with Debbie, my weekly video podcast"
    >
      <div class="bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden transition-all duration-300 motion-safe:group-hover:shadow-2xl motion-safe:group-hover:scale-[1.01]">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-[280px] flex items-center justify-center p-5 md:p-6 bg-[#f4e9da]">
            <picture>
              <source :srcset="coffeeShowCover.src600" type="image/webp">
              <img
                :src="coffeeShowCover.jpg600"
                width="232"
                height="232"
                alt=""
                class="w-full max-w-[280px] md:max-w-[232px] aspect-square object-contain rounded-xl"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              >
            </picture>
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
            <h2 class="text-[1.6rem] font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              Coffee with Debbie
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              A weekly video podcast about life in tech. Grab a coffee and join me.
            </p>
            <div class="inline-flex items-center gap-2.5 self-start bg-primary-fill text-white font-bold py-3 px-[22px] rounded-[10px] transition-colors group-hover:bg-primary-fill/90">
              <svg class="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              <span>Listen to the show</span>
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

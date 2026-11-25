<script setup lang="ts">
import {
  coffeeShowCover,
  coffeeWithDebbieEpisodes,
} from '~/utils/coffee-with-debbie'

const title = 'Coffee with Debbie'
const description = 'Coffee with Debbie is my weekly solo video podcast about life in tech, from DevRel and hiring to AI, community and the human side of things. Grab a coffee and join me.'
const ogImage = `https://debbie.codes${coffeeShowCover.og}`
const latest = coffeeWithDebbieEpisodes[0]
const player = ref<{ playFrom: (seconds: number) => void } | null>(null)

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:site_name', content: 'Debbie Codes' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://debbie.codes/coffee-with-debbie' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ],
  link: [{ rel: 'canonical', href: 'https://debbie.codes/coffee-with-debbie' }],
})

function onChapterSelect(seconds: number) {
  player.value?.playFrom(seconds)
}
</script>

<template>
  <main class="px-4 sm:px-6 max-w-[1120px] mx-auto pb-6">
    <NuxtLink
      to="/podcasts"
      class="inline-block mt-2 mb-7 text-[15px] font-medium text-gray-600 dark:text-gray-300 no-underline hover:text-[#d8002d] dark:hover:text-[#ff5a73] hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
    >
      Back to podcasts
    </NuxtLink>

    <section
      class="coffee-hero mb-16 grid gap-6 md:gap-x-14 md:gap-y-2 md:grid-cols-[1fr_320px] md:items-center"
      aria-labelledby="show-title"
    >
      <div class="coffee-hero-copy">
        <p class="m-0 mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#d8002d] dark:text-[#ff5a73]">
          A weekly video podcast
        </p>
        <h1
          id="show-title"
          class="m-0 text-[2.5rem] md:text-[3.25rem] font-extrabold leading-tight tracking-tight text-[#0d2538] dark:text-white md:mb-0"
        >
          Coffee with Debbie
        </h1>
      </div>

      <div class="coffee-hero-cover mx-auto md:mx-0 w-full max-w-[360px] md:w-[320px] md:max-w-none rounded-[20px] overflow-hidden shadow-xl bg-[#f4e9da]">
        <picture>
          <source
            :srcset="`${coffeeShowCover.src600} 600w, ${coffeeShowCover.src1200} 1200w`"
            type="image/webp"
            sizes="(min-width: 800px) 320px, min(100vw - 32px, 360px)"
          >
          <img
            :src="coffeeShowCover.jpg1200"
            width="1200"
            height="1200"
            :alt="coffeeShowCover.alt"
            class="w-full aspect-square object-contain"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          >
        </picture>
      </div>

      <div class="coffee-hero-rest md:pt-2">
        <p class="m-0 mb-3 text-[1.05rem] max-w-xl">
          Coffee with Debbie is my weekly solo video podcast. I don't even drink coffee. I just wanted a place to get some thoughts out there, connect with people, and maybe help some people along the way.
        </p>
        <p class="m-0 mb-7 text-[1.05rem] font-semibold text-[#0d2538] dark:text-white">
          Grab a coffee and join me.
        </p>
        <ListenOnButtons />
      </div>
    </section>

    <section v-if="latest" class="mb-16" aria-labelledby="latest-heading">
      <h2 id="latest-heading" class="m-0 mb-6 text-[1.75rem] font-bold text-[#0d2538] dark:text-white">
        Latest episode
      </h2>
      <p class="m-0 mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-[#d8002d] dark:text-[#ff5a73]">
        Episode {{ latest.number }}
      </p>
      <h3 class="m-0 mb-2 text-[1.6rem] font-bold leading-snug text-[#0d2538] dark:text-white">
        {{ latest.title }}
      </h3>
      <p class="m-0 mb-3 text-[15px] font-medium text-gray-600 dark:text-gray-300">
        <Date :date="latest.date" /> · {{ latest.duration }}
      </p>
      <p class="m-0 mb-3 max-w-3xl">
        {{ latest.short }}
      </p>
      <NuxtLink
        :to="latest.blogPath"
        class="inline-block mb-6 font-semibold text-[#d8002d] dark:text-[#ff5a73] no-underline hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
      >
        Read the blog post
      </NuxtLink>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(240px,1fr)] lg:gap-7 lg:items-start">
        <EpisodePlayer
          ref="player"
          :video-id="latest.videoId"
          :playlabel="`Play episode ${latest.number}: ${latest.title}`"
        />
        <EpisodeChapters
          :video-id="latest.videoId"
          :chapters="latest.chapters"
          @select="onChapterSelect"
        />
      </div>
    </section>

    <ShowEpisodeList :episodes="coffeeWithDebbieEpisodes" />

    <section
      class="bg-gray-50 dark:bg-gray-800 rounded-2xl px-8 py-7 text-center"
      aria-labelledby="suggest-heading"
    >
      <h2 id="suggest-heading" class="sr-only">
        Suggest a topic
      </h2>
      <p class="m-0">
        Got a topic you'd like me to talk about?
        <NuxtLink
          to="/contact"
          class="font-bold text-[#d8002d] dark:text-[#ff5a73] no-underline hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
        >
          Suggest one on the contact page
        </NuxtLink>.
      </p>
    </section>
  </main>
</template>

<style scoped>
.coffee-hero {
  grid-template-areas:
    "copy"
    "cover"
    "rest";
}
.coffee-hero-copy { grid-area: copy; }
.coffee-hero-cover { grid-area: cover; }
.coffee-hero-rest { grid-area: rest; }

@media (min-width: 800px) {
  .coffee-hero {
    grid-template-areas:
      "copy cover"
      "rest cover";
  }
}
</style>

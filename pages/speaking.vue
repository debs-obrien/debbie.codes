<script setup lang="ts">
const upcoming = [
  {
    event: 'ZurichJS Conf',
    dates: '10–11 September 2026',
    place: 'Zurich, Switzerland',
    title: 'Bug Report In, Pull Request Out: Agentic CI with Playwright',
    url: 'https://conf.zurichjs.com/speakers/debbie-o-brien',
    note: 'Also a workshop on 10 September.',
  },
  {
    event: 'Infobip Shift',
    dates: '13–15 September 2026',
    place: 'Zadar, Croatia',
    title: 'The Agentic Developer: Orchestrating AI Workflows With Skills and MCPs',
    url: 'https://shift.infobip.com/agenda/',
    note: '',
  },
]

useHead({
  title: 'Speaking',
  meta: [{
    name: 'description',
    content: 'Upcoming talks by Debbie O\'Brien on Playwright, MCP, and AI agents, including ZurichJS and Infobip Shift 2026.',
  }],
  link: [{ rel: 'canonical', href: 'https://debbie.codes/speaking' }],
})
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <p class="mb-4 text-primary text-sm font-semibold uppercase tracking-widest">
      Speaking
    </p>
    <h1 class="text-4xl sm:text-5xl font-bold mb-6">
      Talks
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-10">
      I speak about Playwright, testing, and building with AI agents.
      I already take fewer events than I am invited to, so this page lists what is booked rather than an open call.
    </p>

    <h2 class="text-2xl font-bold mb-6">
      Upcoming
    </h2>
    <ul class="space-y-6 mb-12">
      <li
        v-for="talk in upcoming"
        :key="talk.event"
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/80 p-6"
      >
        <p class="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
          {{ talk.event }}
        </p>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ talk.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-1">
          {{ talk.dates }} · {{ talk.place }}
        </p>
        <p v-if="talk.note" class="text-gray-600 dark:text-gray-300 mb-3">
          {{ talk.note }}
        </p>
        <a
          :href="talk.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary font-medium hover:underline"
        >
          Event site
        </a>
      </li>
    </ul>

    <p class="text-gray-600 dark:text-gray-300">
      Past talks live on the
      <NuxtLink to="/videos/tags/conference-talk" class="text-primary hover:underline">
        conference videos
      </NuxtLink>
      page. For anything else,
      <a href="mailto:dobriendev@gmail.com" class="text-primary hover:underline">email me</a>.
    </p>
  </main>
</template>

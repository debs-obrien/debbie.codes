<script setup lang="ts">
const upcoming: {
  event: string
  dates: string
  place: string
  title: string
  url: string
  linkLabel: string
}[] = []

useHead({
  title: 'Speaking',
  meta: [{
    name: 'description',
    content: 'Talks by Debbie O\'Brien on Playwright, MCP, and AI agents — conference videos and slide decks.',
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
    </p>

    <h2 class="text-2xl font-bold mb-6">
      Upcoming
    </h2>
    <ul
      v-if="upcoming.length"
      class="space-y-6 mb-12"
    >
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
        <p class="text-gray-600 dark:text-gray-300 mb-3">
          {{ talk.dates }} · {{ talk.place }}
        </p>
        <a
          :href="talk.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary font-medium hover:underline"
        >
          {{ talk.linkLabel }}
        </a>
      </li>
    </ul>
    <p
      v-else
      class="text-gray-600 dark:text-gray-300 mb-12"
    >
      No upcoming talks listed — see conference videos / decks below.
    </p>

    <p class="text-gray-600 dark:text-gray-300">
      Past talks live on the
      <NuxtLink to="/videos/tags/conference-talk" class="text-primary hover:underline">
        conference videos
      </NuxtLink>
      page; you can find my
      <a
        href="https://github.com/debs-obrien/decks"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary hover:underline"
      >slide decks on GitHub</a>.
      For anything else,
      <a href="mailto:dobriendev@gmail.com" class="text-primary hover:underline">email me</a>.
    </p>
  </main>
</template>

<script setup lang="ts">
import { PUBLIC_MAILTO } from '~/utils/site-contact'

interface Talk {
  event: string
  title: string
  dates?: string
  place?: string
  url: string
  linkLabel: string
}

const upcoming: Talk[] = []

// Past talks newest first. Deck folders from https://github.com/debs-obrien/decks.
// Infobip title from https://shift.infobip.com/agenda/. Endform date from https://luma.com/70r2iqag.
// Omit any field not verified on those sources.
const past2026: Talk[] = [
  {
    event: 'Endform',
    title: 'Bug Report In, Pull Request Out: Agentic CI with Playwright',
    dates: '12 Nov 2026',
    place: 'Online',
    url: 'https://github.com/debs-obrien/decks/tree/main/endform-2026-bug-report-pr-out',
    linkLabel: 'Endform slide deck on GitHub',
  },
  {
    event: 'Infobip Shift 2026',
    title: 'The Agentic Developer: Orchestrating AI Workflows With Skills and MCPs',
    dates: 'Tue 15 Sep 2026',
    place: 'Zadar',
    url: 'https://github.com/debs-obrien/decks/tree/main/infobip-shift-2026-agentic-developer',
    linkLabel: 'Infobip Shift 2026 slide deck on GitHub',
  },
  {
    event: 'ZurichJS Conf 2026',
    title: 'Bug Report In, Pull Request Out: Agentic CI with Playwright',
    dates: 'Fri 11 Sep 2026',
    url: 'https://github.com/debs-obrien/decks/tree/main/zurichjs-2026-bug-report-pr-out',
    linkLabel: 'ZurichJS Conf 2026 slide deck on GitHub',
  },
  {
    event: 'DevSum 2026',
    title: 'The Agentic Developer: Orchestrating AI Workflows with MCPs',
    dates: 'June 2026',
    place: 'Stockholm',
    url: 'https://github.com/debs-obrien/decks/tree/main/devsum-2026-agentic-developer-mcps',
    linkLabel: 'DevSum 2026 slide deck on GitHub',
  },
]

function talkMeta(talk: Talk) {
  return [talk.dates, talk.place].filter(Boolean).join(' · ')
}

useHead({
  title: 'Speaking',
  meta: [{
    name: 'description',
    content: 'Talks by Debbie O\'Brien on Playwright, MCP, and AI agents: conference videos and slide decks.',
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
        <p
          v-if="talkMeta(talk)"
          class="text-gray-600 dark:text-gray-300 mb-3"
        >
          {{ talkMeta(talk) }}
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
      No upcoming talks listed right now. Past talks and decks are below.
    </p>

    <h2 class="text-2xl font-bold mb-6">
      2026 talks
    </h2>
    <ul class="space-y-6 mb-12">
      <li
        v-for="talk in past2026"
        :key="`${talk.event}-${talk.title}`"
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/80 p-6"
      >
        <p class="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
          {{ talk.event }}
        </p>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ talk.title }}
        </h3>
        <p
          v-if="talkMeta(talk)"
          class="text-gray-600 dark:text-gray-300 mb-3"
        >
          {{ talkMeta(talk) }}
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

    <p class="text-gray-600 dark:text-gray-300">
      More past talks live on the
      <NuxtLink to="/videos/tags/conference-talk" class="text-primary underline">
        conference videos
      </NuxtLink>
      page; you can find my
      <a
        href="https://github.com/debs-obrien/decks"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary underline"
      >slide decks on GitHub</a>.
      For anything else,
      <a :href="PUBLIC_MAILTO" class="text-primary underline">email me</a>.
    </p>
  </main>
</template>

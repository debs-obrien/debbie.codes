<script setup lang="ts">
useHead({
  title: 'Now',
  meta: [{
    name: 'description',
    content: 'What Debbie O\'Brien is working on now: Playwright, AI agents, upcoming talks, and being open to connections.',
  }],
  link: [{ rel: 'canonical', href: 'https://debbie.codes/now' }],
})
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <p class="mb-4 text-primary text-sm font-semibold uppercase tracking-widest">
      Now
    </p>
    <h1 class="text-4xl sm:text-5xl font-bold mb-6">
      What I’m doing now
    </h1>
    <p class="text-gray-600 dark:text-gray-300 mb-8">
      Updated September 2026. A snapshot, not a CV.
    </p>

    <div class="prose dark:prose-invert max-w-none space-y-6">
      <section>
        <h2>Work</h2>
        <p>
          My Zephyr Cloud contract has ended. I am looking for what is next and
          <strong>open to connections</strong> — roles, collaborations, and interesting problems in applied AI, Playwright, and developer experience.
        </p>
        <p>
          Email
          <a href="mailto:dobriendev@gmail.com">dobriendev@gmail.com</a>.
          A bot helps me triage, so write a clear subject.
        </p>
      </section>

      <section>
        <h2>Teaching</h2>
        <p>
          I am writing and recording about Playwright, MCP, and agent skills.
          The hands-on starting points are the
          <a href="https://github.com/debs-obrien/playwright-movies-app">Playwright movies app</a>,
          <a href="https://github.com/debs-obrien/learn-agent-skills">Learn Agent Skills</a>,
          and the
          <a href="https://www.youtube.com/watch?v=AKjW94vQZkc">Let’s Learn MCP</a>
          session.
        </p>
      </section>

      <section>
        <h2>Speaking</h2>
        <p>
          Upcoming: <NuxtLink to="/speaking">ZurichJS and Infobip Shift</NuxtLink> in September 2026.
          I already say yes to fewer events than I am asked to, so this page is not an open booking form.
        </p>
      </section>

      <section>
        <h2>Home</h2>
        <p>
          Palma de Mallorca. Running, cycling, and taekwondo with the twins in the mix.
        </p>
      </section>
    </div>
  </main>
</template>

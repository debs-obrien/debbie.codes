<script setup lang="ts">
useHead({
  title: 'Contact',
  meta: [{
    name: 'description',
    content: 'Email Debbie O\'Brien at dobriendev@gmail.com.',
  }],
  link: [{ rel: 'canonical', href: 'https://debbie.codes/contact' }],
})
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="text-4xl sm:text-5xl font-bold mb-6">
      Contact
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
      Email
      <a href="mailto:dobriendev@gmail.com" class="text-primary font-medium hover:underline">
        dobriendev@gmail.com
      </a>.
      A bot helps me sort mail, so a clear subject line helps.
    </p>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      Good reasons to write: work, collaboration, podcasts, or something you are building with Playwright or agents.
    </p>
    <p class="text-gray-600 dark:text-gray-300">
      I list confirmed talks on the
      <NuxtLink to="/speaking" class="text-primary hover:underline">speaking</NuxtLink>
      page. I cannot take most new speaking invites.
    </p>
  </main>
</template>

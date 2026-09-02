<script setup lang="ts">
useHead({
  title: 'Contact',
  meta: [{
    name: 'description',
    content: 'How to reach Debbie O\'Brien.',
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
      I am not looking for a high volume of mail. If we already know each other,
      or you have a specific collaboration in mind, you can
      <a href="mailto:dobriendev@gmail.com" class="text-primary font-medium hover:underline">
        say hello
      </a>.
    </p>
    <p class="text-gray-600 dark:text-gray-300">
      Confirmed talks are on the
      <NuxtLink to="/speaking" class="text-primary hover:underline">speaking</NuxtLink>
      page. I cannot take most new speaking invites.
    </p>
  </main>
</template>

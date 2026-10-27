<script setup lang="ts">
useHead({
  title: 'Voice assistant privacy',
  meta: [{
    name: 'description',
    content: 'How the hire-me voice assistant handles call audio and transcripts.',
  }],
  link: [{ rel: 'canonical', href: 'https://debbie.codes/privacy' }],
})
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="text-4xl sm:text-5xl font-bold mb-6">
      Voice assistant privacy
    </h1>

    <div class="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
      <p>
        Calls to the voice assistant on the
        <NuxtLink to="/hire-me" class="text-primary font-medium hover:underline">
          hire me
        </NuxtLink>
        page are handled by ElevenLabs.
      </p>
      <p>
        Call audio is not stored. Transcripts are kept for 30 days to improve the assistant, then deleted. Visitors cannot upload files through the assistant.
      </p>
      <p>
        To ask for a transcript to be deleted sooner, or to ask about your data, use the
        <NuxtLink to="/contact" class="text-primary font-medium hover:underline">
          contact page
        </NuxtLink>.
      </p>
      <p>
        The rest of this site has no visitor accounts.
      </p>
    </div>
  </main>
</template>

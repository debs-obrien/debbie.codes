<script setup lang="ts">
import '~/assets/css/contact.css'

const title = 'Contact | Debbie O\'Brien'
const description = 'Hiring, collaborating or planning an event? Here\'s how to reach me. LinkedIn is quickest.'

useHead({
  title,
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ],
  link: [{ rel: 'canonical', href: 'https://debbie.codes/contact' }],
})
</script>

<template>
  <main class="contact-page" data-testid="contact-page">
    <ContactHero />
    <LookingForStrip />
    <SpeakingNote />
  </main>
</template>

<script setup>
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  charset: 'utf-8',
  title: 'Debbie Codes with Playwright, Nuxt, React, Tailwind and more',
  titleTemplate: title =>
    title !== 'Debbie Codes with Playwright, Nuxt, React, Tailwind and more'
      ? `${title} · Debbie Codes`
      : title,
  meta: [
    {
      name: 'description',
      content:
        'Debbie O\'Brien, Program Manager at Microsoft working on Playwright, with over 10 years experience in Frontend development. Google Developer Expert in web technologies, Previous Microsoft Most Valuable Professional in developer technologies, GitHub Start Alumni, NuxtJS Ambassador and Cloudinary Media Developer Expert.',
    },
    { property: 'og:site_name', content: 'Debbie Codes' },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: 'https://debbie.codes',
    },
    {
      property: 'og:title',
      content:
        'Debbie codes and helps others learn Playwright, testing, React, Nuxt and more',
    },
    {
      property: 'og:description',
      content:
        'Debbie O\'Brien, Program Manager at Microsoft working on Playwright, with over 10 years experience in Frontend development. Google Developer Expert in web technologies, Previous Microsoft Most Valuable Professional in developer technologies, GitHub Start Alumni, NuxtJS Ambassador and Cloudinary Media Developer Expert.',
    },
    {
      property: 'og:image',
      content: 'https://debbie.codes/twitter-card.png',
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@debs_obrien' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: 'https://debbie.codes',
    },
    {
      name: 'twitter:title',
      content:
        'Debbie codes and helps others learn Playwright, testing, React, Nuxt and more',
    },
    {
      name: 'twitter:description',
      content:
        'My website of where I play around with Nuxt, Playwright and more and showcase my blog, resources etc',
    },
    {
      name: 'twitter:image',
      content: 'https://debbie.codes/twitter-card.png',
    },
  ],

  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      hid: 'canonical',
      rel: 'canonical',
      href: 'https://debbie.codes',
    },
  ],
})
</script>

<template>
  <TheTopBar />
  <div class="container mx-auto mt-top-bar">
    <NuxtPage />
  </div>

  <TheFooter />
</template>

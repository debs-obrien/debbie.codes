<script setup>
const description = 'Debbie O\'Brien, Program Manager at Microsoft working on Playwright, with over 10 years experience in Frontend development. Google Developer Expert in web technologies, Previous Microsoft Most Valuable Professional in developer technologies, GitHub Start Alumni, NuxtJS Ambassador and Cloudinary Media Developer Expert.'
const ogTitle = 'Debbie codes and helps others learn Playwright, testing, React, Nuxt and more'
const twitterDescription = 'My website of where I play around with Nuxt, Playwright and more and showcase my blog, resources etc'
const twitterCard = 'https://debbie.codes/twitter-card.png'
const mySite = 'https://debbie.codes'

const { path } = useRoute()
const canonical = computed(()=> {
  if (path === '/') return mySite
  const { href: canonical } = new URL(path, mySite)
  return canonical
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  charset: 'utf-8',
  title: ogTitle,
  titleTemplate: title =>
    title !== ogTitle
      ? `${title} · Debbie Codes`
      : title,
  meta: [
    {
      name: 'google-site-verification',
      content: 'Nb9JyfPdxgxIzfosyzt-JsvJZkoUVlhEYN4TuoLPWF0',
    },
    {
      name: 'description',
      content:
          description,
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: mySite },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: mySite,
    },
    {
      property: 'og:title',
      content: ogTitle
      ,
    },
    {
      property: 'og:description',
      content:
          description,
    },
    {
      property: 'og:image',
      content: twitterCard,
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@debs_obrien' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: mySite,
    },
    {
      name: 'twitter:title',
      content: ogTitle,
    },
    {
      name: 'twitter:description',
      content: twitterDescription,
    },
    {
      name: 'twitter:image',
      content: twitterCard,
    },

  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      rel: 'canonical',
      href: canonical.value,
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Debbie Codes RSS Feed',
      href: `${mySite}/feed.xml`,
    },
  ],
})
</script>

<template>
  <div>
    <TheTopBar />
    <div class="lg:container mx-auto mt-top-bar px-2 md:px-4">
      <NuxtPage />
    </div>
    <TheFooter />
  </div>
</template>

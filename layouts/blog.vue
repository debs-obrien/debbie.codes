<template>
  <div class="">
    <TheTopBar />
    <div class="container mt-top-bar">
      <SearchInput />
      <nuxt />
    </div>

    <TheFooter />
  </div>
</template>
<script>
  export default {
    head: {
      meta: [
        { name: 'twitter:site', content: '@debs_obrien' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: 'https://debbie.codes.com'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: "Welcome to Debbie's blog"
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            "Debbie's Blog with lots of cool articles and tips on Nuxt and tech in general"
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: '/twitter-card-blog.png'
        }
      ]
    }
  }
</script>

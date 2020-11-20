<template>
  <span v-if="false" />
</template>

<script>
  // Test on: https://cards-dev.twitter.com/validator
  export default {
    props: {
      title: {
        type: String,
        default: 'Debbies twitter title'
      }
    },
    data: () => ({
      href:
        'https://twitter.com/intent/tweet?url=' +
        encodeURIComponent('https://head-elements.now.sh/about')
    }),
    head() {
      return {
        meta: [
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:site', content: '@nuxt_js' },
          { name: 'twitter:title', content: this.title },
          {
            name: 'twitter:description',
            content:
              'Nuxt.js lets you handle custom headers for your app with vue-meta'
          },
          {
            name: 'twitter:image',
            content: 'https://avatars0.githubusercontent.com/u/23360933?v=3'
          },
          { name: 'twitter:image:alt', content: 'Nuxt.js logo' }
        ]
      }
    }
  }
</script>

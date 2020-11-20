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
      },
      description: {
        type: String,
        default: 'Debbies twitter description'
      },
      image: {
        type: String,
        default: 'Debbies twitter image'
      }
    },

    head() {
      return {
        meta: [
          { name: 'twitter:card', content: this.description },
          { name: 'twitter:site', content: '@debs_obrien' },
          { name: 'twitter:title', content: this.title },
          {
            name: 'twitter:description',
            content: this.description
          },
          {
            name: 'twitter:image',
            content: this.image
          },
          { name: 'twitter:image:alt', content: this.title }
        ]
      }
    }
  }
</script>

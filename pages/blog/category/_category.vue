<template>
  <div class="page-wrapper mt-8">
    <div
      class="mt-12 grid gap-5 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div
        v-for="article of blogList"
        :key="article.slug"
        class="flex flex-col"
      >
        <PostsCard :item="article" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'blog',
    async asyncData({ $content, params, error }) {
      const articles = await $content('articles')
        .where({
          published: { $ne: false },
          tags: { $contains: params.category }
        })
        .sortBy('date', 'desc')
        .fetch()

      return {
        articles
      }
    },
    data() {
      return {
        selectedTag: this.$route.params.category
      }
    },

    computed: {
      blogList() {
        return this.articles.filter(el => el.tags.includes(this.selectedTag))
      }
    },
    methods: {
      FilterBlogByType(tag) {
        this.selectedTag = tag
      }
    }
  }
</script>

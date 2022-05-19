<template>
  <div class="page-wrapper">
    <div
      class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div
        v-for="article of filteredArticles"
        :key="article.slug"
        class="flex flex-col"
      >
        <PostsCard :item="article" />
      </div>
    </div>
    <Pagination
      :prevPage="pageNo > 1"
      :nextPage="nextPage"
      :pageNo="pageNo"
      :urlPrefix="`/blog/${this.$route.params.category}`"
    />
  </div>
</template>

<script>
  export default {
    layout: 'blog',
    async asyncData({ $content, params, error }) {
      const pageNo = parseInt(params.number)
      const numArticles = 9
      const getArticles = await $content('articles')
        .where({
          published: { $ne: false },
          tags: { $contains: params.category }
        })
        .sortBy('date', 'desc')
        .limit(numArticles)
        .skip(numArticles * (pageNo - 1))
        .fetch()

      if (!getArticles.length) {
        return error({ statusCode: 404, message: 'No articles found!' })
      }

      const nextPage = getArticles.length === numArticles

      return {
        nextPage,
        pageNo,
        getArticles
      }
    },
    data() {
      return {
        selectedTag: this.$route.params.category
      }
    },

    computed: {
      filteredArticles() {
        return this.getArticles.filter(article =>
          article.tags.includes(this.selectedTag)
        )
      }
    }
  }
</script>

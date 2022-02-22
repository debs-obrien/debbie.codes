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
      const tenArticles = await $content('articles')
        .where({
          published: { $ne: false },
          tags: { $contains: params.category }
        })
        .sortBy('date', 'desc')
        .limit(10)
        .skip(9 * (pageNo - 1))
        .fetch()

      if (!tenArticles.length) {
        return error({ statusCode: 404, message: 'No articles found!' })
      }

      const nextPage = tenArticles.length === 10
      const articles = nextPage ? tenArticles.slice(0, -1) : tenArticles

      return {
        nextPage,
        articles,
        pageNo
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

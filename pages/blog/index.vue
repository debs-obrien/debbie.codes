<template>
  <div class="page-wrapper mt-8">
    <SocialHead :title="title" :description="description" :image="image" />

    <AppTitle>Welcome to my blog</AppTitle>
    <AppIntro>
      Here you will find various blog posts on all things related to Frontend
      and JavaScript but especially on things related to Nuxt.
    </AppIntro>

    <div class="buttons flex flex-wrap mt-8 justify-center">
      <div v-for="(tag, i) in tags" :key="i">
        <button class="btn" @click="FilterBlogByType(tag)">
          {{ tag }}
        </button>
      </div>
    </div>

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
    <Pagination />
  </div>
</template>

<script>
  export default {
    layout: 'blog',
    async asyncData({ $content, params }) {
      const currentPage = parseInt(params.page)
      const perPage = 5
      const allArticles = await $content('articles')
        .where({ published: { $ne: false } })
        .fetch()

      const totalArticles = allArticles.length

      const lastPage = Math.ceil(totalArticles / perPage)
      const lastPageCount =
        totalArticles % perPage === 0 ? perPage : totalArticles % perPage

      const skipNumber = () => {
        if (currentPage === 1) {
          return 0
        }
        if (currentPage === lastPage) {
          return totalArticles - lastPageCount
        }
        return (currentPage - 1) * perPage
      }
      const paginatedArticles = await $content('articles')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .limit(perPage)
        .skip(skipNumber())
        .fetch()

      if (currentPage === 0 || !paginatedArticles.length) {
        return error({ statusCode: 404, message: 'No articles found!' })
      }

      const articles = await $content('articles')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        allArticles,
        paginatedArticles,
        articles
      }
    },
    data() {
      return {
        selectedTag: 'all',
        tags: ['Nuxt', 'React', 'Testing', 'Dev Stuff', 'Performance', 'all'],
        title: "Welcome to Debbie's blog",
        description:
          "Debbie's Blog with lots of cool articles and tips on Nuxt, React, TypeScript and tech in general",
        image: 'https://debbie.codes/twitter-card-blog.png'
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.description
          }
        ],
        link: [
          {
            hid: 'canonical',
            rel: 'canonical',
            href: 'https://debbie.codes/blog'
          }
        ]
      }
    },

    computed: {
      blogList() {
        return this.paginatedArticles.filter(el =>
          el.tags.includes(this.selectedTag)
        )
      }
    },
    methods: {
      FilterBlogByType(tag) {
        this.selectedTag = tag
      },
      onPageChange(page) {
        this.currentPage = page
      }
    }
  }
</script>
<style scoped>
  .btn {
    --bg-opacity: 1;
    background-color: #d8002d;
    background-color: rgba(216, 0, 45, var(--bg-opacity));
    --text-opacity: 1;
    color: #fff;
    color: rgba(255, 255, 255, var(--text-opacity));
    padding: 0.5rem;
    border-radius: 0.25rem;
    --border-opacity: 1;
    border: 2px solid #d8002d;
    border-color: rgba(216, 0, 45, var(--border-opacity));
    /* font-family: Saira; */
    letter-spacing: 0.5px;
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
</style>

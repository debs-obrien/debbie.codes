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
        <nuxt-link class="btn" :to="`/blog/category/${tag}`">
          {{ tag }}
        </nuxt-link>
      </div>
      <div><nuxt-link class="btn" :to="`/blog`">all</nuxt-link></div>
    </div>

    <div
      class="mt-12 grid gap-5 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div
        v-for="article of articles"
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
      urlPrefix="/blog"
    />
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params, error }) {
      const pageNo = parseInt(params.number)
      const tenArticles = await $content('articles')
        .where({ published: { $ne: false } })
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

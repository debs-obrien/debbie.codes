<template>
  <div class="page-wrapper mt-8">
    <SocialHead :title="title" :description="description" :image="image" />

    <AppTitle>Welcome to my blog</AppTitle>
    <AppIntro>
      Here you will find various blog posts on all things related to Frontend
      and JavaScript but espeically on things related to Nuxt.
    </AppIntro>

    <div class="buttons flex flex-wrap mt-8 justify-center">
      <div v-for="(tag, i) in tags" :key="i">
        <button class="btn" @click="FilterBlogByType(tag)">
          {{ tag }}
        </button>
      </div>
    </div>

    <div class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
      <div v-for="article of blogList" :key="article.slug">
        <PostsCard :item="article" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'blog',
    async asyncData({ $content, params }) {
      const articles = await $content('articles')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        articles
      }
    },
    data() {
      return {
        selectedTag: 'all',
        tags: [
          'Nuxt',
          'all',
          'Lifestyle',
          'webpack',
          'PWA',
          'Cypress',
          'Content',
          'webpack'
        ],
        title: "Welcome to Debbie's blog",
        description:
          "Debbie's Blog with lots of cool articles and tips on Nuxt and tech in general",
        image: 'https://debbie.codes/twitter-card-blog.png'
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'desctiption',
            content: this.desctiption
          }
        ]
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
    font-family: Saira;
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
</style>

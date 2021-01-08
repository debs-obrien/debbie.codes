<template>
  <div class="page-wrapper mt-8">
    <SocialHead :title="title" :description="description" :image="image" />

    <AppTitle>Welcome to my blog</AppTitle>
    <AppIntro>
      Here you will find various blog posts on all things related to Frontend
      and JavaScript but espeically on things related to Nuxt.
    </AppIntro>

    <div class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
      <div v-for="article of articles" :key="article.slug">
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
    }
  }
</script>

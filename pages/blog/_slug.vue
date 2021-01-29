<template>
  <div class="flex mt-4">
    <SocialHead
      :title="page.title"
      :description="page.description"
      :image="page.image"
    />
    <div class="mx-auto">
      <!-- <SearchInput search-item="articles" /> -->
      <AppBreadCrumb link="blog" :title="page.title" />
      <article class="md:p-8 prose prose-md lg:prose-lg mx-auto">
        <h1 class="title">
          {{ page.title }}
        </h1>

        <!-- {{ stats.text }} -->
        <nuxt-content :document="page" class="" />
      </article>
      <h3 class="border-solid border-t-4 border-gray-600 pt-4">
        Check out some of my other posts:
      </h3>
      <ArticlePrevNext :prev="prev" :next="next" class="mt-4" />
    </div>
  </div>
</template>

<script>
  const readingTime = require('reading-time')

  export default {
    async asyncData({ $content, params }) {
      const slug = params.slug || 'index'

      const page = await $content('articles', slug).fetch()
      const articles = await $content('articles')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      const [prev, next] = await $content('articles')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .surround(slug)
        .fetch()

      const stats = readingTime(page.readingTime)

      return {
        page,
        prev,
        next,
        stats,
        articles
      }
    },
    head() {
      return {
        title: this.page.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.page.description
          }
        ],
        link: [
          {
            hid: 'canonical',
            rel: 'canonical',
            href: `https://debbie.codes/blog/${this.$route.params.slug}`
          }
        ]
      }
    }
  }
</script>

<style lang="postcss" scoped>
  .title {
    font-size: 2.1428571em;
    margin-top: 0;
    margin-bottom: 0.8em;
    line-height: 1.2;
    font-weight: 800;
    margin-left: auto;
    margin-right: auto;
    max-width: 65ch;
  }
</style>

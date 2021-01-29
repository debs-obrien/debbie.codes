<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <AppBreadCrumb title="Featrued Posts" />

    <AppTitle>My featured Posts</AppTitle>
    <AppIntro> Featured blog posts on various websites </AppIntro>
    <div class="mt-12 grid gap-3 mx-auto md:grid-cols-3 md:max-w-none">
      <div v-for="item of items" :key="item.slug">
        <PostsCard :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const items = await $content('featured-posts')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        items
      }
    },
    data() {
      return {
        title: "Welcome to Debbie's featured posts",
        description:
          "Debbie's featured posts that that have been published on various different sites"
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
            href: `https://debbie.codes/resources/${this.$route.params.slug}`
          }
        ]
      }
    }
  }
</script>

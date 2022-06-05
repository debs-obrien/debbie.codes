<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <AppBreadCrumb title="podcasts" />
    <AppTitle>Guest Podcast Interviews</AppTitle>
    <AppIntro>
      Collection of Podcasts where I was interviewed as a Guest
    </AppIntro>
    <div class="mt-12 grid gap-3 mx-auto md:grid-cols-1 md:max-w-none">
      <div
        v-for="podcast of podcasts"
        :key="podcast.slug"
        data-test-id="podcasts"
      >
        <PodCastCard :item="podcast" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const podcasts = await $content('podcasts')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        podcasts
      }
    },
    data() {
      return {
        title: "Welcome to Debbie's podcasts",
        description:
          "Debbie's Podcasts where she has appeard as a guest on various shows"
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

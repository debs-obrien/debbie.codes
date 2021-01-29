<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <AppBreadCrumb title="Guest Live Streams" />

    <AppTitle>Live Streams as a Guest</AppTitle>
    <AppIntro> Live Streams where I have appeared as a guest </AppIntro>

    <div class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-1 lg:max-w-none">
      <div v-for="video of videos" :key="video.slug">
        <VideoCard :item="video" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const videos = await $content('live-streams')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        videos
      }
    },
    data() {
      return {
        title: "Welcome to Debbie's live streams",
        description:
          "Debbie's Live Streams talking aout all things Nuxt and sometimes with various Guests"
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

<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <AppBreadCrumb title="Guest Interviews" />
    <AppTitle>Guest Interviews</AppTitle>
    <AppIntro>
      Recordings of various interviews on different channels
    </AppIntro>
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
      const videos = await $content('interviews')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        videos
      }
    },
    data() {
      return {
        title: "Debbie's interviews on different platforms",
        description:
          "Debbie's interviews talking aout all things Nuxt and coding in general"
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

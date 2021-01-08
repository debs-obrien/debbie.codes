<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />

    <AppTitle>Conference Talks</AppTitle>
    <AppIntro>
      My Conferece Talks from around the world
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
      const videos = await $content('conference-talks')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        videos
      }
    },
    data() {
      return {
        title: "Debbie's videos from conference talks",
        description:
          'Published videos from conferences around the world both in house and virtual'
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

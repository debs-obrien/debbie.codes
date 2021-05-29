<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <AppBreadCrumb title="Conference Talks" />
    <!-- <AppTitle v-editable="story.content">
      {{ story.content.title }}
    </AppTitle>
    <AppIntro v-editable="story.content">
      {{ story.content.subtitle }}
    </AppIntro> -->
    <AppTitle>
      {{ title }}
    </AppTitle>
    <AppIntro>
      {{ description }}
    </AppIntro>
    <div class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-1 lg:max-w-none">
      <!-- <div v-for="video of story.content.body[2].talks" :key="video.slug">
        <VideoCard v-editable="video" :item="video" />
      </div> -->
      <div v-for="video of videos" :key="video.slug">
        <VideoCard :item="video" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content }) {
      // const story = await app.$storyapi
      //   .get(`cdn/stories/home`, {
      //     version: 'draft'
      //   })
      //   .then(res => {
      //     return res.data.story
      //   })
      //   .catch(res => {
      //     if (!res.response) {
      //       context.error({
      //         statusCode: 404,
      //         message: 'Failed to receive content form api'
      //       })
      //     } else {
      //       context.error({
      //         statusCode: res.response.status,
      //         message: res.response.data
      //       })
      //     }
      //   })

      const videos = await $content('conference-talks')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        videos
        // story
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
    // mounted() {
    //   // Use the input event for instant update of content
    //   this.$storybridge.on('input', event => {
    //     if (event.story.id === this.story.id) {
    //       this.story.content = event.story.content
    //     }
    //   })
    //   // Use the bridge to listen the events
    //   this.$storybridge.on(['published', 'change'], event => {
    //     this.$nuxt.$router.go({
    //       path: this.$nuxt.$router.currentRoute,
    //       force: true
    //     })
    //   })
    // }
  }
</script>

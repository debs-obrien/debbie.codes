<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <h1 class="main-heading">
      Open Source projects, demos and modules
    </h1>

    <div class="mt-12 grid gap-3  mx-auto md:grid-cols-1 md:max-w-none">
      <div v-for="repo of repos" :key="repo.slug">
        <VideoCard :item="repo" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const repos = await $content('open-source')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        repos
      }
    },
    data() {
      return {
        title: "Welcome to Debbie's Open Source Projects and Demos",
        description:
          "Debbie's Open Source Projects that she has created and is maintaining"
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

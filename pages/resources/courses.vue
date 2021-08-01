<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <AppBreadCrumb title="Courses" />

    <AppTitle>Courses I have Created</AppTitle>
    <AppIntro>
      Courses that I have created on Various platforms including Vue School and
      Netlify's Jamstack Explorers.
    </AppIntro>

    <div class="mt-12 grid gap-3 mx-auto md:grid-cols-3 md:max-w-none">
      <div v-for="course of courses" :key="course.slug" class="flex flex-col">
        <PostsCard :item="course" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const courses = await $content('courses')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        courses
      }
    },
    data() {
      return {
        title: "Welcome to Debbie's courses",
        description:
          "Debbie's Courses that she has created for various platforms"
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

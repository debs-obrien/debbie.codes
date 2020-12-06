<template>
  <div class="page-wrapper">
    <SocialHead :title="title" :description="description" />
    <h1 class="main-heading">
      Courses I have Created
    </h1>

    <div class="mt-12 grid gap-3  mx-auto md:grid-cols-3 md:max-w-none">
      <div v-for="course of courses" :key="course.slug">
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
            name: 'desctiption',
            content: this.desctiption
          }
        ]
      }
    }
  }
</script>

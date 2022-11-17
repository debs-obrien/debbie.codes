<script setup>
const {
  params: { slug },
} = useRoute()

const courses = await queryContent('courses')
  .where({ published: { $ne: false }, tags: { $contains: slug } })
  .sort({ date: -1 })
  .find()

const title = `Courses on ${slug}`
const description = `Here's a list of all my courses with the ${slug} tag`

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <div class="page-wrapper">
    <AppBreadCrumb title="courses" />
    <AppTitle>{{ title }}</AppTitle>
    <AppIntro>
      {{ description }}
    </AppIntro>
    <Tags section="courses" />
    <CardsList v-if="courses.length" :list="courses" section="courses" />
    <div v-else class="m-auto max-w-4xl text-center mt-8">
      <TagNotFound />
    </div>
  </div>
</template>

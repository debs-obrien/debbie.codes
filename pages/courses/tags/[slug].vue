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
const section = 'courses'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <main>
    <AppTitle>{{ title }}</AppTitle>
    <AppIntro>{{ description }}</AppIntro>
    <Tags :section="section" />
    <CardsList v-if="courses.length" :list="courses" :section="section" />
    <TagsNotFound v-else />
  </main>
</template>

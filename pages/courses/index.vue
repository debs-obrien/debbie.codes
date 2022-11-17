<script setup>
const courses = await queryContent('courses')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'Courses'
const description = 'Collection of courses I have created'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <div class="page-wrapper">
    <AppTitle>{{ title }}</AppTitle>
    <AppIntro>
      {{ description }}
    </AppIntro>
    <Tags section="courses" />
    <CardsList :list="courses" section="courses" />
  </div>
</template>

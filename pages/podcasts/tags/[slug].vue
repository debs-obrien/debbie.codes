<script setup>
const {
  params: { slug },
} = useRoute()

const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false }, tags: { $contains: slug } })
  .sort({ date: -1 })
  .find()

const title = `Podcast Interviews on ${slug}`
const description = `Here's a list of all my podcast interviews with the ${slug} tag`
const section = 'podcasts'

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
    <CardsList v-if="podcasts.length" :list="podcasts" :section="section" />
    <div v-else class="m-auto max-w-4xl text-center mt-8">
      <TagsNotFound />
    </div>
  </main>
</template>

<script setup>
const {
  params: { slug },
} = useRoute()

const getArticles = await queryContent('blog')
  .where({ published: { $ne: false }, tags: { $contains: slug } })
  .sort({ date: -1 })
  .find()

const title = `Blog Posts on ${slug}`
const description = `Here's a list of all my blog posts with the ${slug} tag`
const section = 'blog'

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
    <CardsList v-if="getArticles.length" :list="getArticles" :section="section" />
    <div v-else class="m-auto max-w-4xl text-center mt-8">
      <TagsNotFound />
    </div>
  </main>
</template>

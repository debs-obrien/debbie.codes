<script setup lang="ts">
import type { BlogPost, Sections } from '~/types'

const { tag } = useRoute().params

const { data: articles } = await useAsyncData('articles',
  () => queryCollection('blog')
    .where('tags', 'LIKE', `%${tag}%`)
    .order('date', 'DESC')
    .all(),
)

const filteredArticles = ref<BlogPost[]>([])

const title: string = `Blog Posts tagged with ${tag}`
const description: string = `Here\'s a list of all my blog posts tagged with ${tag}`
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <BlogSearch
      :articles="articles || []"
      v-model:filteredArticles="filteredArticles"
    />
    <ItemList v-if="filteredArticles.length > 0" :list="filteredArticles" :section="section" />
    <div v-else class="text-center py-8">
      <p class="text-gray-600">No articles found matching your search.</p>
    </div>
  </PageLayout>
</template> 
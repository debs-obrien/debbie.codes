<script setup lang="ts">
import type { Sections } from '~/types'

const { tag } = useRoute().params

// Normalize the URL tag parameter
const normalizedUrlTag = (tag as string).toLowerCase().replace(/\s+/g, '-')

const { data: articles } = await useAsyncData('articles',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

// Filter articles manually to handle normalized tags
const taggedArticles = computed(() => {
  if (!articles.value) return []
  
  return articles.value.filter((article: any) => {
    if (!article.tags) return false
    
    return article.tags.some((articleTag: string) => {
      const normalizedArticleTag = articleTag.trim().toLowerCase().replace(/\s+/g, '-')
      return normalizedArticleTag === normalizedUrlTag
    })
  })
})

const filteredArticles = ref<any[]>([])

// Display the original tag format for the title
const displayTag = (tag as string).replace(/-/g, ' ')

const title: string = `Blog Posts tagged with ${displayTag}`
const description: string = `Here's a list of all my blog posts tagged with ${displayTag}`
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
      :defaultArticles="taggedArticles"
      v-model:filteredArticles="filteredArticles"
    />
    <ItemList v-if="filteredArticles.length > 0" :list="filteredArticles" :section="section" />
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No articles found matching your search.</p>
    </div>
  </PageLayout>
</template> 
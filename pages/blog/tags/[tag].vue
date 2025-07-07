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

// Get popular tags for browse components
const popularTags = computed(() => {
  if (!articles.value) return []
  
  const tagCounts = new Map<string, number>()
  const seenTags = new Set<string>()
  
  articles.value.forEach((post: any) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        // Normalize tag: trim, lowercase for comparison, remove extra spaces
        const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, '-')
        if (normalizedTag && !seenTags.has(normalizedTag)) {
          seenTags.add(normalizedTag)
          tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1)
        } else if (normalizedTag && seenTags.has(normalizedTag)) {
          // Increment count for existing normalized tag
          tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1)
        }
      })
    }
  })
  
  // Convert to array and sort by count, then take top 8
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

// Get years for archive navigation with post counts
const postYears = computed(() => {
  if (!articles.value) return []
  
  const yearCounts = new Map<string, number>()
  articles.value.forEach((post: any) => {
    if (post.date) {
      const postYear = new Date(post.date).getFullYear().toString()
      yearCounts.set(postYear, (yearCounts.get(postYear) || 0) + 1)
    }
  })
  
  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year))
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
    
    <!-- Browse Components for consistency -->
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <BlogBrowseComponents 
        :popularTags="popularTags"
        :postYears="postYears"
      />
    </div>
  </PageLayout>
</template> 
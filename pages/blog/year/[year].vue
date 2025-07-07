<script setup lang="ts">
import type { Sections } from '~/types'

const route = useRoute()
const year = route.params.year as string

// Validate year format
if (!/^\d{4}$/.test(year)) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid year format' })
}

// Fetch all posts and filter by year on the client side
const { data: allArticles } = await useAsyncData(`blog-year-${year}`,
  () => queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

// Filter articles for the specific year
const articles = computed(() => {
  if (!allArticles.value) return []
  
  return allArticles.value.filter((article: any) => {
    if (!article.date) return false
    const articleYear = new Date(article.date).getFullYear().toString()
    return articleYear === year
  })
})

// Get popular tags for browse components
const popularTags = computed(() => {
  if (!allArticles.value) return []
  
  const tagCounts = new Map<string, { count: number; displayName: string }>()
  
  // Define preferred casing for common tags
  const preferredCasing: Record<string, string> = {
    'mcp': 'MCP',
    'ai': 'AI',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'vue': 'Vue',
    'nuxt': 'Nuxt',
    'react': 'React',
    'jamstack': 'JAMstack',
    'devrel': 'Dev Rel',
    'dev-rel': 'Dev Rel',
    'github': 'GitHub',
    'githubcopilot': 'GitHub Copilot',
    'vscode': 'VS Code',
    'vs-code': 'VS Code',
    'webdev': 'WebDev'
  }
  
  allArticles.value.forEach((post: any) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        // Normalize tag: trim, lowercase for comparison, remove extra spaces
        const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, '-')
        if (normalizedTag) {
          const displayName = preferredCasing[normalizedTag] || tag.trim()
          
          if (tagCounts.has(normalizedTag)) {
            tagCounts.get(normalizedTag)!.count += 1
          } else {
            tagCounts.set(normalizedTag, { count: 1, displayName })
          }
        }
      })
    }
  })
  
  // Convert to array and sort by count, then take top 8
  return Array.from(tagCounts.entries())
    .map(([tag, { count, displayName }]) => ({ tag, count, displayName }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

// Get years for archive navigation with post counts
const postYears = computed(() => {
  if (!allArticles.value) return []
  
  const yearCounts = new Map<string, number>()
  allArticles.value.forEach((post: any) => {
    if (post.date) {
      const postYear = new Date(post.date).getFullYear().toString()
      yearCounts.set(postYear, (yearCounts.get(postYear) || 0) + 1)
    }
  })
  
  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

// Debug year filtering - use watchEffect to run when data is available
if (process.dev) {
  watchEffect(() => {
    console.log(`Articles for year ${year}:`, articles.value?.length)
    if (articles.value && articles.value.length > 0) {
      console.log('First few articles:', articles.value.slice(0, 3).map(a => ({ title: a.title, date: a.date })))
    }
    if (allArticles.value) {
      console.log('Total articles:', allArticles.value.length)
      const yearCounts: {[key: string]: number} = {}
      allArticles.value.forEach((article: any) => {
        if (article.date) {
          const articleYear = new Date(article.date).getFullYear().toString()
          yearCounts[articleYear] = (yearCounts[articleYear] || 0) + 1
        }
      })
      console.log('Articles by year:', yearCounts)
    }
  })
}

const title: string = `Blog Posts from ${year}`
const description: string = `Browse all blog posts from ${year}`
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Year summary -->
    <div class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
        Posts from {{ year }}
      </h2>
      <p class="text-blue-700 dark:text-blue-300">
        {{ articles?.length || 0 }} post{{ (articles?.length || 0) !== 1 ? 's' : '' }} published in {{ year }}
      </p>
    </div>
    
    <!-- Posts List -->
    <ItemList 
      v-if="articles && articles.length > 0" 
      :list="articles" 
      :section="section" 
      :showImages="false" 
    />
    
    <!-- No Results -->
    <div v-else-if="allArticles && articles?.length === 0" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No articles found for {{ year }}.</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
        Try a different year or go back to the main blog.
      </p>
    </div>
    
    <!-- Loading -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">Loading articles...</p>
    </div>
    
    <!-- Back to blog navigation -->
    <div class="mt-8 text-center">
      <NuxtLink 
        to="/blog" 
        class="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </NuxtLink>
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
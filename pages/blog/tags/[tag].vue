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
  
  const tagCounts = new Map<string, { count: number; displayName: string }>()
  
  // Define preferred casing for common tags
  const preferredCasing: Record<string, string> = {
    'mcp': 'MCP',
    'ai': 'AI',
    'playwright': 'Playwright',
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
  
  articles.value.forEach((post: any) => {
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
  
  // Define custom sort order for featured tags
  const customOrder = ['ai', 'mcp', 'playwright', 'testing', 'react', 'performance', 'personal']

  // Convert to array
  const allTags = Array.from(tagCounts.entries())
    .map(([tag, { count, displayName }]) => ({ tag, count, displayName }))

  // Sort with custom order first, then by count
  return allTags.sort((a, b) => {
    const aIndex = customOrder.indexOf(a.tag)
    const bIndex = customOrder.indexOf(b.tag)

    // If both are in custom order, sort by custom order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    // If only a is in custom order, a comes first
    if (aIndex !== -1) return -1
    // If only b is in custom order, b comes first
    if (bIndex !== -1) return 1
    // Otherwise sort by count
    return b.count - a.count
  }).slice(0, 8)
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
const isSearchActive = ref(false)

// Get proper display name for the tag using preferredCasing
const preferredCasing: Record<string, string> = {
  'mcp': 'MCP',
  'ai': 'AI',
  'playwright': 'Playwright',
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
  'webdev': 'WebDev',
  'testing': 'Testing',
  'performance': 'Performance',
  'personal': 'Personal'
}

const displayTag = preferredCasing[normalizedUrlTag] || (tag as string).replace(/-/g, ' ')

const title: string = `${displayTag} Blog Posts`
const description: string = ''
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
      :default-articles="taggedArticles"
      @update:filtered-articles="filteredArticles = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Year -->
    <BlogBrowseComponents
      :popular-tags="popularTags"
      :post-years="postYears"
    />

    <!-- Posts List -->
    <FeaturedSection
      v-if="filteredArticles.length > 0"
      :items="filteredArticles"
      :section="section"
    />

    <!-- No Results -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No articles found{{ isSearchActive ? ' matching your search' : ` tagged with ${displayTag}` }}.</p>
    </div>
  </PageLayout>
</template> 
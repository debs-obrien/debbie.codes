<script setup lang="ts">
import type { Sections } from '~/types'

const route = useRoute()
const page = parseInt(route.params.number as string) || 1
const postsPerPage = 12

// Calculate offset
const offset = (page - 1) * postsPerPage

// Debug pagination
if (process.dev) {
  console.log(`Pagination Debug: page=${page}, postsPerPage=${postsPerPage}, offset=${offset}`)
}

// Fetch paginated posts
const { data: posts } = await useAsyncData(`blog-page-${page}`,
  () => queryCollection('blog')
    .order('date', 'DESC')
    .limit(postsPerPage)
    .skip(offset)
    .all(),
)

// Debug post results
if (process.dev) {
  console.log(`Posts fetched: ${posts.value?.length || 0} posts`)
}

// Get total count for pagination
const { data: totalCount } = await useAsyncData('blog-total-count',
  () => queryCollection('blog')
    .count(),
)

// Fetch all posts for search functionality
const { data: allPosts } = await useAsyncData('all-blog-posts',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

// Debug all posts
if (process.dev) {
  console.log(`All posts fetched: ${allPosts.value?.length || 0} posts`)
}

const filteredArticles = ref<any[]>(posts.value || [])
const isSearchActive = ref(false)

const totalPages = computed(() => {
  if (!totalCount.value) return 1
  return Math.ceil(totalCount.value / postsPerPage)
})

// Get popular tags for browse components
const popularTags = computed(() => {
  if (!allPosts.value) return []

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

  allPosts.value.forEach((post: any) => {
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

// Get years for archive navigation
const postYears = computed(() => {
  if (!allPosts.value) return []

  const yearCounts = new Map<string, number>()
  allPosts.value.forEach((post: any) => {
    if (post.date) {
      const postYear = new Date(post.date).getFullYear().toString()
      yearCounts.set(postYear, (yearCounts.get(postYear) || 0) + 1)
    }
  })

  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

// Handle case where page number is invalid
if (page < 1 || (totalCount.value && page > Math.ceil(totalCount.value / postsPerPage))) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const title: string = page === 1 ? 'All Blog Posts' : `Blog Posts - Page ${page}`
const description: string = page === 1 
  ? 'Browse all blog posts about web development, testing, performance, and developer experience'
  : `Browse blog posts - Page ${page} of ${totalPages.value}`
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Search Component -->
    <BlogSearch
      :articles="allPosts || []"
      :default-articles="posts || []"
      @update:filtered-articles="filteredArticles = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Year -->
    <BlogBrowseComponents
      :popularTags="popularTags"
      :postYears="postYears"
    />

    <!-- Posts List -->
    <FeaturedSection
      v-if="filteredArticles.length > 0"
      :items="filteredArticles"
      :section="section"
    />

    <!-- No Results -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No articles found matching your search.</p>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="posts && posts.length > 0 && !isSearchActive"
      :current-page="page"
      :total-pages="totalPages"
      base-url="/blog"
    />
  </PageLayout>
</template>
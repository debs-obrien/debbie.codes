<script setup lang="ts">
import type { Sections } from '~/types'

const filteredBlogPosts = ref<any[]>([])
const isSearchActive = ref(false)

// Fetch recent blog posts (latest 8)
const { data: recentPosts } = await useAsyncData('recent-blog-posts', () => queryCollection('blog')
  .order('date', 'DESC')
  .limit(8)
  .all())

// Get all unique tags with counts for "Browse by Topic" section and years
const { data: allPosts } = await useAsyncData('all-blog-posts-for-tags', () => queryCollection('blog')
  .all())

const popularTags = computed(() => {
  if (!allPosts.value)
    return []

  const tagCounts = new Map<string, { count: number, displayName: string }>()

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
    'webdev': 'WebDev',
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
          }
          else {
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
  if (!allPosts.value)
    return []

  const yearCounts = new Map<string, number>()
  allPosts.value.forEach((post: any) => {
    if (post.date) {
      const year = new Date(post.date).getFullYear().toString()
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1)
    }
  })

  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

const title: string = 'Blog'
const description: string = 'Thoughts on web development, testing, performance, and developer experience'
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <BlogSearch
      :articles="allPosts || []"
      :default-articles="recentPosts || []"
      @update:filtered-articles="filteredBlogPosts = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Year -->
    <section v-if="postYears.length > 0 || popularTags.length > 0" class="mb-12 max-w-4xl mx-auto">
      <!-- Tags -->
      <div v-if="popularTags.length > 0" class="text-center mb-6">
        <NuxtLink
          v-for="({ tag, displayName }, index) in popularTags"
          :key="tag"
          :to="`/blog/tags/${tag}`"
          :class="[
            'hover:opacity-70 transition-opacity mx-2',
            ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500', 'text-pink-500', 'text-cyan-500'][index % 6]
          ]"
        >
          #{{ displayName }}
        </NuxtLink>
      </div>

      <!-- Years -->
      <div v-if="postYears.length > 0" class="text-center">
        <NuxtLink
          v-for="({ year }, index) in postYears"
          :key="year"
          :to="`/blog/year/${year}`"
          :class="[
            'text-lg font-semibold hover:opacity-70 transition-opacity mx-2',
            ['text-blue-500', 'text-orange-500', 'text-green-500', 'text-purple-500', 'text-pink-500', 'text-cyan-500'][index % 6]
          ]"
        >
          {{ year }}
        </NuxtLink>
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section class="mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Recent Posts
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredBlogPosts.length }})
      </h2>
      <FeaturedSection v-if="!isSearchActive" :items="recentPosts || []" :section="section" />
      <FeaturedSection v-else :items="filteredBlogPosts" :section="section" />
      <div v-if="!isSearchActive" class="text-center mt-8">
        <NuxtLink
          to="/blog/page/1"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          View All Posts
        </NuxtLink>
      </div>
    </section>
  </PageLayout>
</template>

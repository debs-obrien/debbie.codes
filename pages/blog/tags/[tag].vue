<script setup lang="ts">
import type { Sections } from '~/types'

const { tag } = useRoute().params

// Normalize the URL tag parameter
const normalizedUrlTag = (tag as string).toLowerCase().replace(/\s+/g, '-')

const { data: articles } = await useAsyncData('articles', () => queryCollection('blog')
  .order('date', 'DESC')
  .all())

// Filter articles manually to handle normalized tags
const taggedArticles = computed(() => {
  if (!articles.value)
    return []

  return articles.value.filter((article: any) => {
    if (!article.tags)
      return false

    return article.tags.some((articleTag: string) => {
      const normalizedArticleTag = articleTag.trim().toLowerCase().replace(/\s+/g, '-')
      return normalizedArticleTag === normalizedUrlTag
    })
  })
})

// Get popular tags for browse components
const popularTags = computed(() => {
  if (!articles.value)
    return []

  const tagCounts = new Map<string, { count: number, displayName: string }>()

  articles.value.forEach((post: any) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        // Normalize tag: trim, lowercase for comparison, remove extra spaces
        const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, '-')
        if (normalizedTag) {
          const displayName = getTagDisplayName(normalizedTag)

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
    if (aIndex !== -1)
      return -1
    // If only b is in custom order, b comes first
    if (bIndex !== -1)
      return 1
    // Otherwise sort by count
    return b.count - a.count
  }).slice(0, 8)
})

// Get years for archive navigation with post counts
const postYears = computed(() => {
  if (!articles.value)
    return []

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

const recentYears = computed(() => postYears.value.slice(0, 4))

const filteredArticles = ref<any[]>([])
const isSearchActive = ref(false)

// Get proper display name for the tag using shared utility
const displayTag = getTagDisplayName(normalizedUrlTag)

const title: string = `${displayTag} Blog Posts`
const description: string = `Posts tagged ${displayTag} — testing, AI, Playwright, and the web.`
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

    <!-- Browse by Topic and Year - Compact Design -->
    <section v-if="recentYears.length > 0 || popularTags.length > 0" class="animated-section mb-8 max-w-4xl mx-auto">
      <!-- Tags Row -->
      <div v-if="popularTags.length > 0" class="flex flex-wrap gap-3 justify-center items-center mb-4">
        <TagChip
          v-for="{ tag: tagSlug, displayName } in popularTags"
          :key="tagSlug"
          :to="`/blog/tags/${tagSlug}`"
          :label="displayName"
          hash
          :active="tagSlug === normalizedUrlTag"
        />
      </div>

      <!-- Years Row — recent years only -->
      <div v-if="recentYears.length > 0" class="flex flex-wrap gap-3 justify-center items-center">
        <TagChip
          v-for="{ year } in recentYears"
          :key="year"
          :to="`/blog/year/${year}`"
          :label="year"
        />
        <NuxtLink
          to="/blog/page/1"
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
        >
          Archive
        </NuxtLink>
      </div>
    </section>

    <!-- Posts List -->
    <section class="animated-section">
      <FeaturedSection
        v-if="filteredArticles.length > 0"
        :items="filteredArticles"
        :section="section"
      />

      <!-- No Results -->
      <div v-else class="text-center py-8">
        <p class="text-gray-600 dark:text-gray-400">
          No articles found{{ isSearchActive ? ' matching your search' : ` tagged with ${displayTag}` }}.
        </p>
      </div>
    </section>
  </PageLayout>
</template>

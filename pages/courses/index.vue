<script setup lang="ts">
import type { Sections } from '~/types'

const filteredCourses = ref<any[]>([])
const isSearchActive = ref(false)

// Get all courses to extract real tags
const { data: allCourses } = await useAsyncData('all-courses-for-tags', () => queryCollection('courses')
  .all())

const courseTags = computed(() => {
  if (!allCourses.value)
    return []

  const tagCounts = new Map<string, number>()

  allCourses.value.forEach((course: any) => {
    if (course.tags) {
      course.tags.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    }
  })

  // Sort by count and return top tags
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag)
})

const title: string = 'Courses'
const description: string = ''
const section: Sections = 'courses'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Search Bar -->
    <BlogSearch
      :articles="allCourses || []"
      :default-articles="allCourses || []"
      @update:filtered-articles="filteredCourses = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Tag Section -->
    <section v-if="courseTags.length > 0" class="animated-section mb-8 max-w-4xl mx-auto">
      <div class="flex flex-wrap gap-3 justify-center items-center">
        <TagChip
          v-for="tag in courseTags"
          :key="tag"
          :to="`/courses/tags/${tag}`"
          :label="tag.replace('-', ' ')"
          hash
        />
      </div>
    </section>

    <!-- Courses Grid Section -->
    <section class="animated-section mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        All Courses
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredCourses.length }})
      </h2>
      <ItemList v-if="filteredCourses.length > 0" :list="filteredCourses" :section="section" />
      <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
        No courses found
      </div>
    </section>
  </PageLayout>
</template>

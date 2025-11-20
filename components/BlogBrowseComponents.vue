<script setup lang="ts">
// Reusable component for Browse by Topic and Browse by Year sections
// Used across blog homepage, year pages, and topic pages for consistency

// Props for the component
interface Props {
  popularTags?: Array<{ tag: string, count: number, displayName?: string }>
  postYears?: Array<{ year: string, count: number }>
  showTags?: boolean
  showYears?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  showTags: true,
  showYears: true,
})
</script>

<template>
  <section v-if="(showYears && postYears && postYears.length > 0) || (showTags && popularTags && popularTags.length > 0)" class="mb-12 max-w-4xl mx-auto">
    <!-- Tags -->
    <div v-if="showTags && popularTags && popularTags.length > 0" class="text-center mb-6">
      <NuxtLink
        v-for="({ tag, displayName }, index) in popularTags"
        :key="tag"
        :to="`/blog/tags/${tag}`"
        class="hover:opacity-70 transition-opacity mx-2" :class="[
          ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500', 'text-pink-500', 'text-cyan-500'][index % 6],
        ]"
      >
        #{{ displayName || tag.replace('-', ' ') }}
      </NuxtLink>
    </div>

    <!-- Years -->
    <div v-if="showYears && postYears && postYears.length > 0" class="text-center">
      <NuxtLink
        v-for="({ year }, index) in postYears"
        :key="year"
        :to="`/blog/year/${year}`"
        class="text-lg font-semibold hover:opacity-70 transition-opacity mx-2" :class="[
          ['text-blue-500', 'text-orange-500', 'text-green-500', 'text-purple-500', 'text-pink-500', 'text-cyan-500'][index % 6],
        ]"
      >
        {{ year }}
      </NuxtLink>
    </div>
  </section>
</template>

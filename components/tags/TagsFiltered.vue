// filepath: /Users/debbieobrien/workspace/debbie.codes/components/tags/TagsFiltered.vue
<script setup lang="ts">
import type { Sections } from '~/types'

interface Props {
  section: Sections
}

const props = defineProps<Props>()

function flatten(tags: Array<any>, key = 'tags') {
  const _tags = tags
    .map((tag) => {
      let _tag = tag
      if (tag.tags) {
        const flattened = flatten(tag[key])
        _tag = flattened
      }
      return _tag
    })
    .flat(1)

  return _tags
}

const { data } = await useAsyncData(`tags-${props.section}`, () => queryCollection(props.section)
  .select('tags')
  .all())

// Count occurrences of each tag with normalization
const tagCounts = new Map<string, number>()
const tagDisplayNames = new Map<string, string>()

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
  'webdev': 'WebDev',
}

if (Array.isArray(data.value)) {
  const allTags = flatten(data.value, 'tags')
  allTags.forEach((tag) => {
    // Normalize tag: trim, lowercase for comparison, remove extra spaces
    const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, '-')
    if (normalizedTag) {
      const displayName = preferredCasing[normalizedTag] || tag.trim()
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1)
      if (!tagDisplayNames.has(normalizedTag)) {
        tagDisplayNames.set(normalizedTag, displayName)
      }
    }
  })
}

// Filter tags that have 4 or more items and sort them
const articleTags = Array.from(tagCounts.entries())
  .filter(([_, count]) => props.section === 'courses' || 'videos' || 'podcasts' || count >= 4)
  .map(([tag]) => tag)
const sortedArticleTags = articleTags.sort()
</script>

<template>
  <ul
    aria-label="topics" class="max-w-4xl flex justify-left md:justify-center items-center gap-2 my-4 mx-0 md:mx-auto border border-transparent rounded-lg overflow-x-scroll md:overflow-visible flex-nowrap md:flex-wrap font-normal md:text-sm sm:text-xl text-white uppercase"
  >
    <li class="flex gap-2 justify-center flex-nowrap">
      <NuxtLink
        :to="`/${section}`"
        class="px-2 py-0.5 bg-slate-600 rounded-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 whitespace-nowrap"
      >
        All
      </NuxtLink>
    </li>
    <li
      v-for="(tag, i) in sortedArticleTags"
      :key="tag + i" class="flex gap-2 justify-center flex-nowrap "
    >
      <NuxtLink
        :to="`/${section}/tags/${tag}`"
        class="px-2 py-0.5 bg-slate-600 rounded-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 whitespace-nowrap"
      >
        {{ tagDisplayNames.get(tag) || replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.router-link-exact-active {
  background-color: #3b82f6; /* Tailwind's bg-blue-500 */
}
</style>

<script setup lang="ts">
import { NavLinks } from '~/utils/navigation'

const emit = defineEmits<{
  (e: 'navigate'): void
}>()

const route = useRoute()

function handleClick() {
  emit('navigate')
}

/** Podcasts stays active on the Coffee with Debbie show page (sibling route). */
function isPodcastsSection(path: string) {
  return path === '/podcasts'
    || path.startsWith('/podcasts/')
    || path === '/coffee-with-debbie'
    || path.startsWith('/coffee-with-debbie/')
}

function isNavActive(url: string) {
  const path = route.path.replace(/\/$/, '') || '/'
  if (url === '/podcasts')
    return isPodcastsSection(path)
  if (url === '/')
    return path === '/'
  return path === url || path.startsWith(`${url}/`)
}
</script>

<template>
  <nav>
    <ul class="block lg:flex">
      <li
        v-for="(nav, index) in NavLinks"
        :key="index"
        class="pb-8 lg:pb-0 pr-6 lg:pr-3.5 text-2xl lg:text-base"
      >
        <nuxt-link
          :to="nav.url"
          class="hover:no-underline"
          :class="{ 'text-[#fd213b]': isNavActive(nav.url) }"
          :aria-current="isNavActive(nav.url) ? 'page' : undefined"
          @click="handleClick"
        >
          {{ nav.link }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

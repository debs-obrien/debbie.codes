<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  title?: string
  description?: string
  section?: Sections
}>()
</script>

<template>
  <main class="px-4 sm:px-6">
    <header v-if="title || description">
      <AppTitle v-if="title">{{ title }}</AppTitle>
      <AppIntro v-if="description">{{ description }}</AppIntro>
      <Tags v-if="section" :section="section" />
    </header>
    <slot />
  </main>
</template> 
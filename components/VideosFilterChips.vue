<script setup lang="ts">
const route = useRoute()

const chips = videoFilterChips

const isActive = (to: string, slug: string | null) => {
  if (slug === null)
    return route.path === '/videos' || route.path === '/videos/'
  return route.path.includes(`/videos/tags/${slug}`)
}
</script>

<template>
  <section
    class="animated-section mb-8 max-w-4xl mx-auto"
    aria-label="Filter videos by topic"
  >
    <div class="flex flex-wrap gap-3 justify-center items-center">
      <TagChip
        v-for="chip in chips"
        :key="chip.label"
        :to="chip.to"
        :label="chip.label"
        :active="isActive(chip.to, chip.slug)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
export type HireMePart = string | { text: string, href: string }

const props = defineProps<{
  content: string | HireMePart[]
}>()

const parts = computed(() =>
  typeof props.content === 'string' ? [props.content] : props.content,
)
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <a
      v-if="typeof part !== 'string'"
      :href="part.href"
      rel="noopener"
      class="text-primary font-medium hover:underline"
    >{{ part.text }}</a>
    <template v-else>
      {{ part }}
    </template>
  </template>
</template>

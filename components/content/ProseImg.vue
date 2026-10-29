<script setup lang="ts">
import { isAllowedNetlifyRemoteSrc } from '~/utils/remote-images'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
}>(), {
  alt: '',
  loading: 'lazy',
})

const isLocal = computed(() => {
  const src = props.src || ''
  return src.startsWith('/') || src.startsWith('./')
})

const useNuxt = computed(() => {
  const src = props.src || ''
  if (!src)
    return false
  return isLocal.value || isAllowedNetlifyRemoteSrc(src)
})

const imgWidth = computed(() => props.width ? Number(props.width) : undefined)
const imgHeight = computed(() => props.height ? Number(props.height) : undefined)
</script>

<template>
  <NuxtImg
    v-if="useNuxt && src"
    :src="src"
    :alt="alt"
    :width="imgWidth"
    :height="imgHeight"
    sizes="xs:100vw lg:820px"
    densities="x1 x2"
    :loading="loading"
    decoding="async"
    :fetchpriority="loading === 'eager' ? (fetchpriority || 'high') : undefined"
    format="webp"
    class="h-auto max-w-full"
  />
  <img
    v-else-if="src"
    :src="src"
    :alt="alt"
    :width="imgWidth"
    :height="imgHeight"
    loading="lazy"
    decoding="async"
    class="h-auto max-w-full"
  >
</template>

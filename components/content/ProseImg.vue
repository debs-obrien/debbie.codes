<script setup lang="ts">
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

const isAllowedExternal = computed(() => {
  const src = props.src || ''
  try {
    const host = new URL(src, 'https://debbie.codes').hostname
    return [
      'images.unsplash.com',
      'i.ytimg.com',
      'img.youtube.com',
      'dev-to-uploads.s3.amazonaws.com',
      'raw.githubusercontent.com',
      'theaiplatform.app',
    ].includes(host)
  }
  catch {
    return false
  }
})

const useNuxt = computed(() => isLocal.value || isAllowedExternal.value)

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
    sizes="100vw lg:820px"
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

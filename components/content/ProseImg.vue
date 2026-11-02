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

/**
 * First prose image is eager/high; the rest stay lazy.
 * Do NOT use useState for the counter — it serializes the final SSR count into
 * the payload, so hydration starts nonzero and no image is treated as first.
 * Keep a non-serialized per-path counter on ssrContext (server) / nuxtApp (client),
 * reset when the path changes so revisit/navigation starts at 0 again.
 */
interface ProseImgStore { next: number }

function nextProseImgIndex(path: string): number {
  const nuxtApp = useNuxtApp() as any
  if (import.meta.server) {
    const ctx = (nuxtApp.ssrContext || {}) as Record<string, any>
    ctx._proseImgStores ||= Object.create(null) as Record<string, ProseImgStore>
    ctx._proseImgStores[path] ||= { next: 0 }
    return ctx._proseImgStores[path].next++
  }
  nuxtApp._proseImgStores ||= Object.create(null) as Record<string, ProseImgStore>
  if (nuxtApp._proseImgPath !== path) {
    nuxtApp._proseImgPath = path
    nuxtApp._proseImgStores[path] = { next: 0 }
  }
  nuxtApp._proseImgStores[path] ||= { next: 0 }
  return nuxtApp._proseImgStores[path].next++
}

const route = useRoute()
const isFirst = nextProseImgIndex(route.path) === 0

const resolvedLoading = computed(() => (isFirst ? 'eager' : props.loading))
const resolvedFetchPriority = computed(() => {
  if (isFirst)
    return props.fetchpriority || 'high'
  return props.fetchpriority
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
    :loading="resolvedLoading"
    decoding="async"
    :fetchpriority="resolvedLoading === 'eager' ? resolvedFetchPriority : undefined"
    format="webp"
    class="h-auto max-w-full"
  />
  <img
    v-else-if="src"
    :src="src"
    :alt="alt"
    :width="imgWidth"
    :height="imgHeight"
    :loading="resolvedLoading"
    decoding="async"
    :fetchpriority="resolvedLoading === 'eager' ? resolvedFetchPriority : undefined"
    class="h-auto max-w-full"
  >
</template>

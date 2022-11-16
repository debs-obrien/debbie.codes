<script setup lang="ts">
import type { BlogPost, Podcast, Course, Section } from '~/types';
defineProps<{
  list: Array<BlogPost | Podcast | Course>;
  section: Section;
}>();
</script>

<template>
  <section class="p-4 py-6 m-auto max-w-4xl">
    <ul class="article-list">
      <li v-for="item in list" :key="item._path" class="py-4 border-b">
        <div class="grid grid-cols-4 gap-6 auto-cols-[minmax(0,_3fr)]">
          <div class="h-full w-full object-cover">
            <NuxtLink
              :to="item.url || item._path"
              :target="item.url ? '_blank' : '_self'"
            >
              <NuxtImg
                :provider="item.provider"
                :src="item.image"
                :alt="item.title"
                width="272"
                height="272"
                fit="thumb"
                format="webp"
                class="scale-90 transition-all duration-400 hover:scale-100 rounded"
              />
            </NuxtLink>
          </div>

          <div class="col-span-3">
            <NuxtLink
              :to="item.url || item._path"
              :target="item.url ? '_blank' : '_self'"
            >
              <h2
                class="mb-4 text-xl font-semibold text-gray-800 hover:underline dark:text-white md:text-3xl"
              >
                {{ item.title }}
              </h2>
              <p
                class="mt-3 text-lg text-gray-500 dark:text-gray-300 md:text-sm"
              >
                {{ item.description }}
              </p>
            </NuxtLink>

            <ul
              v-if="item.tags"
              v-for="(tag, n) in item.tags"
              :key="n"
              class="inline-block"
            >
              <li class="text-sm text-blue-500 uppercase flex px-2">
                <NuxtLink
                  :to="`/${section}/tags/${tag}`"
                  class="hover:underline"
                >
                  {{ tag }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

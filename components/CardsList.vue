<script setup lang="ts">
interface Props {
  list: Array<any>;
  section: Object;
}

const props = defineProps<Props>();
</script>
<template>
  <section class="p-4 py-6 m-auto max-w-4xl">
    <ul class="article-list">
      <li v-for="item in list" :key="item._path" class="py-4 border-b">
        <div class="grid grid-cols-4 gap-6 auto-cols-[minmax(0,_3fr)]">
          <div class="h-full w-full object-cover">
            <a v-if="item.url" :href="item.url" target="_blank" rel="nofollow">
              <NuxtImg
                :provider="item.provider"
                :src="item.image"
                :alt="item.title"
                width="272"
                height="272"
                fit="thumb"
                format="webp"
                class="rounded"
              />
            </a>
            <NuxtLink v-else :to="item._path">
              <NuxtImg
                :provider="item.provider"
                :src="item.image"
                :alt="item.title"
                width="272"
                height="272"
                fit="thumb"
                format="webp"
                class="rounded"
              />
            </NuxtLink>
          </div>

          <div class="col-span-3">
            <a v-if="item.url" :href="item.url" target="_blank" rel="nofollow">
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
            </a>
            <NuxtLink v-else :to="item._path">
              <h2
                class="mb-4 text-xl font-semibold text-gray-800 hover:underline dark:text-white md:text-3xl"
              >
                {{ item.title }}
              </h2>
              <p
                class="mt-3 text-lg text-gray-500 dark:text-gray-300 md:text-sm"
              >
                {{ item.description }}
              </p></NuxtLink
            >

            <ul
              v-if="item.tags"
              v-for="(tag, n) in item.tags"
              class="inline-block"
            >
              <li class="text-sm text-blue-500 uppercase flex px-2">
                <NuxtLink :to="`/${section}/tags/${tag}`">
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

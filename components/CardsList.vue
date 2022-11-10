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
      <li v-for="item in list" :key="item._path" class="article-item">
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
              <h2 class="text-2xl font-semibold">{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </a>
            <NuxtLink v-else :to="item._path">
              <h2 class="text-2xl font-semibold">{{ item.title }}</h2>
              <p>{{ item.description }}</p></NuxtLink
            >
            <ul class="article-tags" v-if="item.tags">
              <li class="tag !py-0.5" v-for="(tag, n) in item.tags" :key="n">
                <NuxtLink :to="`/${section}/tags/${tag}`" class="font-semibold">
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

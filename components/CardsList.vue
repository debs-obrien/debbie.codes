<script setup lang="ts">
interface Props {
  list: Array<any>;
}

const props = defineProps<Props>();
</script>
<template>
  <section class="p-4 py-6 m-auto max-w-4xl">
    <Tags />

    <ul class="article-list">
      <li v-for="item in list" :key="item._path" class="article-item">
        <NuxtLink :to="item._path">
          <div class="grid grid-cols-3 gap-6 auto-cols-[minmax(0,_2fr)]">
            <div class="h-full w-full object-cover">
              <NuxtImg
                :provider="item.provider"
                :src="item.image"
                :alt="item.title"
                preset="blog"
                width="auto"
                height="auto"
                sizes="sm:355px md:320px lg:480px"
                class="rounded-lg max-h-[16rem]"
              />
            </div>
            <div class="col-span-2">
              <h2 class="text-2xl font-semibold">{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <ul class="article-tags" v-if="item.tags">
                <li class="tag !py-0.5" v-for="(tag, n) in item.tags" :key="n">
                  {{ tag }}
                </li>
              </ul>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

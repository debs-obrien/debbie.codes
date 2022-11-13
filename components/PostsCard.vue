<script>
export default {
  props: {
    description: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en', options);
    }
  }
};
</script>
<template>
  <div class="flex flex-col overflow-hidden flex-1 max-width h-full">
    <section class="text-gray-600 body-font">
      <div
        class="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden"
      >
        <div v-if="item.url">
          <a :href="item.url" class="block" rel="nofollow" target="_blank">
            <NuxtImg
              :provider="item.provider"
              :src="item.image"
              :alt="item.title"
              :loading="item.loading ? item.loading : 'lazy'"
              preset="blog"
              width="444"
              height="256"
              sizes="sm:355px md:320px lg:480px"
              class="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
            />
          </a>
        </div>
        <div v-else class="image">
          <NuxtLink :to="item._path">
            <NuxtImg
              :provider="item.provider"
              :src="item.image"
              :alt="item.title"
              :loading="item.loading ? item.loading : 'lazy'"
              width="444"
              height="256"
              sizes="sm:355px md:320px lg:480px"
              class="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
            />
          </NuxtLink>
        </div>
        <div class="p-6">
          <a v-if="item.url" :href="item.url" class="block">
            <p
              class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
            >
              {{ formatDate(item.date) }}
            </p>
            <h4 class="title-font text-lg font-medium text-gray-600 mb-3">
              {{ item.title }}
            </h4>
          </a>
          <NuxtLink v-else :to="`${item._path}`" class="block">
            <p
              class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
            >
              {{ formatDate(item.date) }}
            </p>
            <h4 class="title-font text-lg font-medium text-gray-600 mb-3">
              {{ item.title }}
            </h4>
          </NuxtLink>

          <p v-if="description" class="mt-3 text-base leading-6 text-gray-500">
            {{ item.description }}
          </p>

          <ul v-for="tag in item.tags" class="inline-block">
            <li class="text-sm text-blue-500 uppercase flex pr-4">
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}

@media screen and (min-width: 1920px) {
  .image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: bottom;
  }
}
</style>

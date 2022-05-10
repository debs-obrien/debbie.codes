<template>
  <div class="flex flex-col rounded-lg shadow-lg overflow-hidden flex-1">
    <div class="flex-shrink-0">
      <div v-if="item.url">
        <a :href="item.url" class="block" rel="nofollow" target="_blank">
          <NuxtImg
            :provider="item.provider"
            :src="item.image"
            :alt="item.title"
            :loading="item.loading ? item.loading : 'lazy'"
            preset="blog"
            width="640"
            height="480"
            sizes="sm:355px md:320px lg:480px"
            class="w-full h-64 object-cover"
          />
        </a>
      </div>
      <div v-else class="image">
        <NuxtLink :to="`/blog/${item.slug}`">
          <NuxtImg
            :provider="item.provider"
            :src="item.image"
            :alt="item.title"
            :loading="item.loading ? item.loading : 'lazy'"
            preset="blog"
            width="auto"
            height="auto"
            sizes="sm:355px md:320px lg:480px"
            class="w-full h-64 object-cover"
          />
        </NuxtLink>
      </div>
    </div>
    <div class="flex-1 bg-white p-6 flex flex-col justify-between">
      <div class="flex-1">
        <!-- <div>
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800"
          >
            {{ tag }}
          </span>
        </div> -->
        <a v-if="item.url" :href="item.url" class="block">
          <h3 class="mt-2 text-xl leading-7 font-semibold text-gray-900">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-base leading-6 text-gray-500">
            {{ item.description }}
          </p>
        </a>

        <div v-else>
          <NuxtLink :to="`/blog/${item.slug}`" class="block">
            <h2 class="mt-2 text-xl leading-7 font-semibold text-gray-900">
              {{ item.title }}
            </h2>
            <div>
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800"
              >
                {{ tag }}
              </span>
            </div>
            <p
              v-if="description"
              class="mt-3 text-base leading-6 text-gray-500"
            >
              {{ item.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
      <div v-if="item.date" class="mt-6 flex items-center">
        <div class="ml-3">
          <div class="flex text-sm leading-5 text-gray-500">
            {{ formatDate(item.date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(date).toLocaleDateString('en', options)
      }
    }
  }
</script>

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

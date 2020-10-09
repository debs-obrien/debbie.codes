<template>
  <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
    <div class="flex-shrink-0">
      <NuxtLink :to="`/blog/${article.slug}`" class="block">
        <img
          class="h-48 w-full object-cover"
          :src="article.image"
          :alt="article.title"
        />
      </NuxtLink>
    </div>
    <div class="flex-1 bg-white p-6 flex flex-col justify-between">
      <div class="flex-1">
        <div>
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800"
          >
            {{ tag }}
          </span>
        </div>
        <NuxtLink :to="`/blog/${article.slug}`" class="block">
          <h3 class="mt-2 text-xl leading-7 font-semibold text-gray-900">
            {{ article.title }}
          </h3>
          <p class="mt-3 text-base leading-6 text-gray-500">
            {{ article.description }}
          </p>
        </NuxtLink>
      </div>
      <div v-if="article.createdAt" class="mt-6 flex items-center">
        <div class="ml-3">
          <div class="flex text-sm leading-5 text-gray-500">
            {{ formatDate(article.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      article: {
        type: Object,
        default: () => {},
        required: false
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
</style>

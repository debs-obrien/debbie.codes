<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    section: {
      type: String,
      required: true
    }
  }
};
</script>
<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="container px-6 py-10 mx-auto">
      <div class="mt-8 lg:-mx-6 lg:flex lg:items-center">
        <NuxtLink :to="item._path">
          <NuxtImg
            :provider="item.provider"
            :src="item.image"
            :alt="item.alt"
            width="680"
            height="280"
            fit="fill"
            format="webp"
            class="scale-90 transition-all duration-400 hover:scale-100 rounded"
          />
        </NuxtLink>

        <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
          <ul v-for="tag in item.tags" class="inline-block">
            <li class="text-sm text-blue-500 uppercase flex px-4">
              <NuxtLink :to="`/${section}/tags/${tag}`" class="hover:underline">
                {{ tag }}
              </NuxtLink>
            </li>
          </ul>

          <NuxtLink
            :to="item._path"
            class="block mt-4 text-2xl font-semibold text-gray-800 hover:underline dark:text-white md:text-3xl"
          >
            {{ item.title }}
          </NuxtLink>

          <p class="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
            {{ item.description }}
          </p>

          <NuxtLink
            :to="item._path"
            class="inline-block mt-2 text-blue-500 underline hover:text-blue-400"
            >Read more
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

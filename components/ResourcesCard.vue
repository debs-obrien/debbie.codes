<template>
  <div class="pattern-dots-md gray-light">
    <NuxtLink :to="resource.link">
      <div
        class="rounded bg-white dark:bg-gray-800  p-4 transform translate-x-6 -translate-y-6  "
      >
        <!-- <div
          class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-green-100 text-green-500 mb-5 flex-shrink-0 p-2"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            ></path>
          </svg>
        </div> -->
        <div class="flex-grow">
          <h2 class="text-xl title-font font-medium mb-3">
            {{ resource.title }}
          </h2>
          <p class="leading-relaxed text-sm text-justify">
            {{ resource.description }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
  export default {
    props: {
      resource: {
        type: Object,
        required: true
      }
    }
  }
</script>

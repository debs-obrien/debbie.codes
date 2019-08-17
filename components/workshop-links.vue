<template>
  <div class="flex border border-gray-500 p-2 w-full">
    <a class="justify-center" :href="url">
      <img
        class="w-100"
        :src="$store.state.CloudinaryWorkshopProfile + img"
        :alt="alt"
      />
    </a>
    <div class="w-full p-2 ml-2 border-l border-gray-500">
      <div class="flex w-full justify-between">
        <a class="hover:underline" :href="url">
          <h2 class="text-lg mt-0">{{ name }}</h2>
        </a>
        <h3 class="text-lg mt-0">{{ topic }}</h3>
      </div>

      <ul class="flex flex-col">
        <p>{{ title }}</p>
        <p>
          <span>{{ duration }} -</span>
          {{ place }}
        </p>
        <li v-if="notesUrl">
          <nuxt-link :to="notesUrl">Notes</nuxt-link>
        </li>
        <li v-if="blogUrl">
          <a :href="blogUrl">Blog Post</a>
        </li>
        <li v-if="videoUrl">
          <a :href="videoUrl">Video</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    img: {
      type: String,
      default: '',
      required: false,
    },
    alt: {
      type: String,
      default: '',
      required: false,
    },
    place: {
      type: String,
      default: '',
      required: true,
    },
    duration: {
      type: String,
      default: '',
      required: true,
    },
    topic: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: String,
      default: '',
      required: false,
    },
    title: {
      type: String,
      default: '',
      required: false,
    },

    url: {
      type: String,
      default: '',
      required: false,
    },

    notesUrl: {
      type: String,
      default: '',
      required: false,
    },
    blogUrl: {
      type: String,
      default: '',
      required: false,
    },
    videoUrl: {
      type: String,
      default: '',
      required: false,
    },

    slidesUrl: {
      type: String,
      default: '',
      required: false,
    },
  },
}
</script>

<style scoped>
.wrapper {
  width: 900px;
  margin: 0 auto;
}
</style>

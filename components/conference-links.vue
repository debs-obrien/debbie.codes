<template>
  <div class="flex border border-gray-500 p-2 w-full">
    <div class="flex flex-col">
      <a class="justify-center" :href="url">
        <img
          class="w-100"
          :src="$store.state.CloudinaryConfLogos + img"
          :alt="alt"
        />
      </a>
      <p class="text-sm">
        <span>{{ place }},</span>
        <span>{{ country }}</span>
      </p>
    </div>
    <div class="w-full p-2 ml-2 border-l border-gray-500">
      <div class="flex w-full justify-between">
        <a class="hover:underline" :href="url">
          <h2 class="text-lg mt-0">{{ name }}, {{ date }}</h2>
        </a>
        <p>{{ type }}</p>
      </div>

      <p v-if="talk">{{ talk }}</p>
      <p v-if="desc">{{ desc }}</p>

      <ul class="flex flex-col">
        <li v-if="slidesUrl">
          <a :href="slidesUrl">Slides</a>
        </li>
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

    type: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
    date: {
      type: String,
      default: '',
      required: true,
    },
    place: {
      type: String,
      default: '',
      required: true,
    },
    country: {
      type: String,
      default: '',
      required: true,
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
    talk: {
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

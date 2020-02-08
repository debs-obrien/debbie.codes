<template>
  <div class="flex border border-gray-500 p-2 w-full">
    <div class="flex flex-col">
      <a class="justify-center" :href="url">
        <ImageFade class="w-100" :src="$url.workshop(img)" :alt="alt" />
      </a>
      <p class="text-sm">
        <span>{{ place }},</span>
        <span>{{ country }}</span>
      </p>
    </div>
    <div class="w-full p-2 ml-2 border-l border-gray-500">
      <div class="flex-col-reverse md:flex-row flex w-full justify-between">
        <a class="hover:underline" :href="url">
          <h2 class="text-lg mt-0 font-semibold">{{ name }}</h2>
        </a>

        <p class="font-Saira uppercase font-semibold">{{ topic }}</p>
      </div>
      <p>{{ title }}</p>
      <p>
        <span>{{ duration }} -</span>
        {{ place }}
      </p>
    </div>
  </div>
</template>
<script>
import ImageFade from '~/components/image-fade'

export default {
  components: {
    ImageFade,
  },
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
    country: {
      type: String,
      default: '',
      required: false,
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
  },
}
</script>

<style scoped>
.wrapper {
  width: 900px;
  margin: 0 auto;
}
</style>

<template>
  <div class="flex border border-gray-500 p-2 w-full">
    <div class="flex flex-col">
      <a class="justify-center" :href="workshop.url">
        <img
          class="w-100"
          :src="$url.workshop(workshop.img)"
          :alt="workshop.alt"
          loading="lazy"
        />
      </a>
    </div>
    <div class="w-full p-2 ml-2 border-l border-gray-500">
      <div class="flex-col-reverse md:flex-row flex w-full justify-between">
        <a class="hover:underline" :href="url">
          <h2 class="text-lg mt-0 font-semibold">{{ workshop.name }}</h2>
        </a>

        <p class="font-Saira uppercase font-semibold">
          {{ workshop.topic }}
        </p>
      </div>
      <p>{{ workshop.title }}</p>
      <p>
        <span>{{ workshop.duration }} -</span>
        {{ workshop.place }}
      </p>
      <p>{{ workshop.year }}</p>
      <ul class="flex flex-col">
        <li v-if="workshop.slidesUrl">
          <a :href="workshop.slidesUrl">Slides</a>
        </li>
        <li v-if="workshop.notesUrl">
          <nuxt-link :to="workshop.notesUrl">
            Notes
          </nuxt-link>
        </li>
        <li v-if="workshop.blogUrl">
          <a :href="workshop.blogUrl">Blog Post</a>
        </li>
        <li v-if="workshop.videoUrl">
          <a :href="workshop.videoUrl">Video</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      workshop: {
        type: Object,
        default: () => {},
        required: true
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 900px;
    margin: 0 auto;
  }
  .max-width {
    max-width: 130px;
  }
</style>

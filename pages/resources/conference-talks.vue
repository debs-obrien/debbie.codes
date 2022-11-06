<template>
  <div class="page-wrapper mt-8">
    <SocialHead :title="title" :description="description" />
    <AppBreadCrumb title="Conference Talks" />
    <AppTitle>
      {{ title }}
    </AppTitle>
    <AppIntro>
      {{ description }}
    </AppIntro>
    <div
      class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div v-for="video of videos" :key="video.slug" data-test-id="talks">
        <VideoCard :item="video" />
      </div>
    </div>
  </div>
</template>
<script setup>
const title = ref("Debbie's videos from conference talks");
const description = ref(
  'Published videos from conferences around the world both in house and virtual'
);

useHead({
  meta: [{ title: title }, { name: 'description', content: description }]
});

const videos = await queryContent('conference-talks')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find();
</script>

<!-- <script>
export default {
  async asyncData({ $content }) {


    const videos = await $content('conference-talks')
      .where({ published: { $ne: false } })
      .sortBy('date', 'desc')
      .fetch();

    return {
      videos
    };
  },
  data() {
    return {
      title: "Debbie's videos from conference talks",
      description:
        'Published videos from conferences around the world both in house and virtual'
    };
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://debbie.codes/resources/${this.$route.params.slug}`
        }
      ]
    };
  }

};
</script> -->

<template>
  <div class="page-wrapper">
    <!-- <SocialHead :title="title" :description="description" /> -->
    <AppBreadCrumb title="podcasts" />
    <AppTitle>Guest Podcast Interviews</AppTitle>
    <AppIntro>
      Collection of Podcasts where I was interviewed as a Guest
    </AppIntro>
    <div
      class="mt-12 grid gap-8 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:max-w-none"
    >
      <div
        v-for="podcast of podcasts"
        :key="podcast.slug"
        data-test-id="podcasts"
      >
        <PodCastCard :item="podcast" />
      </div>
    </div>
  </div>
</template>

<script setup>
const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find();
</script>

<!-- <script>
export default {
  async asyncData({ $content, params }) {
    const podcasts = await $content('podcasts')
      .where({ published: { $ne: false } })
      .sortBy('date', 'desc')
      .fetch();

    return {
      podcasts
    };
  },
  data() {
    return {
      title: "Welcome to Debbie's podcasts",
      description:
        "Debbie's Podcasts where she has appeard as a guest on various shows"
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

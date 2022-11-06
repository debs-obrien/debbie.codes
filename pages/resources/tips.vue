<template>
  <div class="page-wrapper">
    <AppBreadCrumb title="tips" />

    <AppTitle>Welcome to my tips</AppTitle>
    <AppIntro> My tips, a short collection of things to remember </AppIntro>
    <div class="mt-12 grid gap-6 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none">
      <!-- <div v-for="tip of tips" :key="tip.slug">
        <TipCard :tip="tip" :page="tip" />
      </div> -->
    </div>
  </div>
</template>

<!-- <script>
export default {
  async asyncData({ $content, params }) {
    const tips = await $content('tips')
      .where({ published: { $ne: false } })
      .sortBy('date', 'desc')
      .fetch();

    return {
      tips
    };
  },
  data() {
    return {
      type: '',
      title: "Debbie's tips and useful things to remember",
      description: 'List of Tips that will help you when developing'
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

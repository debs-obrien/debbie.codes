<template>
  <div class="flex mt-4">
    <!-- <SocialHead
      :title="page.title"
      :description="page.description"
      :image="page.ogImage ? page.ogImage : page.image"
    /> -->
    <div class="mx-auto">
      <AppBreadCrumb link="blog" :title="article.title" />

      <main class="md:p-8 mx-auto">
        <ContentDoc v-slot="{ doc }">
          <h1 class="title">
            {{ doc.title }}
          </h1>
          <lite-youtube
            v-if="doc.video"
            :videoid="doc.video"
            :playlabel="doc.title"
          />

          <div
            class="prose prose-lg dark:prose-invert prose-md lg:prose-lg first-letter:text-3xl first-letter:text-blue-600"
          >
            <ContentRenderer :value="doc" />
          </div>
        </ContentDoc>
      </main>
      <h3 class="border-solid border-t-4 border-gray-600 pt-4">
        Check out some of my other posts:
      </h3>
      <ArticlePrevNext :prev="prev" :next="next" class="mt-4" />
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
const slug = route.params.slug || 'index';

const [article] = await queryContent('blog', slug).find();

useHead({
  meta: [
    { title: article.title },
    { name: 'description', content: article.description }
  ]
});

// const [prev, next] = await queryContent('blog')
//   .where({ published: { $ne: false } })
//   .sort({ date: -1 })
//   .findSurround(slug)
//   .find();
</script>
<script>
export default {
  // head() {
  //   return {
  //     title: this.page.title,
  //     meta: [
  //       {
  //         hid: 'description',
  //         name: 'description',
  //         content: this.page.description
  //       },
  //       // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
  //       { property: 'og:site_name', content: 'Debbie Codes' },
  //       { hid: 'og:type', property: 'og:type', content: 'website' },
  //       {
  //         hid: 'og:url',
  //         property: 'og:url',
  //         content: 'https://debbie.codes'
  //       },
  //       {
  //         hid: 'og:title',
  //         property: 'og:title',
  //         content: this.page.title
  //       },
  //       {
  //         hid: 'og:description',
  //         property: 'og:description',
  //         content: this.page.description
  //       },
  //       {
  //         hid: 'og:image',
  //         property: 'og:image',
  //         content: this.page.image
  //       },
  //       // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
  //       { name: 'twitter:site', content: '@debs_obrien' },
  //       { name: 'twitter:card', content: 'summary_large_image' },
  //       {
  //         hid: 'twitter:url',
  //         name: 'twitter:url',
  //         content: 'https://debbie.codes'
  //       },
  //       {
  //         hid: 'twitter:title',
  //         name: 'twitter:title',
  //         content: this.page.title
  //       },
  //       {
  //         hid: 'twitter:description',
  //         name: 'twitter:description',
  //         content: this.page.description
  //       },
  //       {
  //         hid: 'twitter:image',
  //         name: 'twitter:image',
  //         content: this.page.ogImage
  //       }
  //     ],
  //     link: [
  //       {
  //         hid: 'canonical',
  //         rel: 'canonical',
  //         href: `https://debbie.codes/blog/${this.$route.params.slug}`
  //       }
  //     ]
  //   };
  // }
};
</script>

<style scoped>
.title {
  font-size: 2.1428571em;
  margin-top: 0;
  margin-bottom: 0.8em;
  line-height: 1.2;
  font-weight: 800;
  margin-left: auto;
  margin-right: auto;
  max-width: 65ch;
}
code {
  color: inherit;
}
</style>

<template>
  <div class="">
    <TheTopBar />

    <div class="container mt-top-bar">
      <AppTitle>Welcome to my blog</AppTitle>
      <AppIntro>
        Here you will find various blog posts on all things related to Frontend
        and JavaScript but especially on things related to Nuxt, React, Testing
        and Performance.
      </AppIntro>

      <BlogTags />

      <nuxt />
    </div>
    <ColorModePicker class="flex flex-col mt-20 px-4 py-6" />
    <TheFooter />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title: "Welcome to Debbie's blog",
        description:
          "Debbie's Blog with lots of cool articles and tips on Nuxt, React, Testing, TypeScript and tech in general",
        image: 'https://debbie.codes/twitter-card-blog.png'
      }
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
            href: 'https://debbie.codes/blog'
          }
        ]
      }
    }
  }
</script>

<style>
  .dark .prose blockquote {
    color: #fff;
  }
</style>

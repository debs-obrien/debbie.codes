<template>
  <nav>
    <ul class="block lg:flex">
      <li
        v-for="(nav, index) in navLinks"
        :key="index"
        class="pb-6 lg:pb-0 pr-6"
      >
        <nuxt-link :to="nav.url" class="hover:no-underline">
          {{ nav.link }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>
<script>
  export default {
    data() {
      return {
        navLinks: [
          {
            url: '/resources/guest-live-streams',
            link: 'Streams'
          },
          {
            url: '/resources/interviews',
            link: 'Interviews'
          },
          {
            url: '/resources/podcasts',
            link: 'Podcasts'
          },
          {
            url: '/resources/courses',
            link: 'Courses'
          },
          {
            url: '/resources/conference-talks',
            link: 'Talks'
          },
          {
            url: '/resources/featured-posts',
            link: 'Featured Posts'
          },
          {
            url: '/blog',
            link: 'Blog'
          }
        ]
      }
    }
  }
</script>

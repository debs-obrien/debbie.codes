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
          url: '/videos',
          link: 'Videos'
        },
        {
          url: '/podcasts',
          link: 'Podcasts'
        },
        {
          url: '/courses',
          link: 'Courses'
        },
        {
          url: '/blog',
          link: 'Blog'
        }
      ]
    };
  }
};
</script>

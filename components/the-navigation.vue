<template>
  <ul class="block lg:flex">
    <li class="pb-6 lg:pb-0 pr-8" v-for="(nav, index) in navLinks" :key="index">
      <nuxt-link :to="nav.url" class="hover:text-primary">
        {{ nav.link }}
      </nuxt-link>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      navLinks: [
        {
          url: '/',
          link: 'Home',
        },
        {
          url: '/about',
          link: 'About',
        },
        {
          url: '/conferences',
          link: 'Conferences',
        },
        {
          url: '/workshops',
          link: 'Workshops',
        },
        {
          url: '/resources',
          link: 'Resources',
        },
        {
          url: '/blog',
          link: 'Blog',
        },
        {
          link: 'Contact',
          url: '/contact',
        },
      ],
    }
  },
}
</script>

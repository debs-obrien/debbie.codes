<template>
  <ul class="menu-list">
    <li class="" v-for="(nav, index) in navLinks" :key="index">
      <nuxt-link :to="nav.url">{{ nav.link }}</nuxt-link>
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
          url: '/blog-posts',
          link: 'Posts',
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
<style scoped>
.menu-list li {
  padding-bottom: 10px;
}
.menu-list li:hover {
  text-decoration: underline;
}
</style>

<template>
  <div>
    <nav>
      <ul class="block lg:flex">
        <li
          v-for="(nav, index) in navLinks"
          :key="index"
          class="pb-6 lg:pb-0 pr-8"
        >
          <nuxt-link :to="nav.url" class="hover:text-primary">
            {{ nav.link }}
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navLinks: [
        {
          url: '/',
          link: 'Home'
        },
        {
          url: '/about',
          link: 'About'
        },
        {
          url: '/conferences',
          link: 'Conferences'
        },
        {
          url: '/workshops',
          link: 'Workshops'
        },
        {
          url: '/resources',
          link: 'Resources'
        },
        {
          url: '/blog',
          link: 'Blog'
        },
        {
          link: 'Contact',
          url: '/contact'
        }
      ]
    }
  }
}
</script>

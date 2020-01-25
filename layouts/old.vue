<template>
  <div class="grid-layout">
    <header class="header wrapper">
      <ul class="flex flex-wrap px-4 pt-6 pb-8">
        <li class="" v-for="(nav, index) in navLinks" :key="index">
          <TheNavigation :url="nav.url" :link="nav.link" />
        </li>
      </ul>
    </header>
    <div class="px-6 pb-6 main">
      <nuxt />
    </div>
    <TheFooter />
  </div>
</template>
<script>
import TheNavigation from '@/components/the-navigation'

export default {
  components: {
    TheNavigation,
    TheFooter: () => import('@/components/the-footer'),
  },
  data() {
    return {
      navLinks: [
        {
          url: '/',
          link: 'Home',
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
          url: '/learning-resources',
          link: 'Resources',
        },
        {
          link: 'Code',
          url: '/code',
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
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.header {
  background-image: url('~assets/imgs/body_bg.png');
}
.nav {
  padding: 0 20px;
}
.footer {
}

.grid-layout {
  display: grid;
  justify-content: center;
  grid-template-columns: minmax(auto, 1020px);
}

.title {
  display: block;
  font-weight: 300;
  font-size: 60px;
  color: #35495e;
  letter-spacing: 1px;
}

html {
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
  text-decoration: none;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #383838;
  color: #383838;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #383838;
}

h1 {
  margin-top: 2rem;
  color: #467978;
  font-size: 2rem;
}
h2 {
  color: #467978;
  font-weight: 500;
  font-size: 1.2rem;
}
p {
  font-size: 1.2rem;
}

a:hover {
  color: #383838;
}
section h2 {
  margin-top: 2rem;
}
</style>

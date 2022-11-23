// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      title: 'Debbie Codes with Playwright, Nuxt, React, Tailwind and more',
      titleTemplate: title =>
        title !== 'Debbie Codes with Playwright, Nuxt, React, Tailwind and more'
          ? `${title} · Debbie Codes`
          : title,
      meta: [
        {
          name: 'google-site-verification',
          content: 'Nb9JyfPdxgxIzfosyzt-JsvJZkoUVlhEYN4TuoLPWF0',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Debbie O\'Brien, Program Manager at Microsoft working on Playwright, with over 10 years experience in Frontend development. Google Developer Expert in web technologies, Previous Microsoft Most Valuable Professional in developer technologies, GitHub Start Alumni, NuxtJS Ambassador and Cloudinary Media Developer Expert.',
        },
        // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
        { property: 'og:site_name', content: 'Debbie Codes' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://debbie.codes',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            'Debbie codes and helps others learn Playwright, testing, React, Nuxt and more',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Debbie O\'Brien, Program Manager at Microsoft working on Playwright, with over 10 years experience in Frontend development. Google Developer Expert in web technologies, Previous Microsoft Most Valuable Professional in developer technologies, GitHub Start Alumni, NuxtJS Ambassador and Cloudinary Media Developer Expert.',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://debbie.codes/twitter-card.png',
        },
        // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
        { name: 'twitter:site', content: '@debs_obrien' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: 'https://debbie.codes',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content:
            'Debbie codes and helps others learn Playwright, testing, React, Nuxt and more',
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:
            'My website of where I play around with Nuxt, Playwright and more and showcase my blog, resources etc',
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: 'https://debbie.codes/twitter-card.png',
        },
      ],
      script: [
        // <script src="https://myawesome-lib.js"></script>
        // { src: 'https://awesome-lib.js' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          hid: 'canonical',
          rel: 'canonical',
          href: 'https://debbie.codes',
        },
      ],

    },
  },
  modules: [
    '@nuxt/image-edge',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@tailwindcss/typography',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark',
  },
  css: [
    '~/assets/css/main.css',
    '~/node_modules/lite-youtube-embed/src/lite-yt-embed.css',
  ],
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/debsobrien/image/upload/',
    },

    imgix: {
      baseURL: 'https://images.unsplash.com/',
    },
    presets: {
      blog: {
        modifiers: {
          format: 'webp',
          fit: 'cover',
          quality: '80',
        },
      },
    },
  },
  content: {
    // https://content.nuxtjs.org/api/configuration
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'material-palenight',
      },
    },
  },

  build: {
    transpile: ['lite-youtube'],
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => ['lite-youtube'].includes(tag),
    },
  },
})


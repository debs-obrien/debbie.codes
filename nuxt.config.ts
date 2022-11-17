// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/image-edge',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    // '@nuxt/content',
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

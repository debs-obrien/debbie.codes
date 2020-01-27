export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    htmlAttrs: {
      lang: 'en',
    },
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/tailwind.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/markdownit',
    '@nuxtjs/axios',
    ['@nuxtjs/pwa', { icon: false }],
    'nuxt-webfontloader',
    '@nuxtjs/apollo',
  ],
  webfontloader: {
    google: {
      families: [
        'Saira:300,400,500,600,700&display=swap',
        'Nunito:300i,400,400i,600,600i,700&display=swap',
      ],
    },
  },

  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    use: ['markdown-it-div', 'markdown-it-attrs'],
  },

  // Give apollo module options
  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js',
    },
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}

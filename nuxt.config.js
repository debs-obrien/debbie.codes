const cloudinaryUrl =
  'https://res.cloudinary.com/debsobrien/image/upload/q_auto,f_auto'
const baseUrl = 'https://patterson.travel'

export default {
  mode: 'universal',
  env: {
    baseUrl: process.env.BASE_URL || baseUrl,
    cloudinaryPath: cloudinaryUrl,
    baseImage: cloudinaryUrl + '/',
    workshopImage:
      cloudinaryUrl +
      ',c_thumb,w_150,h_150/v1565547670/debbie.codes/workshops/',
    conferenceImage:
      cloudinaryUrl +
      ',c_thumb,w_150,h_150/v1565547670/debbie.codes/conferences/',
  },
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
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
    ],
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
  plugins: ['~/plugins/url-helpers.js'],
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
    'nuxt-purgecss',
    './modules/transform',
  ],

  purgeCSS: {
    mode: 'postcss',
    whitelistPatterns: [],
  },

  /*
   ** Dynamic Routes added
   */
  generate: {
    routes: function() {
      const fs = require('fs')
      const path = require('path')
      return fs.readdirSync('./assets/content/blog').map((file) => {
        return {
          route: `/blog/${path.parse(file).name}`, // Return the slug
          payload: require(`./assets/content/blog/${file}`),
        }
      })
    },
  },

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
    injected: true,
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

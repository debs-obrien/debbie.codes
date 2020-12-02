const cloudinaryUrl =
  'https://res.cloudinary.com/debsobrien/image/upload/q_auto,f_auto'

export default {
  target: 'static',
  env: {
    cloudinaryPath: cloudinaryUrl,
    baseImage: cloudinaryUrl + '/',
    workshopImage:
      cloudinaryUrl +
      ',c_thumb,w_130,h_130/v1565547670/debbie.codes/workshops/',
    conferenceImage:
      cloudinaryUrl +
      ',c_thumb,w_130,h_130/v1565547670/debbie.codes/conferences/'
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Debbie Codes with Nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          "Debbie O'Brien, Head of Learning and Developer Advocate for NuxtJS with over 10 years experience in Frontend development. Microsoft Most Valuable Professional in developer technologies, Google Developer Expert in web technologies and Cloudinary Media Developer Expert."
      },
      // Test on: https://developers.facebook.com/tools/debug/
      { property: 'og:site_name', content: 'Debbie Codes' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://debbie.codes.com'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Debbie Codes with Nuxt'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          "Debbie O'Brien, Head of Learning and Developer Advocate for NuxtJS with over 10 years experience in Frontend development. Microsoft Most Valuable Professional in developer technologies, Google Developer Expert in web technologies and Cloudinary Media Developer Expert."
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://debbie.codes/twitter-card.png'
      },
      // Test on: https://cards-dev.twitter.com/validator
      { name: 'twitter:site', content: '@debs_obrien' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: 'https://debbie.codes.com'
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Debbie codes and helps others learn Nuxt'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'My website of where I play around with Nuxt and more and showcase my blog, resources etc'
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: 'https://debbie.codes/twitter-card.png'
      }
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: 'https://debbie.codes.com'
      }
    ],
    script: [
      {
        src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
        defer: true
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main'],

  router: {
    linkExactActiveClass: 'text-primary'
  },

  publicRuntimeConfig: {
    apiHasuraUrl:
      process.env.API_HASURA_URL ||
      'https://debbie-codes.herokuapp.com/v1/graphql'
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/url-helpers.js',
    '~/plugins/vue-dompurify.js',
    '~/plugins/hasura.js',
    '~/plugins/preview.client.js'
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/svg',
    '@nuxtjs/color-mode'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxt/http',
    '@nuxtjs/pwa',
    'nuxt-webfontloader',
    '@nuxt/content',
    '@nuxtjs/cloudinary',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-166062227-1'
      }
    ]
  ],
  components: true,
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css'
      }
    }
  },
  hooks: {
    'content:file:beforeInsert': document => {
      if (document.extension === '.md') {
        const { time } = require('reading-time')(document.text)

        document.readingTime = time
      }
    }
  },

  cloudinary: {
    useComponent: true,
    cloudName: 'debsobrien'
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  webfontloader: {
    google: {
      families: [
        'Saira:300&display=swap,400&display=swap,500&display=swap,600&display=swap,700&display=swap'
      ]
    }
  },
  generate: {
    fallback: true,
    exclude: [/code/, /^(?=.*\btest\b).*$/]
  },

  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}

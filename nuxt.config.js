export default {
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Debbie Codes with Bit, Typescript, Nuxt, React, Tailwind and more',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'google-site-verification',
        content: 'Nb9JyfPdxgxIzfosyzt-JsvJZkoUVlhEYN4TuoLPWF0'
      },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          "Debbie O'Brien, Head Developer Advocate at Bit, with over 10 years experience in Frontend development. Microsoft Most Valuable Professional in developer technologies, Google Developer Expert in web technologies, GitHub Start, NuxtJS Ambassador and Cloudinary Media Developer Expert."
      },
      // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
      { property: 'og:site_name', content: 'Debbie Codes' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://debbie.codes'
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
          "Debbie O'Brien, Head Developer Advocate at Bit, with over 10 years experience in Frontend development. Microsoft Most Valuable Professional in developer technologies, Google Developer Expert in web technologies, GitHub Start, NuxtJS Ambassador and Cloudinary Media Developer Expert."
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://debbie.codes/twitter-card.png'
      },
      // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
      { name: 'twitter:site', content: '@debs_obrien' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: 'https://debbie.codes'
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content:
          'Debbie codes and helps others learn Bit, Component Driven Development, React, Nuxt and more'
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
        href: 'https://debbie.codes'
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
  css: [
    '~/assets/css/main',
    'node_modules/lite-youtube-embed/src/lite-yt-embed.css'
  ],

  colorMode: {
    classSuffix: ''
  },

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
    '~/plugins/preview.client.js',
    '~/plugins/youtube.client.js'
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
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    'vue-plausible',
    'nuxt-build-optimisations',
    '@nuxt/image'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxt/http',
    '@nuxtjs/pwa',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    [
      'storyblok-nuxt',
      {
        accessToken: process.env.STORYBLOK_API_KEY,
        cacheProvider: 'memory'
      }
    ]
  ],
  sitemap: {
    hostname: 'https://debbie.codes',
    gzip: true,
    exclude: ['code', '/code/**', 'test', 'thank-you']
  },

  buildOptimisations: {
    profile: 'risky',
    features: {
      // use url-loader
      imageFileLoader: false
    }
  },
  plausible: {
    domain: 'debbie.codes'
  },

  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/debsobrien/image/upload/'
    },

    imgix: {
      baseURL: 'https://images.unsplash.com/'
    },
    presets: {
      blog: {
        modifiers: {
          format: 'webp',
          fit: 'cover',
          quality: '80'
        }
      }
    }
  },
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

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  pwa: {
    manifest: {
      theme_color: '#091a28'
    }
  },

  googleFonts: {
    /* module options */
    families: {
      Saira: [300, 400, 500, 600, 700]
    },
    display: 'swap' // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  },

  /*
   ** Exclude from generation
   */
  generate: {
    fallback: true,
    exclude: [/code/, /^(?=.*\btest\b).*$/]
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}

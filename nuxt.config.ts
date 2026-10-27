import process from 'node:process'
import { generateContentIndex } from './scripts/generate-content-index.mjs'
import { generateSitemap } from './scripts/generate-sitemap.mjs'
import { DEFAULT_WEBMCP_OT_CHROME, DEFAULT_WEBMCP_OT_EDGE } from './utils/origin-trial'

// Static public/sitemap.xml — avoids Netlify Function/SQLite 500s for /sitemap.xml.
generateSitemap()
// Static public/webmcp/content-index.json and public/llms.txt.
generateContentIndex()

export default defineNuxtConfig({
  srcDir: '.',
  // Isolated dirs for scripts/check-origin-trial.mjs so a production generate
  // never rebuilds the shared .nuxt / .output used by `nuxt dev` / Playwright.
  ...(process.env.NUXT_OT_BUILD_DIR ? { buildDir: process.env.NUXT_OT_BUILD_DIR } : {}),

  // Dedicated local port for this Nuxt app (avoid 3000/3001 conflicts)
  devServer: {
    port: 8000,
    host: '127.0.0.1',
  },

  modules: [
    '@nuxtjs/robots',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/content',
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
      modifiers: {
        format: 'webp',
        quality: '80',
      },
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
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'dev-to-uploads.s3.amazonaws.com', 'raw.githubusercontent.com', 'theaiplatform.app', 'i.ytimg.com', 'img.youtube.com'],
    format: ['webp'],
    quality: 80,
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536,
    },
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio',
    },
    highlight: {
      theme: {
        default: 'github-dark',
        light: 'github-light',
        dark: 'github-dark',
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'bash', 'markdown'],
      lineNumbers: true,
    },
  },

  build: {
    transpile: ['lite-youtube'],
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => ['lite-youtube', 'elevenlabs-convai'].includes(tag),
    },
  },

  compatibilityDate: '2025-03-13',

  runtimeConfig: {
    public: {
      // /hire-me voice widget (public agent id; origin-allowlisted for debbie.codes).
      hireMeAgentId: process.env.HIRE_ME_AGENT_ID || 'agent_8801m5yfwzgpf61szvhj0mj0v5fv',
      // Defaults are the live debbie.codes WebMCP tokens (utils/origin-trial.ts).
      // NUXT_PUBLIC_WEBMCP_OT_CHROME / _EDGE override. webmcpOtRender is baked at
      // build time so production HTML keeps the meta after client hydration.
      webmcpOtChrome: process.env.NUXT_PUBLIC_WEBMCP_OT_CHROME || DEFAULT_WEBMCP_OT_CHROME,
      webmcpOtEdge: process.env.NUXT_PUBLIC_WEBMCP_OT_EDGE || DEFAULT_WEBMCP_OT_EDGE,
      webmcpOtRender: process.env.NUXT_PUBLIC_WEBMCP_OT_RENDER
        ?? (process.env.CONTEXT === 'production' ? '1' : '0'),
    },
  },

  nitro: {
    ...(process.env.NUXT_OT_OUTPUT_DIR
      ? { output: { dir: process.env.NUXT_OT_OUTPUT_DIR } }
      : {}),
    prerender: {
      // Prefer completing the static publish (public/ assets, including
      // sitemap.xml + _redirects) over failing the whole generate on
      // unrelated IPX image fetch errors during crawl.
      failOnError: false,
      routes: ['/feed.xml'],
      // Write /blog.html instead of /blog/index.html so Netlify serves the
      // canonical no-slash URL (used by canonical tags, sitemap and links)
      // directly instead of 301-redirecting /blog -> /blog/ first.
      autoSubfolderIndex: false,
    },
  },
})

import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { generateContentIndex } from './scripts/generate-content-index.mjs'
import { generateSitemap } from './scripts/generate-sitemap.mjs'
import { buildHostingRouteRules } from './scripts/hosting-route-rules.mjs'
import { patchVercelBuildConfig } from './scripts/vercel-build-config.mjs'
import { DEFAULT_WEBMCP_OT_CHROME, DEFAULT_WEBMCP_OT_EDGE } from './utils/origin-trial'
import { calculateReadingTime, extractTextFromContent } from './utils/reading-time'
import { NETLIFY_REMOTE_IMAGE_HOSTS } from './utils/remote-images'

// Static public/sitemap.xml — avoids Netlify Function/SQLite 500s for /sitemap.xml.
generateSitemap()
// Static public/webmcp/content-index.json and public/llms*.txt.
const contentIndex = generateContentIndex()
const blogMarkdownRoutes = contentIndex.markdownRoutes || []
const blogYearRoutes = contentIndex.yearRoutes || []
const blogItems = (contentIndex.items || []).filter(item => item.type === 'blog')
const isHostProduction = process.env.CONTEXT === 'production'
  || process.env.VERCEL_ENV === 'production'
// @nuxt/image `auto` picks `vercel` on Vercel — never enable Vercel Image Optimization.
const isVercelBuild = Boolean(
  process.env.VERCEL
  || process.env.NITRO_PRESET?.startsWith('vercel'),
)
// Swap OG delivery implementation so Vercel bundles never include Netlify CDN URLs.
const ogDeliveryModule = fileURLToPath(
  new URL(
    isVercelBuild
      ? './utils/og-image-cloudinary-delivery.ts'
      : './utils/og-image-netlify-delivery.ts',
    import.meta.url,
  ),
)
// Redirect routeRules only on Vercel — Netlify generate would emit meta-refresh
// HTML that shadows public/_redirects 301s (breaks preview redirect tests).
const hostingRouteRules = buildHostingRouteRules({
  blogItems,
  includeRedirects: isVercelBuild,
})
// Netlify: auto → netlifyImageCdn. Vercel: Cloudinary (debsobrien), never vercel IPX/IO.
const imageProvider = process.env.NUXT_IMAGE_PROVIDER
  || (isVercelBuild ? 'cloudinarySite' : 'auto')

export default defineNuxtConfig({
  srcDir: '.',
  // Isolated dirs for scripts/check-origin-trial.mjs so a production generate
  // never rebuilds the shared .nuxt / .output used by `nuxt dev` / Playwright.
  ...(process.env.NUXT_OT_BUILD_DIR ? { buildDir: process.env.NUXT_OT_BUILD_DIR } : {}),

  alias: {
    '#og-delivery': ogDeliveryModule,
  },

  // Pin canonical host so previews never bake vercel.app into HTML.
  site: {
    url: 'https://debbie.codes',
    name: 'Debbie Codes',
  },

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

  robots: {
    sitemap: 'https://debbie.codes/sitemap.xml',
    // Comment for agents + empty Disallow (same shape as production robots.txt).
    groups: [
      {
        userAgent: '*',
        comment: ['LLM context: https://debbie.codes/llms.txt'],
        disallow: [''],
      },
    ],
  },

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
    provider: imageProvider,
    // Vercel-only custom provider (see providers/cloudinary-site.ts). Ignored on Netlify.
    providers: {
      cloudinarySite: {
        provider: '~/providers/cloudinary-site',
        options: {
          baseURL: 'https://res.cloudinary.com/debsobrien/image/upload/',
        },
      },
    },
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/debsobrien/image/upload/',
      modifiers: {
        format: 'auto',
        quality: 'auto',
      },
    },
    imgix: {
      baseURL: 'https://images.unsplash.com/',
    },
    presets: {
      blog: {
        modifiers: {
          format: isVercelBuild ? 'auto' : 'webp',
          fit: 'cover',
          quality: isVercelBuild ? 'auto' : '80',
        },
      },
    },
    // IPX local-dev allowlist — match Netlify `remote_images` hosts (utils/remote-images.ts).
    // Unsplash uses the imgix provider (not domains). YouTube thumbs stay plain <img>.
    domains: [...NETLIFY_REMOTE_IMAGE_HOSTS, 'res.cloudinary.com'],
    // Netlify: force WebP via fm=webp. Vercel Cloudinary: f_auto.
    format: isVercelBuild ? ['auto'] : ['webp'],
    quality: 80,
    // Keep screens aligned with real layout breakpoints used in `sizes`.
    // Drop unused ultra-wide widths that only inflate srcset.
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
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

  hooks: {
    // Patch Build Output config: trailing-slash 301s, header continue, blog Accept,
    // static 404 catch-all. Run after prerender so 404.html is present when possible.
    'nitro:init': (nitro) => {
      const patch = async () => {
        await patchVercelBuildConfig(nitro)
      }
      nitro.hooks.hook('compiled', patch)
      nitro.hooks.hook('prerender:done', patch)
    },
    // Store whole minutes on blog items so list queries can select readingMinutes
    // without loading full bodies (cards were falling back to description → 1 min).
    'content:file:afterParse': (ctx) => {
      if (ctx.collection?.name !== 'blog')
        return
      const text = extractTextFromContent(ctx.content.body)
        || (typeof ctx.content.description === 'string' ? ctx.content.description : '')
        || ''
      ctx.content.readingMinutes = calculateReadingTime(text)
    },
    // Dynamic import stays behind document.modelContext, but Nuxt still emits
    // prefetch for async plugin chunks. Disable prefetch/preload for WebMCP utils.
    // Do not use manualChunks for utils/webmcp: that pulled shared homepage modules
    // into the tools chunk and made / statically import it for every visitor.
    'build:manifest': (manifest) => {
      for (const item of Object.values(manifest)) {
        const src = item.src || ''
        if (src.includes('utils/webmcp')) {
          item.prefetch = false
          item.preload = false
        }
      }
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => ['lite-youtube', 'elevenlabs-convai'].includes(tag),
    },
  },

  compatibilityDate: '2025-03-13',

  // Prefer interaction prefetch over visibility — listing pages otherwise
  // fire dozens of payload prefetches for every in-viewport NuxtLink.
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: { visibility: false, interaction: true },
      },
    },
  },

  runtimeConfig: {
    public: {
      // Dual-host social images: Netlify Image CDN vs Cloudinary (Vercel builds).
      ogImageHost: isVercelBuild ? 'cloudinary' : 'netlify',
      // /hire-me voice widget (public agent id; origin-allowlisted for debbie.codes).
      hireMeAgentId: process.env.HIRE_ME_AGENT_ID || 'agent_8801m5yfwzgpf61szvhj0mj0v5fv',
      // Defaults are the live debbie.codes WebMCP tokens (utils/origin-trial.ts).
      // NUXT_PUBLIC_WEBMCP_OT_CHROME / _EDGE override. webmcpOtRender is baked at
      // build time so production HTML keeps the meta after client hydration.
      webmcpOtChrome: process.env.NUXT_PUBLIC_WEBMCP_OT_CHROME || DEFAULT_WEBMCP_OT_CHROME,
      webmcpOtEdge: process.env.NUXT_PUBLIC_WEBMCP_OT_EDGE || DEFAULT_WEBMCP_OT_EDGE,
      webmcpOtRender: process.env.NUXT_PUBLIC_WEBMCP_OT_RENDER
        ?? (isHostProduction ? '1' : '0'),
      // Same production gate as webmcpOtRender — bake at generate so
      // deploy previews and local dev never emit the Cloudflare beacon.
      cfWebAnalytics: isHostProduction ? '1' : '0',
    },
  },

  nitro: {
    // Preset auto-detected (Netlify / Vercel). Do not hardcode.
    ...(process.env.NUXT_OT_OUTPUT_DIR
      ? { output: { dir: process.env.NUXT_OT_OUTPUT_DIR } }
      : {}),
    // Bundle blog sources so Vercel serverless Accept middleware can render
    // markdown when the prerendered `.md` fetch is unavailable (Netlify edge
    // rewrites to static files instead).
    serverAssets: [
      {
        baseName: 'blog-md',
        dir: 'content/blog',
      },
    ],
    // Trailing-slash 301 + Accept markdown routes: scripts/vercel-build-config.mjs.
    // Do not set trailingSlash in vercel.json (platform 308s beat alias redirects).
    routeRules: hostingRouteRules,
    prerender: {
      // `nuxt build` (Vercel) is not nitro.static — without crawlLinks only the
      // explicit routes below prerender, home/blog SSR empty (Content SQLite
      // missing in the serverless function), and HTML posts 404. Match
      // `nuxt generate` crawl used on Netlify.
      crawlLinks: true,
      // Prefer completing the static publish (public/ assets, including
      // sitemap.xml + _redirects) over failing the whole generate on
      // unrelated IPX image fetch errors during crawl.
      failOnError: false,
      // `/` must be listed for non-static builds (Nuxt only auto-adds it when
      // nitro.static). Markdown + year archives still need explicit routes
      // (crawl alone only reaches recent-year chips / linked HTML).
      // robots.txt is emitted by @nuxtjs/robots — include so Vercel static has it.
      // `/404.html` must be listed on `nuxt build` (Vercel): Nuxt only auto-adds it
      // when nitro.static (`nuxt generate`). Prerendering that path writes the SPA
      // shell with site chrome + @nuxtjs/robots noindex (Netlify generate parity).
      // A fake 404 seed path does NOT write 404.html — Nitro skips failed routes.
      routes: ['/', '/feed.xml', '/robots.txt', '/404.html', ...blogMarkdownRoutes, ...blogYearRoutes],
      // Write /blog.html instead of /blog/index.html so Netlify serves the
      // canonical no-slash URL (used by canonical tags, sitemap and links)
      // directly instead of 301-redirecting /blog -> /blog/ first.
      autoSubfolderIndex: false,
    },
  },
})

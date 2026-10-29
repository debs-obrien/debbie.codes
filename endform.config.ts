import { defineEndformConfig } from 'endform'

/**
 * Endform only ships Playwright test files by default. The Cloudinary content
 * guard spec shells out to scripts/check-content.mjs, which also imports
 * utils/videos.ts — list both so remote runners can resolve them.
 */
export default defineEndformConfig({
  additionalFiles: [
    'scripts/check-content.mjs',
    'utils/videos.ts',
    'utils/remote-images.ts',
    // Optional local sitemap; crawl also fetches /sitemap.xml from the preview.
    'public/sitemap.xml',
    // Allowlist sync test reads this at runtime (not import-bundled).
    'netlify.toml',
  ],
})

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
    // Allowlist sync test reads this at runtime (not import-bundled).
    'netlify.toml',
  ],
  // Belt-and-braces: transfer Vercel bypass even if config load order varies.
  // playwright.config.ts also references VERCEL_AUTOMATION_BYPASS_SECRET for
  // extraHTTPHeaders (those win over Endform's own headers when both are set).
  environmentVariables: ['VERCEL_AUTOMATION_BYPASS_SECRET'],
})

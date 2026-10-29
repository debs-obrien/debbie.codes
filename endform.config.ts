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
  ],
})

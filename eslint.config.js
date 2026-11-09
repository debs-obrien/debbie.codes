import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
  },
  {
    // Fenced code samples in blog posts are prose, not project code, and
    // mostly fail to parse.
    ignores: [
      '/.github/workflows/playwright.yml',
      'content/**',
      // One-shot Cloudinary migration tooling (not runtime app code).
      'scripts/cloudinary/**',
      'scripts/optimize-images.mjs',
    ],
  },
  {
    // Specs (and the spec examples in the Playwright instructions) use
    // semicolons and no trailing commas.
    files: ['**/*.spec.ts', '.github/instructions/playwright.instructions.md/**'],
    rules: {
      'style/semi': ['error', 'always'],
      'style/comma-dangle': ['error', 'never'],
    },
  },
)

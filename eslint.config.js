import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
  },
  {
    ignores: ['/.github/workflows/playwright.yml'],
  },
  {
    files: ['**/*.spec.ts', '**/*.md'],
    rules: {
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'always'],
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/comma-dangle': 'off',
    },
  },
)

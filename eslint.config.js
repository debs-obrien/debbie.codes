import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true
  },
  {
    ignores: ['/.github/workflows/playwright.yml']
  },
  {
    files: ['**/*.spec.ts', '**/*.md'],
    rules: {
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'never'],
      '@typescript-eslint/semi': 'off',
      '@typescript-eslint/comma-dangle': 'off'
    }
  }
)
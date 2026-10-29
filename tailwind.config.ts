import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default <Partial<Config>>{
  content: [
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'App.{js,ts,vue}',
    'app.{js,ts,vue}',
    'Error.{js,ts,vue}',
    'error.{js,ts,vue}',
    'content/**/*.md',
  ],
  darkMode: 'class',

  theme: {
    darkSelector: '.dark',
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: '' },
            'code::after': { content: '' },
          },
        },
      },
      colors: {
        // Text, borders, icons — switches to #ff5a73 in .dark
        'primary': 'rgb(var(--color-primary) / <alpha-value>)',
        // Solid fills with white/light text — stays #d8002d in dark mode
        'primary-fill': 'rgb(var(--color-primary-fill) / <alpha-value>)',
        'secondary': '#333',
        'dark': '#091a28',
        'elevated': '#dfe8ef',
        'linkExactActiveClass': '#fd213b',
      },
      margin: {
        'top-bar': '100px',
      },
      maxWidth: {
        '1/4': '25%',
      },
    },
  },
  variants: {
    backgroundColor: [
    ],
  },
  plugins: [
    typography,
  ],
}

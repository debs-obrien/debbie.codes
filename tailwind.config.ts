import type { Config } from 'tailwindcss';

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
    'content/**/*.md'
  ],
  darkMode: 'class',

  theme: {
    darkSelector: '.dark',
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: '' },
            'code::after': { content: '' }
          }
        }
      },
      colors: {
        primary: '#d8002d',
        secondary: '#333',
        dark: '#091a28',
        elevated: '#dfe8ef',
        linkExactActiveClass: '#fd213b'
      },
      margin: {
        'top-bar': '100px'
      },
      // fontFamily: {
      //   Saira: ['Saira']
      // },
      maxWidth: {
        '1/4': '25%'
      }
    }
  },
  variants: {
    backgroundColor: [
      // 'dark',
      // 'dark-hover',
      // 'dark-group-hover',
      // 'dark-even',
      // 'dark-odd'
    ]
    // borderColor: ['dark', 'dark-focus', 'dark-focus-within'],
    // textColor: ['dark', 'dark-hover', 'dark-active']
  },
  plugins: [
    // require('tailwindcss-dark-mode'),
    require('@tailwindcss/typography')
  ]
};

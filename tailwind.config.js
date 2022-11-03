/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  content: ['./**.{vue,js}'],
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
      fontFamily: {
        Saira: ['Saira']
      },
      maxWidth: {
        '1/4': '25%'
      }
    }
  },

  variants: {
    backgroundColor: [
      'dark',
      'dark-hover',
      'dark-group-hover',
      'dark-even',
      'dark-odd',
      'hover',
      'responsive'
    ],
    borderColor: [
      'dark',
      'dark-focus',
      'dark-focus-within',
      'hover',
      'responsive'
    ],
    textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'responsive']
  },

  plugins: [
    require('tailwindcss-dark-mode'),
    require('@tailwindcss/typography')
  ]
}

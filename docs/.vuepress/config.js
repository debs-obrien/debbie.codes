module.exports = {
  title: 'Frontend Documentation',
  description: 'Everyting you need to know to work on this project',
  logo: '/logo_patterson.svg',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Development', link: '/development' },
      { text: 'Vue', link: 'https://vuejs.org/' },
      { text: 'Nuxt', link: 'https://nuxtjs.org/' },
    ],
    sidebar: [
      ['/', 'Introduction'],
      '/development',
      '/architecture',
      '/tech',
      '/nuxt.config',
      '/package.json',
      '/layouts',
      '/pages',
      '/components',
      '/images',
      '/plugins',
      '/i18n',
      '/pwa',
      '/editors',
      '/linting',
      '/tests',
      '/production',
      '/performance',
      '/troubleshooting',
    ],
    lastUpdated: 'Last Updated', // string | boolean
  },
}

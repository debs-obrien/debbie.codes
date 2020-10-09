---
title: Adding a PWA in Nuxt.js
date: 2020-06-28
description: Most people don't realise how easy it really is to add a PWA with Nuxt.js. Progressive Web Apps (PWA) deliver native-like capabilities, reliability, and installability while reaching anyone, anywhere, on any device with a single codebase.
image: https://images.unsplash.com/photo-1511804074-5e57bc14db9f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
tags: [Nuxt, PWA]
---

Most people don't realise how easy it really is to add a PWA with Nuxt.js. Progressive Web Apps (PWA) deliver native-like capabilities, reliability, and installability while reaching anyone, anywhere, on any device with a single codebase. You can turn your website into a PWA which will give you the benefits of better offline support as well as that app like look and feel. Just save it to the home screen and open it from there and you will see how amazing it is.

The Nuxt.js PWA module registers a service worker for you to deal with offline caching.

- It automatically generates a manifest.json file
- It automatically adds SEO friendly meta data with manifest integration
- It automatically generates app icons with different sizes
- And you can even set up free push notifications using OneSignal

Ok so there is a lot of automatic stuff so what do you need to do exactly?

1. Install the npm package

```bash
yarn add @nuxtjs/pwa
or
npm i @nuxtjs/pwa
```

2. Add the module to your nuxt.config.js file

```javascript
{
  modules: ['@nuxtjs/pwa']
}
```

3. Add an icon.png file to your `static` directory. It should be square and be at least 512px x 512px.

4. In your .gitignore file make sure you ignore the service worker file.

```markdown
sw.\*
```

And that's it you now have a PWA up and running.

You can also further customise the PWA by modifying the title and author or name for example. The module by default adds the `package.json` name and author but you can modify this by creating a `pwa` key in your `nuxt.config.js` file and modifying the `meta` or `manifest` properties.

```javascript
pwa: {
  meta: {
    title: 'My PWA',
    author: 'Me',
  },
  manifest: {
    name: 'Nuxt.js PWAs are so easy',
    short_name: 'Nuxt.js PWA',
    lang: 'en',
  },
}
```

For a full list of meta options for your pwa see [the Nuxt PWA docs](https://pwa.nuxtjs.org/modules/meta.html#mobileappios)

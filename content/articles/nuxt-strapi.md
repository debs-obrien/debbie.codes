---
title: Nuxt Strapi
date: 2021-02-22
published: false
description: When you build your own site sometimes it's important to add analytics to see what is doing well, what your audience is spending time and perhaps find ways of improving your site
image: c_scale,fl_lossy,f_auto,q_auto,w_600/v1611841528/debbie.codes/plausible_laomvr
provider: cloudinary
tags: [Nuxt, Analytics, all]
---

Install the Nuxt Apollo Module

```bash
@nuxtjs/apollo
```

Register the module

```js{}[nuxt.config.js]
modules: [ '@nuxtjs/apollo' ],
```

And add the apollo config with our url to strapi.

```js[nuxt.config.js]
 apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:1337/graphql',
      },
    },
  },
```

A few other things we need to install are graphQL, the graphQL Tag and Apollo Cache Inmemory.

```bash
yarn add graphql graphql-tag apollo-cache-inmemory
```

---
title: Adding Vue Plugins to your Nuxt APP
date: 2021-02-02
description: In Nuxt we can add Vue plugins to our application by creating a Nuxt plugin and then registering that plugin in the Nuxt Config file.
image: https://res.cloudinary.com/debsobrien/image/upload/c_scale,fl_lossy,f_auto,q_auto,w_1200/v1612282619/debbie.codes/blog/vue-plugins_ubadyf.png
video: gAqcW51NwTE
tags: [Nuxt, all]
---

Let's use the [Vue Tooltip plugin](https://github.com/Akryum/v-tooltip) and add it to our Nuxt app so we can have amazing tooltips.

## Install the npm package

For this example i am using the latest version of the library. We can install it either using npm or yarn.

```bash
yarn add v-tooltip@v2.1.2
```

## Create a Nuxt plugin

In order to use Vue plugins we need to create a Nuxt plugin and we do this by creating a .js file in the /plugins folder. We then paste in the code that we need to use the plugin. We import Vue and VTooltip and then tell Vue to use the VTooltip.

```js{}[plugins/v-tooltip.js]
import Vue from 'vue'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)
```

## Register the plugin

Nuxt doesn't automatically register plugins therefore we need to tell Nuxt that the plugin exists. We do this by adding it to the plugins array in our `nuxt.config.js` file.

```js{}[nuxt.config.js]
plugins: ['~/plugins/v-tooltip.js']
```

## Let's add some styles

You can add styles how you wish but the plugin gives us some [styles that we can copy](https://github.com/Akryum/v-tooltip#style-examples) directly and add to a `.css` file which we can put in the assets folder. Then we just have to register the css file by adding it to our Nuxt config.

```js{}[nuxt.config.js]
css: ['~/assets/v-tooltip.css']
```

## Use the Plugin

We can now use the plugin in any of our layouts, pages or components by using the tooltip directive. If we add it to the logo then every time someone hovers over our Logo they will get the tooltip with a message saying 'Nuxt is Awesome'

```html{}[pages/index.vue]
<Logo v-tooltip="Nuxt is Awesome" />
```

![Vue plugin in use](https://res.cloudinary.com/debsobrien/image/upload/c_scale,fl_lossy,f_auto,q_auto,w_1200/v1612282619/debbie.codes/blog/vue-plugins_ubadyf.png)

And that's it. The library itself allows you to do lots of cool things including dynamic messages, add components inside and so much more. Do check out the plugins docs and play around with the [library](<(https://github.com/Akryum/v-tooltip)>).

## Adding Client Side Plugins

if you do use a library that needs access to browser elements such as window or document then you will need to register the plugin only on the client side. This can be done by adding `.client.js` as the file extension to your plugin. This tells Nuxt to not render this plugin on the Server but only on the Client, in the Browser. See the [Nuxt docs](https://nuxtjs.org/docs/2.x/directory-structure/plugins#vue-plugins) for more details.

## Useful Links

- [Vue Tooltip Plugin](https://github.com/Akryum/v-tooltip)
- [Nuxt Vue Plugin Docs](https://nuxtjs.org/docs/2.x/directory-structure/plugins#vue-plugins)
- [Nuxt Vue Plugin Example](https://nuxtjs.org/examples/plugins-vue)

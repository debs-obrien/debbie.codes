---
title: Page and Layout Transitions in Nuxt.js
date: 2020-04-13
description: With Nuxt.js it is really easy to add transitions between your pages. You can create transitions for all your pages or layouts and you can even have different transitions for specific pages.
image: photo-1545986467-13cfe33c156e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
provider: imgix
tags: [nuxt, all]
---

With Nuxt.js it is really easy to add transitions between your pages. You can create transitions for all your pages or layouts and you can even have different transitions for specific pages.

The default Nuxt.js transition name for pages is `page`. That means in order to add a fade transition to every page we just need to add the the word `page` before our enter and leave transition classes that Vue.js gives us.

```css
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
```

You can add this css to a global css file and then import it using the `nuxt.config.js` file.

```javascript
export default {
  css: ['~/assets/main.css']
}
```

Layouts work pretty much the same except that instead of writing a class starting with the word page you use the word `layout`.

```css
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.5s;
}
.layout-enter,
.layout-leave-active {
  opacity: 0;
}
```

You can of course create a transition for a specific page such as the home page for example. In your `index.vue` file you can add a property of transition and give it the name you like.

```javascript
export default {
  transition: 'home'
}
```

This name will then be what you use instead of the word page when defining your transition classes.

```css
.home-enter-active,
.home-leave-active {
  transition: opacity 0.5s;
}
.home-enter,
.home-leave-active {
  opacity: 0;
}
```

Nuxt.js wraps your page in a transition component and adds the name to it. In this case the name it adds is `home`. Basically Nuxt.js does this for you so you don't need to.

```html
<transition name="home"></transition>
```

There is a slight difference in the default mode in Nuxt.js compared to Vue.js. The default mode in Nuxt.js is `out-in`. Should you wish to change this you can do so using the `mode` key.

However if you want to change the mode across all pages or layouts then you can do so in the `nuxt.config.js` file using the `pageTransition` key for pages and the `layoutTransition` key for layouts.

```javascript
pageTransition: {
    name: 'my-page',
    mode: 'out-in'
}
```

As you can see adding page transitions in Nuxt.js is really easy so why not give it a try!

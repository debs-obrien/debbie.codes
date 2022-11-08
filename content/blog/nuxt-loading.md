---
title: Customizing the Nuxt Loading Component
date: 2021-02-16
description: We can customize the Loading for our Client Side applications as well as the loading Progress bar for our server rendered applications and we can even customize this to create our own.
image: photo-1607434472257-d9f8e57a643d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&
provider: imgix
loading: eager
tags: [nuxt]
---

We can customize the Loading for our Client Side applications as well as the loading Progress bar for our server rendered applications and we can even customize this to create our own. Of course if your site is super fast you might need even need to worry about loading bars 🙊.

## Client Side Loading

When running Nuxt on client side, there is no content from the server side on the first page load. So, instead of showing a blank page while the page loads, Nuxt gives you a spinner which you can customize to add your own colours or background and even change the indicator.

With Nuxt the default spinner works out of the box when `ssr` is set to `false`.

```js{}[nuxt.config.js]
export default {
  ssr: false
}
```

If you don't see the spinner then just slow down your internet connection using the network tab in the dev tools.

We can also customize this default spinner. Using the `loadingIndicator` property we can change the colour and the background and we can also change the default `circle` indicator. Nuxt gives us [built in indicators](https://tobiasahlin.com/spinkit/) and we don't have to do anything to use them except change the name for the indicator we want to use. Let's use the `rotating-plane` indicator.

```js{}[nuxt.config.js]
export default {
  ssr: false,
  loadingIndicator: {
    name: 'rotating-plane',
    color: 'blue',
    background: 'red'
  }
}
```

There are many more examples for you to play around with so check out the [docs](https://tobiasahlin.com/spinkit/).

## Loading Bar for SSR

Nuxt gives you a loading progress bar that's shown between routes. We can customize the colour, size, duration and direction of the progress bar and much more. This can be done in the nuxt config file using the `loading` property.

```js{}[nuxt.config.js]
export default {
  loading: {
    color: 'DodgerBlue',
    height: '10px'
  }
}
```

### Disabling the Loading Bar

Should you want to disable this you can set the value to `false`.

```js{}[nuxt.config.js]
export default {
  loading: false
}
```

### Customizing the Loading Bar

You can modify the duration of the loader to be more or less than the default, which is set to 5 seconds. Generally you don't want the loader to keep going when your page has already loaded. However it is not possible for the loading component to know in advance how long loading a page will take and therefore not possible to accurately animate the progress bar to 100% of the loading time.

However we can change the default behavior by setting continuous to true in the `loading` property so it will keep animating when loading takes longer than expected. As soon as the progress bar reaches 100% which we have set to be 3 seconds it will then start shrinking back to 0% again for another 3 seconds and then it will start again until the page finishes loading.

```js{}[nuxt.config.js]
export default {
  loading: {
    duration: 3000,
    continuous: true
  }
}
```

### Creating a Custom Loading Component

However we can improve this further by creating a custom loading component.

```js{}[components/LoadingBar.vue]
<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
</template>
```

In our data property we can set loading to false and add a method with a `start()` method which sets `loading` to `true` and a `finish()` method which sets `loading` to `false`. These 2 methods are required in order for the loader to work. We also have other optional methods `fail(error)` and `increase(num)`.

```js{}[components/LoadingBar.vue]
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>
```

We now need to update our nuxt config to tell it to use our component instead of the default loader by adding our component as the value of the loading property.

```js{}[nuxt.config.js]
export default {
  loading: '@/components/LoadingBar.vue',
...
}
```

And we now have some loading text appearing on our page when the page needs time to load. Of course this can be improved further by adding some styles and a spinner using CSS instead of the loading text.

```js{}[components/LoadingBar.vue]
<template>
  <div v-if="loading" class="loading-page">
    <div class="loading"></div>
  </div>
</template>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
  text-align: center;
  font-size: 3rem;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 4px solid rgba(9, 133, 81, 0.705);
  border-radius: 50%;
  border-top-color: #158876;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
```

And that's it. I hope you have fun creating custom loaders with really cool animations.

## Useful Links

- Nuxt Docs on [Loading](https://nuxtjs.org/docs/2.x/features/loading)
- Built in Indicators from [Spin Kit](https://tobiasahlin.com/spinkit/)
- Custom Loading Component [Example](https://nuxtjs.org/examples/custom-loading-component)

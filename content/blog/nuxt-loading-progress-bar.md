---
title: The Nuxt Loading Progress Bar
date: 2020-04-17
description: Nuxt.js automatically gives you a loading progress bar component which is shown between routes. Did you know you can customise it, disable it or create your own component?
image: photo-1516906158245-7fafb29df119?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop
provider: imgix
tags: [nuxt]
---

Nuxt.js automatically gives you a loading progress bar component which is shown between routes. Did you know you can customise it, disable it or create your own component?

To change the colour for example all you have to do is add the colour you want to the loading property in your nuxt.config.js file.

```javascript
export default {
  loading: {
    color: 'blue'
  }
}
```

There are many other things you can change such as the height, the duration, the direction for rtl sites and if it should keep animating the progress bar when loading takes longer than the duration.

```javascript
export default {
  loading: {
    height: '10px',
    duration: 1000,
    rtl: true,
    continuous: true
  }
}
```

If you don't like the progress bar at all you can disable it completely in the nuxt.config.js

```javascript
export default {
  loading: false
}
```

You can also disable it for a specific page.

```html
<template>
  <h1>About Page</h1>
</template>

<script>
  export default {
    loading: false
  }
</script>
```

And if you want to show loading but don't like the default loading component you can of course create your own. In the components folder create a component called loading.vue.

```html
<template>
  <div v-if="loading" class="loading-page">
    <p>Loading...</p>
  </div>
</template>
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
<style scoped>
  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: yellowgreen;
    text-align: center;
    padding-top: 100px;
    color: red;
    font-size: 80px;
    font-family: sans-serif;
  }
</style>
```

Then in the nuxt.config.js file add the component to the loading property.

```javascript
export default {
  loading: '~/components/loading.vue'
}
```

And that's it you now have your own custom loading component for when changing routes and your content is loading.

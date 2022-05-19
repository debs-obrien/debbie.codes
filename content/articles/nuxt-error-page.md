---
title: Creating an error page in Nuxt.js
date: 2020-04-23
description: An error page is the page you see when you arrive at a page that can't be found. These are typically called 404 pages. To create an error page all you need to do is create an `error.vue` file in your layouts folder. Layouts?
image: photo-1594322436404-5a0526db4d13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop
provider: imgix
tags: [nuxt, errors]
---

An error page is the page you see when you arrive at a page that can't be found. These are typically called 404 pages. To create an error page all you need to do is create an `error.vue` file in your layouts folder. Layouts? Yes, that is correct. Although the error page is a page, it must go inside the layouts folder.

In your `error.vue` page you can keep it simple by just adding a template with some text.

```html
<template>
  <div>
    <p>OOOOPPPPPPS. No page found</p>
  </div>
</template>
```

Or you can print a message depending on the error status which you have access to by using `error.statusCode`.

```html
<template>
  <div>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
  </div>
</template>
```

Don't forget to add the `error prop` so you can use `error.statusCode`.

```html
<script>
  export default {
    props: ['error']
  }
</script>
```

You can also add a layout to your error page just like you can do with any other page.

```html
<script>
  export default {
    layout: 'basic'
  }
</script>
```

So as you can see it is really easy to add an error page yet it is something we normally forget todo. Error pages can also be fun so feel free to add some nice images and don't forget to link back to the home page to make it easier for your users if they end up on your error page.

```html
<NuxtLink to="/">Home page</NuxtLink>
```

Note: Although this page is in the layouts folder you do not use the `<Nuxt />` component in this page.

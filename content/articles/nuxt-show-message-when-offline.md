---
title: Show a message when your user is offline with $nuxt.isOffline
date: 2020-04-20
description: Did you know that `$nuxt.isOffline` can be used to show your users content based on if they are online or not.
image: photo-1588064718670-764b8515b86e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
provider: unsplash
tags: [Nuxt, all]
---

Did you know that `$nuxt.isOffline` can be used to show your users content based on if they are online or not.

By using a `v-if` we can show content based on if a user is offline or online.

In your `layouts/default.vue`

```html
<template>
  <div>
    <div v-if="$nuxt.isOffline">You are offline</div>
    <nuxt />
  </div>
</template>
```

Just by adding that line of code to your app and disabling the internet, either in dev tools or by turning off your internet connection, the message "You are offline will appear".

This won't work on page refresh and it only works when the page has loaded.

So what is it useful for? You could have a cool toast like message that pops out when the user loses internet and say something like "ooopps looks like you just lost your internet connection". This could very useful on payment pages or when filling out large forms for example. You still see the content of the page but are unaware that you have lost the connection.

Then you could have the `$nuxt.isOnline` to show a message that says "yeah you are back online".

```html
<template>
  <div>
    <div v-if="$nuxt.isOnline">Yeah you are online</div>
    <nuxt />
  </div>
</template>
```

I am sure there are many other use cases for this and would love to hear if you have any suggestions or if anyone is actually using it and if so what for.

If you are not using it then go ahead and give it a try. In this example I have added it to the layout but you can add it to a page or even a component. Have fun.

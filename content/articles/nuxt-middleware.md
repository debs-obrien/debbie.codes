---
title: Understanding Nuxt Middleware
date: 2021-02-18
description: Middleware lets you define custom functions that can be run before rendering either a page or a group of pages which we call layouts.
image: https://images.unsplash.com/photo-1446769357257-5aa1b1bfcd65?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80
tags: [Nuxt, Middleware, all]
---

Middleware lets you define custom functions that can be run before rendering either a page or a group of pages which we call layouts. In universal mode, middlewares will be called once on server-side (on the first request to the Nuxt app, e.g. when directly accessing the app or refreshing the page) and on the client-side when navigating to further routes.

When SSR is false, middlewares will be called on the client-side in both situations. Middlewares are executed in series in this order, nuxt config, in the order within the file, followed by matched layouts and then matched pages. A middleware receives [the context](https://nuxtjs.org/docs/2.x/concepts/context-helpers) as the first argument.

In Nuxt we have 3 different ways of writing Middleware. We have Router Middleware, Named Middleware and Anonymous Middleware. Let's take a look at them all.

---

## Router Middleware

We can create a middleware that adds a class to the body using the store and with router middleware we can set the class before we enter the route. We can then use css to style the class depending on the page we are on.

### Setting up the Store for Router Middleware

We first need to set up our store which we can do by simply adding an `index.js` file in the store directory. This will tell Nuxt you want to use the store and it will then be automatically activated and included in your bundle.

In the store we can export state with bodyClass set to an empty string. We then need to setup a mutation called `SET_CLASS` which passes in the state and the bodyClass and sets the `state.bodyClass` equal to the new value of bodyClass.

```js{}[store/index.js]
export const state = () => ({
  bodyClass: ''
})

export const mutations = {
  SetClass(state, bodyClass) {
    state.bodyClass = bodyClass
  }
}
```

### Creating our Router Middleware

In the middleware folder we can create a file which exports a function passing in the store and route from the context. Using the store we commit the mutation of `SET_CLASS` and pass in the name of the route which will then be the value of our new bodyClass.

```js{}[middleware/class.js]
export default function({ store, route }) {
  store.commit('SetClass', route.name)
}
```

### Adding our Middleware to the Router Property

As we want this middleware to be called on every route change we need to add the middleware to the router property in our nuxt config. Using the middleware property we add in the name of the middleware we want to use which in this case is the middleware called class.

```ja{}[nuxt.config.js]
router: {
  middleware: [ 'class' ];
}
```

### Adding the Class to our Layout

In our default layout we need to add our new body class. We do that by adding a dynamic class and passing the `store.state.bodyClass`. Here we add the text body before it just for clarity.

```html{}[layouts/default.vue]
<div :class="[`body-${$store.state.bodyClass}`]"></div>
```

In our browser if we inspect the code we will see we have a body class called `body-index`. Index is being added to the body class by the middleware by reading the route name before it changes the route.

If we add another page, for example an about page, then that page will have a class of `body-about`.

### Adding the Styles for our Page

Then all you need to do is add styles to that class for each route so you can have a different background color for each page, or different font size or whatever you want.

```css{}[assets/main.css]
.body-about {
  background-color: red;
}
```

---

## Named Middleware

We can use named middleware to check if a user is logged in and redirect them if they aren't.

In this middleware we pass in redirect and store from the context. Then we check to see if the variable `isAuthenticated` is not true, meaning the user is not logged in so we redirect them to the page called login.

```js{}[middleware/auth.js]
export default function({ redirect, store }) {
  const isAuthenticated = store.state.auth.user ? true : false
  if (!isAuthenticated) {
    redirect({ name: 'auth' })
  }
}
```

### Setting up the Login Form

We can then create a simple login form that asks the user to submit their username and password and a button that calls a login method when clicked. We also make the button disabled if there is no username or password.

```js{}[pages/auth.vue]
<template>
  <div>
    <form @submit.prevent>
      <label for="username">Username</label>
      <input v-model="user.username" id="username" type="text">
      <label for="password">Password</label>
      <input v-model="user.password" id="password" type="text">
      <button @click="login" :disabled="!user.username || !user.password">Login</button>
    </form>
  </div>
</template>
```

Then in our script tag we need to add our data for our user and set the username and password to an empty string. This value will get updated thanks to `v-modal` that we use in the form. We then need a login method which will commit to the store the value of our username and password once the login button has been clicked.

```js{}[pages/auth.vue]
<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  }
  methods: {
    login(){
      this.$store.commit('auth/setUser', this.user.username)
      this.$store.commit('auth/setPass', this.user.password)
    }
  }
}
</script>
```

And we need to create our login method which will set the value of our user and the value of our password in the store by passing in the data property of the user which uses v-model to bind the input to the data.

### Setting up the Store for Named Middleware

We first set the state of the user and pass to be null and then create a setUser mutation passing in the state of user and making the state equal to the new user value passed in and we do the same for the password.

```js{}[store/auth.js]
export const state = () => ({
  user: null,
  pass: null
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setPass(state, pass) {
    state.pass = pass
  }
}
```

### Adding Named Middleware to our Authenticated Page

In the authenticated page we use the middleware property to add the auth middleware. This means the middleware will be called before entering this page.

```js{}[pages/admin.vue]
<script>
export default {
  middleware: 'auth',
}
</script>
```

### Creating a Logout Method

We can also create a logout button so we can properly test that it is working. The logout button when clicked will call a method called logout.

```html{}[pages/admin.vue]
<button @click="logout">Logout</button>
```

Then in this method we set the value of our user in the store to be null and then use the router push to push the route to the index or home route.

```js{}[pages/admin.vue]
methods: {
  logout () {
    this.$store.commit('auth/setUser', null)
    this.$store.commit('auth/setPass', null)
    this.$router.push({name: 'index'})
    }
  }
```

### Testing it out

Now if we try to access our admin page we are redirected to the login page and once we add a username and password we can login and see our admin page.

We can also see this in the vue dev tools under the vuex options. Our auth of setUser and auth of setPass are called and the user and password are updated.

And if we press logout you will see we are redirected to the home page and the user and password is set to null. Which means our login and logout are working exactly as they should.

Of course this is not a very secure method of adding login as it is not checking if the username or password are correct. This example is just to show you how middleware works.

---

## Anonymous Middleware

If we need to use Middleware only on a specific page we can directly use a function for it instead of creating a middleware file. Let's say we wanted to have a page where the user could see how many times they had visited it.

### Setting up the Store for our Anonymous Middleware

We can set up our store by adding a js file, then Nuxt will know to include the store in the bundle. We can set the state of pageVisits equal to 0 and add a mutation of increment, passing in the state and increasing the page visits by one.

```js{}[store/analytics.js]
export const state = () => ({
  pageVisits: 0
})

export const mutations = {
  increment(state) {
    state.pageVisits++
  }
}
```

Then on whatever page we want we can show the value of our page visits from the store.

```html{}[pages/analytics.vue]
<p>Page visits: {{this.$store.state.analytics.pageVisits}}</p>
```

We then need to add our middleware so that before we render the page this number is updated. We can do that by creating a middleware function and passing in the store from the context. Then we commit to the store our increment mutation from our analytics file which will increment our page visits by one.

```js{}[pages/analytics.vue]
<script>
export default {
  middleware ({ store }) {
    store.commit('analytics/increment')
  }
}
</script>
```

In the browser you will see the number increments every time we open this page.

---

## Useful Links

- [Nuxt Middleware Docs](https://nuxtjs.org/docs/2.x/directory-structure/middleware)
- [Nuxt Context Docs](https://nuxtjs.org/docs/2.x/concepts/context-helpers)
- [Router Middleware Example](https://nuxtjs.org/examples/middleware-router)
- [Named Middleware Example](https://nuxtjs.org/examples/middleware-named)
- [Anonymous Middleware Example](https://nuxtjs.org/examples/middleware-anonymous)

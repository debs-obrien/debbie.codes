# Pages

This is where all our pages live. Every page that is added in here will be automatically code splitted thanks to Nuxt and therefore no router file is needed to maintain routes. As a standard pages should be named with a small letter and then camel casing.

## Dynamic Pages

Dynamic pages start with an `_` and not to be registerd in the generate command of the `nuxt.config`. If we are using `_slug.vue` for the blog then we must remove the `_id.vue` as the id will overwite the slug.

## Code Splitting

In the pages we need to code split our components especially if those components are below the fole or only activated on clicks. This means webpack will create a separte smaller bundle for the javascript of this file making first download much lighter. This is done simple by changing:

```js
import LoginModal from 'components/login_modal.vue'
export default {
  components: {
    LoginModal,
  },
}
```

to:

```js
export default {
  components: {
    LoginModal: () => import('~/components/login_modal.vue'),
  },
}
```

## AsyncData

In our pages we can call our api to get data for our components. Until version 3 of Nuxt is released all api calls must be done at page level.

First import the services component and us the props to refer to the data needed

```js
<template>
      <Services :services="services" />
</template>
```

Import the component if not code splitting

```js
import Services from '~/components/services_posts.vue'
```

Add the component here or use code splitting method as described above. Then call your asyncData with the correct call to the api as is named in the i18n local plugin that we created. [See i18n for more info](/i18n.md).

```js
export default {
  components: {
    Services,
  },
  async asyncData({ $axios, params, route, app }) {
    const services = await app.$api.services.index(app.i18n.locale)
    return {
      services,
    }
  },
}
```

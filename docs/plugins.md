# Plugins

## Installed Plugins

### vue-carousel

We are globally importing vue-carousel even though we should only import it on to the home page due to errors with server side rendering we have had to import it globally. See here more info on [vue-carousel](https://github.com/SSENSE/vue-carousel)

### lazy-load-images

A Vue.js component to lazy load an image automatically when it enters the viewport using the Intersection Observer API. This component is loaded globally so that we have access to it in all components. See here more info on [v-lazy-image](https://github.com/alexjoverm/v-lazy-image)

## Custom Plugins

In the plugin folder we can add plugins from npm or we can create our own custom plugins.

### locales-api.js

Until our api is ready we have included a static db file which is a mock json exactly like the api json. This means that when the api is ready we can remove this line and change the base URL in the nuxt config. We will also have to remove the return db line and replace it the the real axios call.

This plugin works by eporting a function which passes in the context and the injext. We create a `repositoryWithAxios()` and inject the api and all the endpoints that we will use so that we can easily call by that name in our page components.

We then have a `createRepository()` that passes in the axios and returns the resources. The `index(locale)` needs to pass in the locale so that we know which end pont to call depending on which language we require. We do the same for the get function and we can also pass in the id if required.

This plugin was created for us by with Alex Lichter, core team member of Nuxt.

```js
import db from '../db'
export default function(ctx, inject) {
  const repositoryWithAxios = createRepository(ctx)

  inject('api', {
    // here we inject what we need for each api call
    // the param that we pass in is the api endpoint
    // services: repositoryWithAxios('service'),
    services: repositoryWithAxios('services'),
  })
  // if we need to post anything we can do that here
  // $api.post
  // Goal: app.$api.posts.get('slug')
}

// create a repository so we can get what we need from index, get etc with our lang params at end
function createRepository({ $axios, app, req }) {
  return (resource) => ({
    index(locale) {
      // modify this when api is ready and change the base url in nuxt config
      return db[resource][locale]
      // return $axios.$get(`/${resource}?lang=${locale}`)
    },
    get(locale, id) {
      return $axios.$get(`/${resource}/${id}?lang=${locale}`)
    },
  })
}
```

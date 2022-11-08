---
title: Using Apollo to Fetch Data
date: 2020-07-17
description: Using Apollo to Fetch Data from a GraphQL API
image: photo-1516979187457-637abb4f9353?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop
provider: imgix
tags: [nuxt, graphql]
---

```js{}[apollo/client-configs.js]
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// Replace this with your project's endpoint
const GRAPHCMS_API = 'https://debbie-codes.herokuapp.com/v1/graphql'

export default () => ({
  link: new HttpLink({ uri: GRAPHCMS_API }),
  cache: new InMemoryCache(),
  defaultHttpLink: false
})
```

We need to use the graphql-tag to be able to add our query so first we import this import gql from 'graphql-tag' We can then make our query listing all the data that we want to receive and ordering by what we prefer. Here we just added an export const called workshop and make it equal to our gql tag which has a query called workshops and that queries the workshops table.

```js{}[apollo/client-configs.js]
export const workshops = gql`
  query workshops {
    workshops(order_by: { date: desc }) {
      date
      title
      year
    }
  }
`
```

Then we need to use apollo so that we can get our data to our template. Don't forget to first install '@nuxtjs/apollo', and then add to the modules of our next config.

```js{}[apollo/client-configs.js]
apollo: {
    $loadingKey: 'loading',
    workshops: {
      query: workshops,
    },
  },
```

And now we can do a v-for over all our data and print the title for example

```js{}[apollo/client-configs.js]

<div v-for="(workshop, index) in workshops" :key="index" class="flex">
  <p>{{workshop.title}}</p>
</div>
```

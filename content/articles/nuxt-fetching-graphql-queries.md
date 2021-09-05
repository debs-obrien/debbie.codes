---
title: Fetching graphQL queries
date: 2020-07-17
description: Fetching graphQL queries
image: photo-1516979187457-637abb4f9353?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80
provider: unsplash
tags: [Nuxt, GraphQL, Apollo, all]
---

How to fetch data from graphQL without having to use libraries such as apollo

Install [http module](https://http.nuxtjs.org/)

```bash
npm install @nuxt/http
or
yarn add @nuxt/http
```

Add it to the nuxt config

```jsx
module.exports = {
  modules: ['@nuxt/http']
}
```

create a plugin

pass in destructured \$http and env from context

use inject method to inject our plugin so we can use it across our app

create a variable called $hasura  which uses $http using the create helper and pass in the prefixUrl of our api which we can store as an env Variable

set headers for hasura admin secret if needed

inject the key of hasura with the value of $hasura using the $post method and binding our hasura variable

`plugins/hasura.js`

```jsx
export default function({ $http, env }, inject) {
  const $hasura = $http.create({
    prefixUrl: env.API_HASURA_URL
  })

  inject('hasura', $hasura.$post.bind($hasura, ''))
}
```

Add your endpoint as env variable

`nuxt.config.js`

```jsx
export default {
  env: {
    API_HASURA_URL: 'https://debbie-codes.herokuapp.com/v1/graphql'
  }
}
```

import graphql and print so it prints the query

`pages/workshops.vue`

```jsx
import gql from 'graphql-tag'
import { print } from 'graphql/language/printer'
```

make your query using gpl tag

query the table and fields you want to show

`pages/workshops.vue`

```jsx
const QUERY = gql`
  query {
    workshops(order_by: { date: desc }) {
      name
      topic
    }
  }
`
```

use asyncData passing in the destructured app from context

create a variable called data which awaits the function that we created in our plugin which we have access to using app

pass in the query which will print our query

return our data

`pages/workshops.vue`

```jsx
async asyncData({ app }) {
    const { data } = await app.$hasura({
      query: print(QUERY)
    })
    return {
      workshops: data.workshops
    }
  },
```

use our data in the template

`pages/workshops.vue`

```jsx
<ul v-for="(workshop, index) in workshops" :key="index">
    <li>{{workshop.name}}: {{workshop.topic}}</li>
</ul>
```

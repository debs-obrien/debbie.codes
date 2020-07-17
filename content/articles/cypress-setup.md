---
title: Setting up cypress
date: 2020-07-17
---

Install cypress

```bash
yarn add cypress -D
```

open Cypress which will launch the test runner and create the cypress folder in your project with some example tests

```bash
yarn run cypress open
```

Add scripts to package.json

```json
"cy:open": "cypress open",
"cy:run": "cypress run",
"test:e2e:run": "start-server-and-test serve http://localhost:3000 cy:run",
"test:e2e:dev": "start-server-and-test dev http://localhost:3000 cy:open",
```

```bash
yarn add start-server-and-test -D
```

add:

```bash
yarn add eslint-plugin-cypress
```

Add this to .eslintrc to so eslint knows that cypress exists

```json
{
  "plugins": ["cypress"],
  "extends": ["plugin:cypress/recommended"],
  "env": {
    "cypress/globals": true
  }
}
``


add to gitignore

```md
cypress/integration/examples
cypress/videos
cypress/screenshots
```

Setup github workflow:
Create a workflows folder in your .github folder. Inside the workflows folder create a main.yml file and add the following:

```yml
name: End-to-end tests
on: [push]
jobs:
  cypress-run:
    runs-on: ubuntu-16.04
    steps:
      - name: Checkout
        uses: actions/checkout@v1
      # Install NPM dependencies, cache them correctly
      # and run all Cypress tests
      - name: Cypress run
        uses: cypress-io/github-action@v2
        with:
          browser: chrome
          headless: true
          build: npm run generate
          start: npm run serve
          # quote the url to be safe against YML parsing surprises
          wait-on: "http://localhost:3000"

```

In your cypress.json file:

```.json
{
  "baseUrl": "http://localhost:3000",
  "viewportWidth": 1600,
  "viewportHeight": 1400
}
```

Write our first test
```js
describe('The Home Page', () => {
  it('should visit the home page', () => {
    cy.visit(Cypress.config().baseUrl + '/')
  })
})

```

Launch your tests

```bash
yarn test:e2e:run
```

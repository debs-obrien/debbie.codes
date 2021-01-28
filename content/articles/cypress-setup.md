---
title: Setting up cypress
date: 2020-07-17
description: Let's take a look at how you setup Cypress in your Nuxt.js project, setup a github action for continuous integration so that Netlify will run the tests every time your application is building.
image: https://images.unsplash.com/photo-1580982324076-d95230549339?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
tags: [Nuxt, Cypress, all]
---

[Cypress](https://www.cypress.io/) is a great way of testing your frontend application with end to end tests and it is so nice to work with. Writing the tests and making sure they get ran on each build is really important too. Let's take a look at how you setup Cypress in your Nuxt.js project, setup a github action for continuous integration so that Netlify will run the tests every time your application is building.

Once you have already created your Nuxt.js project you can install Cypress as a dev dependency.

```bash
yarn add cypress -D
```

You then need to open Cypress which will launch the test runner and create the cypress folder in your project with some example tests.

```bash
yarn run cypress open
```

In your cypress.json file you can add custom configurations so the viewport is wider and the height depending on your screen or how you want to see your application within the cypress window. We can also set a baseUrl for our test. You will find this file at the root of your project.

```json{}[cypress.json]
{
  "baseUrl": "http://localhost:3000",
  "viewportWidth": 1600,
  "viewportHeight": 1400
}
```

We can now remove the examples folder and create our own test inside the integration folder. This is just a basic test will make visit the home page.

```js{}[home.spec.js]
describe('The Home Page', () => {
  it('should visit the home page', () => {
    cy.visit('/')
  })
})
```

If you have eslint setup you may notice that it is giving you errors and saying that it can't find cypress. To fix this we can install the [eslint plugin for cypress](https://github.com/cypress-io/eslint-plugin-cypress) as a dev dependency.

```bash
yarn add eslint-plugin-cypress -D
```

We then add this to our .eslintrc to tell it to use the cypress plugin and extend the cypress recommended configuration or alternatively you can set your own rules. We also set our env for cypress globals to true to allow certain globals provided by Cypress.

```json{}[.eslintrc]
{
  "plugins": ["cypress"],
  "extends": ["plugin:cypress/recommended"],
  "env": {
    "cypress/globals": true
  }
}
```

We can then setup our [github action](https://github.com/cypress-io/github-action) by creating a workflows folder in our .github folder. Inside the workflows folder create a main.yml file and add the following config with build as the script we want to run from our package.json for building our application and start for the script we want to use to start our application.

```yml{}[.github/workflows/main.yml]
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
          start: npm run start
          # quote the url to be safe against YML parsing surprises
          wait-on: 'http://localhost:3000'
```

When running your tests in CI sometimes the server will continue to execute the next command after signalling to start your server and if the server takes time to boot then Cypress might start to visit your local server before it is ready. You can resolve this by adding this npm package, [start-server-and-test](https://github.com/bahmutov/start-server-and-test), as a dev dependency.

```bash
yarn add start-server-and-test -D
```

Then in our package json we need to create some scripts so that cypress can run. We create the run script the open script and then a test script for when in production passing in the command of the package we just installed and then using the serve command with where our server will be run and then we call the run script that we created.

For development it is pretty much the same except we call the dev script and the cypress open script.

```json{}[package.json]
"cy:open": "cypress open",
"cy:run": "cypress run",
"test:e2e:run": "start-server-and-test start http://localhost:3000 cy:run",
"test:e2e:dev": "start-server-and-test dev http://localhost:3000 cy:open",
```

One thing we need to do before launching our tests in production is to add the videos and screenshots to our .gitignore file. add to gitignore

```md{}[.gitignore]
cypress/videos cypress/screenshots
```

We can now launch your tests to make sure it is working correctly.

```bash
yarn test:e2e:run
```

Once you are happy that everything is working as it should you can push your changes which will trigger the github action. Now in your github repo you can click on the actions tab and watch your action do it's job and you can see if tests are passing.

Then there is just one last step in order to get your tests working with your hosting provider.

If you are using _Netlify_ there is a netlify [plugin for cypress](https://github.com/cypress-io/netlify-plugin-cypress#readme) you can install. In the Netlify dashboard go to the plugins and search for cypress and click install.

Add netlify-plugin-cypress NPM package as a dev dependency to your repository.

```bash
yarn add -D netlify-plugin-cypress
```

Then add a netlify.toml file if you haven't already got one and add the following code which will run the commands on build as well as cache the cypress binary in a local node_modules folder so Netlify caches it and then one the site is built it runs the plugin to test the site.

```toml
[build]
  command = "npm run generate"
  publish = "dist"

[build.environment]
  # cache Cypress binary in local "node_modules" folder
  # so Netlify caches it
  CYPRESS_CACHE_FOLDER = "./node_modules/CypressBinary"
  # set TERM variable for terminal output
  TERM = "xterm"

[[plugins]]
  # local Cypress plugin will test our site after it is built
  package = "netlify-plugin-cypress"

```

And thats it. You can now go to your Netlify builds and watch your tests run and your application build. Now if your tests fail your application won't build. This plugin also tells you if it failed because of the tests so it is really easy to see if it is the cause of your builds breaking.

Note: If you are not using Netlify you can modify your generate script to run your tests once the application has been built.

```json{}[package.json]
"generate": "nuxt generate && cypress install --force && npm run test:e2e:run",
```

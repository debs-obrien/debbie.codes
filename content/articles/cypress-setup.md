---
title: Setting up cypress
date: 2020-07-17
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
    cy.visit(Cypress.config().baseUrl + '/')
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
          start: npm run serve
          # quote the url to be safe against YML parsing surprises
          wait-on: "http://localhost:3000"
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
"test:e2e:run": "start-server-and-test serve http://localhost:3000 cy:run",
"test:e2e:dev": "start-server-and-test dev http://localhost:3000 cy:open",
```

One thing we need to do before launching our tests in production is to add the videos and screenshots to our .gitignore file. 
add to gitignore

```md{}[.gitignore]
cypress/videos
cypress/screenshots
```

We can now launch your tests to make sure it is working correctly.

```bash
yarn test:e2e:run
```

Once you are happy that everything is working as it should you can push your changes which will trigger the github action. Now in your github repo you can click on the actions tab and watch your action do it's job and you can see if tests are passing. 

Then there is just one last step in order to get your tests working with your hosting provider. We need to modify our generate script to generate our application. We then install cypress and then run our test script.

```json{}[package.json]
"generate": "nuxt build && nuxt export && cypress install --force && npm run test:e2e:run",
```

And thats it. You can now go to your Netlify builds and watch your tests run and your application build. Now if your tests fail your application won't build. 

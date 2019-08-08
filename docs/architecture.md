# Architecture

[[toc]]

<!-- ## `_templates`

Generator templates to speed up development. See [the development doc](development.md#generators) for more. -->

<!-- ## `.circleci`

Configuration for continuous integration with [Circle CI](https://circleci.com/). See [the production doc](production.md#from-circle-ci) for more. -->

## `.vscode`

Settings and extensions specific to this project, for Visual Studio Code. See [the editors doc](editors.md#visual-studio-code) for more.

## `assets`

directory contains your un-compiled assets including Sass files, images, and fonts. [Learn more about Assets here](https://nuxtjs.org/guide/assets).

## `components`

Where most of the components in our app will live, including our base components. You can't use either asyncData or fetch in these components. For more info see the page on [components](/components.md).

## `cypress`

All e2e tests using cypress are in here. For more info see the page on [tests](/tests.md).

## `docs`

You found me! :wink: For more info see [here](/docs.md).

## `i18n`

This is where the config for internationalization plugin goes plus all local translations. For more info see the page on [i18n](/i18n.md).

## `layouts`

The layouts directory includes your application layouts. Layouts are used to change the look and feel of your page (for example by including a sidebar).For more info see the page on [layouts](/layouts.md).

## `middleware`

The middleware directory contains your Application Middleware. Middleware lets you define custom functions that can be run before rendering either a page or a group of pages (layouts).

## `pages`

The pages directory contains your Application Views and Routes. The framework reads all the .vue files inside this directory and creates the application router. For more info see the page on [pages](/pages.md).

## `plugins`

The plugins directory contains your Javascript plugins that you want to run before instantiating the root Vue.js Application. This is the place to register components globally and to inject functions or constants. For more info see the page on [customPlugins](/customPlugins.md).

## `static`

The static directory is directly mapped to the server root (/static/robots.txt is accessible under localhost:3000/robots.txt) and contains files that likely won't be changed (i.e. the favicon)

## `store`

The store directory contains your Vuex Store files. The Vuex Store comes with Nuxt.js out of the box but is disabled by default. Creating an index.js file in this directory enables the store.

<!-- ## `tests`

Where all our tests go. See [the tests doc](tests.md) for more. -->

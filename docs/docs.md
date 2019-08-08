# Docs

This project's documentation is using vue-press to create a documentation site that can be launched in development or built so that it can be depoloyed on a server.

The config file in the vuepress folder contains the configurtion of the home page, the navigation and the sidebar. All pages are saved as md files and then generated as static html files. The search funtionality automatically based on the headings of the pages.

```js
# launch docs in development
$ yarn docs:dev

# launch docs in development
$ yarn docs:prod
```

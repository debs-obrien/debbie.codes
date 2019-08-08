# Components

[[toc]]

## Standards and Naming

[Base components](https://vuejs.org/v2/style-guide/#Base-component-names-strongly-recommended) (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with the `Base` prefix.

Components should be named with a capital letter and in camel casing. Names should be very descriptive and if there are smaller components of the same type of component then that part of the name shoudl be first. For example `BookingForm`, `BookingSection`. Components can also go in a folder if there are many that are related to the one thing for example all booking components could go into a booking folder.

## Functional Components

These are components that are presentational or dumb components therefore they do not do much but just modify the UI. These are written with the word functional in the template. They do act a little different when refering to props and slots so keep that in mind when using them. Generally functional comonents are more performant.

```js
<template functional>...</template>
```

## Dropdown Component

The dropdown component is toggled by a click event `@click="toggle"` which calls the toggle method to toggle between show or not show. See below.

```vue
<div @click="toggle">
```

The ul containing the content has a `v-show="isOpen"` and then the content. This is only visible if the `v-show` is true.

```vue
<ul v-show="isOpen">
 ...
 </ul>
```

At the start we need to set `isOpen` to be `false` as we do not want the dropdown to be open until we click.

```js
data: function() {
    return {
      isOpen: false,
    }
  },
```

```js
 methods: {
    toggle: function() {
      this.isOpen = !this.isOpen
    },
  },
```

## Accordian Component

The accordian component is toggled by a click event `@click="toggleItem"` which calls the toggle method to toggle between show or not show. See below.

```vue
<div @click="toggleItem">
```

The div containing the content has a `v-show="show"` and then the named slot inside it. This is only visible if the `v-show` is true.

```vue
<div v-show="show">
  <slot name="content" />
</div>
```

At the start we need to set `show` to be `false` as we do not want the accordian to be open until we click.

```js
data: function() {
    return {
      show: false,
    }
  },
```

```js
 methods: {
    toggleItem: function() {
      this.show = !this.show
    },
  },
```

---
title: Vue Directives
date: 2020-10-16
description: Vue Directives are a great way of doing things like trimming your models or only showing something once. So many cool directives to make your life easier when coding in Vue.
image: photo-1503437313881-503a91226402?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3578&q=80
provider: imgix
tags: [vue, nuxt, all]
---

This taken from Sara Drasner's course on Frontend Masters. I did the original one when I was just learning Vue for the first time. Since then I have worked with Vue for a good few years and there are still things I am learning. These are my notes from the first few lessons. Hope it helps someone else learn something they didn't already know.

## Lazy Models

`v-model.lazy` for when you don't want to it to be always watching for changes and only modify the DOM when you click something for example when you type and then click and it appears on the page only when you click and not as you type.

```html
<input v-model.lazy="msg" />
```

## Trimming your Models

`v-modal-trim` will automatically trim whitespace in your inputs.

```html
<input v-model.trim="msg" />
```

## Making your Models a Number

`v-model-number` will convert any string to a number. We can use `type="number"` but the value of HTML input elements will always return a string and if it can't be parsed with parseFloat() the original value is returned. Therefore using `v-model-number` ensures our input is of type `Number`.

```html
<input v-model.number="age" type="number" />
```

## Only show your Element Once

`v-once` is used to show things only once. If you modify the input text you will not see the results change. The `v-once` will remain showing the same text. When the page re-renders, the element/component and all its children will be treated as static content and skipped.

```html
<span v-once>This will never be updated: {{msg}}</span>
```

## V-pre for Documenting

`v-pre`will not evaluate any text that adds moustache syntax, for example, and will show it exactly as it is written.

```html
<span v-pre>{{ this will not be compiled }}</span>
```

## <pre> tag with `$data`

`<pre>` tag can be used with `{{$data}}` inside it and it will show you all the data you have in your data property of that file/component.

## Click and Mouse Events

`v-on` is the same as `@` symbol and is great for binding events like `click` and `mouseenter`.

```html
<button v-on:click="counter += 1">Add 1</button>
```

You can use a ternary operator inside a click event which is good for showing making sure a counter doesn't go below 0, for example.

```html
<button @click="counter > 0 ? counter -=1 : 0">Add 1</button>
```

You can do multiple bindings which are ideal for games such as `mouseup` and `mousedown` doing different things.

`@mousemove.stop` is comparable to `e.stopPropagation()`.

`@mousemove.prevent` is like `e.preventDefault()`.

`@submit.prevent` will stop the page from refreshing when submitting.

`@click.once` this click event will be triggered once not to be confused with `v-once`. The click event will only be triggered once as opposed to `v-once` where the text will be only rendered once. Good for when you want to stop something from submitting multiple times or something to be clicked and then you don't want the user to be able to keep on clicking, they can but it doesn't keep submitting or doing what it has probably already done

`@click.native` so you can listen to native events in the DOM.

## Key Codes

You can use key codes but this is changing in vue 3 to only use names same as html spec.

## Rendering HTML

`v-html` not recommended if coming from external source.

```html
<div v-html="html"></div>
```

## Rendering Text

`v-text` is the same as using the moustache templates, `{{}}`, and if you want to dynamically update then it is recommended to use moustache templates and not `v-text`

## Example

Example using Directives on [CodePen](https://codepen.io/debs-obrien/pen/PoNMGLJ)

## Unique IDs for `v-for`

Use a library to generate unique ids - [uuid](https://www.npmjs.com/package/uuid), then for `v-for` you will always get a unique id.

---
title: Learning React
date: 2021-03-21
description: Recently I started learning React for my new job. I basically went from being a coding ninja to being a coding newbie. But hey everything can be learnt so here is what I have learnt so far.
image: photo-1581276879432-15e50529f34b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop
provider: imgix
loading: eager
tags: [React, all]
---

Recently I started learning React for my new job. I basically went from being a coding ninja to being a coding newbie. But hey everything can be learnt so here is what I have learnt so far.

## Entering JavaScript Land

Use `{}`to enter JavaScript land. In Vue we use double these so I just need to remember that from now on it's ony one and if I see double `{{}}` it means JavaScript land followed by an object.

```jsx
<h2 style={{ color: 'black' }}>hi</h2>
```

This is easier to understand when there is more than one value in our object.

```jsx
<h2 style={{ color: 'black', padding: '10px' }}>hi</h2>
```

React components are just functions that return something. Normally some html.

```jsx
export default function Button() {
  return <button>click me</button>
}
```

### Functions with Capital Letters

These functions need to be named with a capital letter. Which makes sense as then it is easy for the browser to distinguish between what is html and what is a React component.

```html
<button> // html <button /> // React Component</button>
```

## Using JSX

React components use JSX which basically means we can add dynamic stuff to our html. And of course you can pass props into the component

```jsx
const name = 'Debbie'

export default function Name(name) {
  return <h1> Hi {name}</h1>
}
```

## Return Statements

One thing to watch out for is the return statement. We can return things on one line but if we have more things to return and need more than one line then we must use brackets. And important to remember is that we cannot use a semicolon at the end of the line inside these brackets. If we do it will break.

```jsx
export default function Hi() {
  return (
    <div>
      <h1>Hi</h1>
      <p>welcome to our world</p>
    </div>
  )
}
```

## A Single Root element

Just like in Vue 2 you can't render multiple items such as the example above without wrapping it in the `<div>`. However React gives you an element called a fragment so that you don't have to render a `<div>`. A fragment is just like empty syntax and won't get rendered.

```jsx
export default function Hi() {
  return (
    <>
      <h1>Hi</h1>
      <p>welcome to our world</p>
    </>
  )
}
```

## CamelCase for JSX

With JSX we need to use camelCase and not kebab-case. That means we need to use `backgroundColor` instead of `background-color`. Class is also a reserved name in JavaScript so we can't use it meaning we can't say use `class` for our styling and have to use `className`instead.

```jsx
<h1 className="heading">hi</h1>
```

## Using Dynamic Values in JSX

In vue to add a dynamic value to an image we would bind the `src`attribute by adding a colon before it `:src`but in React we don't bind the attribute but instead the value. We do this by removing the quotes and replacing them with curly brackets `src={}`. If you think about it, it actually makes sense as using curly brackets means we are entering JavaScript land.

```jsx
const image = "https://placekitten.com/112"
<img src={image} className="kitten" />
```

As we are entering JavaScript land by using curly brackets it also means we can concatenate things.

```jsx
const imgUrl = "https://placekitten.com"
<img src={imgURL + '/102'} />
// OR
<img src={`${imgURL}/102`} />
```

## Printing out Lists

Unlike in Vue there is no `v-for`for rendering lists. We need to do this just like we would do in any JavaScript function by using `map()` or `filter()`.

```jsx
const people = ['Debbie', 'Alex', 'Nat']

export default function List() {
  const peopleList = people.map(person => <li key={person}>{person}</li>)

  return <ul>{peopleList}</ul>
}
```

Filtering out Items. Say we wanted to filter out which people were working with which framework. We first need to filter over our array of people to get a new array of only those with 'React' in this case and then map over that new array of 'ReactPeople' to print out each person's name.

```jsx
const people = [
  {
    name: 'Debbie',
    framework: 'React'
  },
  {
    name: 'Alex',
    framework: 'Vue'
  },
  {
    name: 'Nat',
    framework: 'React'
  }
]

const reactPeople = people.filter(person => person.framework === 'React')

export default function List() {
  const peopleList = reactPeople.map(person => (
    <li key={person.name}>{person.name}</li>
  ))

  return <ul>{peopleList}</ul>
}
```

Remember when working with arrow functions there is no return however if you add `{}`then you must add a return statement. Using `{}`also allows you to return more than just one line of code.

Just like in Vue adding a `key`to lists is important. The only difference is that instead of `:key="name"`in React it is `key={name}`. Make sure to keep your keys unique. If you don't set a key React will use the index but if the position changes due to reordering then you will run into some issues.

If you need to pass in anything to a Fragment such as a key value then you need to actually write `<Fragment key={name}>` instead of just using `<>`. You can also use a `<div>` if you prefer.

## Exporting Components

There are 2 ways to export a component. Using named exports or default exports. With default export you can only have one function to export but with named exports you can have more than one. The thing to remember is how you export it affects how you import it. With named exports you must use the same name when importing it. With default exports you can use any name you like.

### Named Exports

```jsx
export function Button() {
  return <button>click me</button>
}
```

```jsx
import { Button } from './button'
```

### Default Exports

```jsx
export default function Button() {
  return <button>click me</button>
}
```

```jsx
import Button from './button'
// or
import MyButton from './button'
```

You can mix having a default export and a named export in the one file but in general this can get confusing so it is best to only stick to either 2 named exports or 2 files with default exports.

## Working with Props

Props are used so parent components can pass information to child components. The props you can pass to html elements are predefined to conform with HTML standards, for example passing an `src` prop to an `<img>`element. But you can pass any props you like to your own components.

When passing in props remember that `({ color, height })` is just using destructuring:

```jsx
function MyImage({ color, height }) {
  return //...
}
```

By destructuring you don't have to do something like this:

```jsx
function MyImage(props) {
  let color = props.color
  let height = props.height
  return //....
}
```

You can specify a default property for a prop using destructuring by adding an `=`.

```jsx
function MyImage({ color, height = 50 }) {
  return //...
}
```

Passing lots of props can get very repetitive and this is where the spread operator comes in `{ ...props }`

```jsx
function Card({ color, height, width, isActive }) {
  return (
    div className="card">
      <Avatar
        color={color}
        height={height}
        width={width}
        isActive={isActive}
      />
    </div>
  );
}
```

Here we just pass in all the props and then use the spread operator to spread them so that the `Avatar` component has access to all the props without having to write them out individually.

```jsx
function Card(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  )
}
```

## React's Children

This is similar to what we call slots in Vue. We pass in the children prop to the function and then use it so that anything rendered inside the Card component will be rendered.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>
}
```

We can then easily use this component to render different components inside. Cruises:

```jsx
export default function Cruises() {
  return (
    <Card>
      <Cruises />
    </Card>
  )
}
```

Flights:

```jsx
export default function Cruises() {
  return (
    <Card>
      <Flights />
    </Card>
  )
}
```

## Conclusion

Understanding how React works is really helpful as well as being able to compare the differences to Vue. Overall React is really just JavaScript and Vue just adds some magic to make things much easier. The more you work with React the easier it gets. Still so much more to learn though. This is just the beginning.

Disclaimer: I am still only learning so if you see anything wrong here then just let me know :)

Courses I am taking to enhance my React Journey:

- Kent C Dodds [React a Beginners Guide](https://egghead.io/lessons/react-a-beginners-guide-to-react-introduction)
- Brian Holt [Complete React v5](https://frontendmasters.com/courses/complete-react-v5/)
- Kent C Dodds [Epic React](https://epicreact.dev/)

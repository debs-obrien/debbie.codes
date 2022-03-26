---
title: Understanding TypeScript
date: 2021-10-06
description: TypeScript is a superset of JavaScript. Any types that are added are not part of the final bundle so really TypeScript is there to make your life easier as a developer.
image: reserve/uZYSV4nuQeyq64azfVIn_15130980706_64134efc6e_o.jpg?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80
provider: imgix
tags: [TypeScript, react, all]
---

TypeScript is a superset of JavaScript. Any types that are added are not part of the final bundle so really TypeScript is there to make your life easier as a developer. It took me years to accept TypeScript. I always wanted to learn it. It was on my long list of todos but I found it complicated and unnecessary and therefore chose not to prioritize it and most importantly not to use it in any of my projects.

Then it got forced upon me and I had no choice but to learn it while at the same time learning a new framework. That was very hard indeed as I wasn't sure if I was learning something React or something TypeScript. Separating the two would have been a whole lot easier.

## Why TypeScript?

But I have to say that once you understand even some of the basics of TypeScript and start to use it in your code it really does make your life easier.

TypeScript is not there to complicate things but to help you not make mistakes. Yes it will scream at you and underline everything in red but it's telling you there is a problem and that if you don't fix it then probably something will break either now or in the future. This is actually really helpful and prevents bugs.

In JavaScript we would just allow anything to happen and fix it later which is never a good idea really. I actually believe that TypeScript should be introduced early in the learning of JavaScript cause trust me, once you use it you won't go back and today more and more codebases are being rewritten in TypeScript so it is by far the future.

## What exactly does TypeScript do?

TypeScript is about checking your types. What do I mean by that? When you have props that you pass down into your components, for example a name prop then this prop should only accept a string. If someone passes it a number then TypeScript will simply not allow it as it checks the types and a number is not the same type as a string. We basically need to define these types when we are passing our props.

```js
const Button = (props: { buttonText: string }) => ({
  <button>{props.buttonText}</button>
})
```

In the above example we pass down props and use the semicolon to define the props. The props are added as an object with the name of the prop followed by a semicolon and the type the prop is allowed to be, which in this case is a string.

## Defining Types

In this post I will be using Types instead of [Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html) which are very similar but have some small differences. There is no right or wrong here so use whatever works best for you.

Types can be defined as any of the primitive values:

- string
- number
- boolean
- [] an array
- string[], an array of strings (change to number for an array of numbers etc)
- "primary" | "secondary", set a specific value
- {}, any type of object

### Defining Object Types

You can get even deeper here and define the shape of an object, for example an object that takes an id of string and a title of string or an array of object types

```js
type Items{
  id: string,
  title: string
}[]
```

This can also be cleaned up further by creating a type of item an then passing that to the array

```ts
type Item = {
  id: string
  title: string
}

type ComponentProps = {
  item: item
  items: items
}
```

### Defining Array Types

We can define an array where all keys have to be a number and the value has to be a string

```js
type Items = {
  [key: number]: string
}
```

Or we could make all keys a string and the value has to be of the type Item which was previously defined.

```js
type Items = {
  [key: string]: Item
}
```

This is a pretty simple way to define the props but you can imagine it getting very hard to manage if there were multiple props so adding the types inline might become a nightmare. This is one of the main reasons why we separate the props

### Defining Function Types

You can also define types for functions:

Function takes no arguments and does not return anything.

```js
type ButtonProps = {
  onHover: () => void
}
```

Passes in the id of type number and returns nothing, eg undefined

```js
type ButtonProps = {
  onChange: (id: number) => void
}
```

Takes an event that is based on clicking the button and returns nothing. Notice the `<HTMLButtonElement>`, this means pass in all the available props that the HTML Button provides so it knows you might want to have access to`event.target` for example.

```js
type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
}
```

When creating functions we can even define the types of what gets passed in as well as what gets returned. However TypeScript is clever enough that it knows if you pass in a as a number and b as a number and you and you return a + b then the return value will be a number so there is not need to define that.

```js
const add = (a: number, b: number): number => {
  return a + b
}
```

## Separating your Types

We previously added our button with the buttonText prop containing the type of string. If our button has more types this would be really hard to maintain. This is one reason why we separate our types from here but also if we do separate them we can then export them and use them in other components.

From this:

```js
const Button = (props: { buttonText: string }) => ({
  <button>{props.buttonText}</button>
})
```

To this:

```js
export type ButtonProps = {
  buttonText: string
}


const Button = (props: ButtonProps) => ({
  <button>{props.buttonText}</button>
})
```

Again we can improve it further by using the names of the props instead of using the props keyword and adding them in curly brackets to destructure them.

```js
export type ButtonProps = {
  buttonText: string
}

const Button = ({buttonText}: ButtonProps) => ({
  <button>{buttonText}</button>
})
```

## Optional Props

To make props optional we can add a question mark to the end of the type. TypeScript will then only check it's type if it is passed in.

```js
export type ButtonProps = {
  buttonText: string
  variation?: 'primary' | 'secondary'
}


const Button = ({buttonText}: ButtonProps) => ({
  <button>{buttonText}</button>
})

// or

const Button = ({buttonText, variation}: ButtonProps) => ({
  <button variation="primary">{buttonText}</button>
})
```

## Improving your Props with Comments

Comments are a great way to help others understand what your props are for.

```js
export type ButtonProps = {
  /**
   * a text for the button
   */
  buttonText: string
  /**
   * the variation of the button
   */
  variation?: 'primary' | 'secondary'
}


const Button = ({buttonText, variation}: ButtonProps) => ({
  <button variation="primary">{buttonText}</button>
})
```

## Adding default Values

Default values can be added to your props by giving it a value as you pass it into the function. Then if someone doesn't define a value for that prop the default will be used.

```js
export type ButtonProps = {
  /**
   * a text for the button
   */
  buttonText: string
  /**
   * the variation of the button
   */
  variation?: 'primary' | 'secondary'
}

// add to cart is the default value of the button text

const Button = ({buttonText = "add to cart", variation}: ButtonProps) => ({
  <button variation="primary">{buttonText}</button>
})
```

## Conclusion

TypeScript might take a bit of extra work at the start as you define your types but that little bit of extra work can really save you some time later on. I highly recommend giving it a try and just starting to slowly introduce it in your codebases.

## Useful Links

- [TypeScript org](https://www.typescriptlang.org/)
- [React && TypeScript on FrontendMasters](https://frontendmasters.com/courses/react-typescript/) by Steve Kinney
- [React && TypeScript Course notes](https://stevekinney.github.io/react-and-typescript/)

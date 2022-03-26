---
title: TypeScript and Children
date: 2022-01-11
description: What happens when we pass in children in React? Children is a special prop that allows us to pass in any type of element. It could be a number, a string, a boolean, an array of elements or even another component. So how can we check the types?
image: photo-1504438190342-5951e134ffee?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80
provider: imgix
tags: [TypeScript, react, all]
---

What happens when we pass in children in React? Children is a special prop that allows us to pass in any type of element. It could be a number, a string, a boolean, an array of elements or even another component. So how can we check the types?

Of course we could define it as any which is basically the same as just not having type checking which defeats the whole purpose of using Typescript.

There are a couple of types we could choose from:

### JSX.Element

Children must be a single JSX element. Doesn't allow multiple children, or strings etc.

```js
type ButtonProps = {
  children: JSX.Element
}
const Button = ({ children }: ButtonProps) => <button>{children}</button>

export function Card() {
  return (
    <Button>
      <span>Click me</span>
    </Button>
  )
}
```

### JSX.Element[]

Allows multiple JSX elements but no strings, numbers etc

```js
type ButtonProps = {
  children: JSX.Element[]
}
const Button = ({ children }: ButtonProps) => <button>{children}</button>

export default function Card() {
  return (
    <Button>
      <span>click me</span>
      <i>svg icon</i>
    </Button>
  )
}
```

### JSX.Element | JSX.Element[]

Allows single or multiple JSX elements but no strings, numbers etc

```js
type ButtonProps = {
  children: JSX.Element | JSX.Element[]
}
const Button = ({ children }: ButtonProps) => <button>{children}</button>

export default function Card() {
  return (
    <Button>
      <span>click me</span>
    </Button>
  )
}
export default function Card2() {
  return (
    <Button>
      <span>click me</span>
      <i>svg icon</i>
    </Button>
  )
}
```

### React.ReactChild

Allows one React element, string or number

```js
type ButtonProps = {
  children: React.ReactChild
}
const Button = ({ children }: ButtonProps) => <button>{children}</button>

export default function Card() {
  return <Button>click me</Button>
}
```

### React.ReactChild[]

Allows multiple React elements, strings or numbers

```js
type ButtonProps = {
  children: React.ReactChild
}
const Button = ({ children }: ButtonProps) => <button>{children}</button>

export default function Card() {
  return (
    <Button>
      click me
      <i>svg icon</i>
    </Button>
  )
}
```

### React.ReactChild | React.ReactChild[]

Allows single or multiple React elements, strings or numbers

```js
type ButtonProps = {
  children: React.ReactChild
}
const Button = ({ children }: ButtonProps) => <button>{children}</button>

export default function Card() {
  return <Button>click me</Button>
}

export default function Card2() {
  return (
    <Button>
      click me
      <i>svg icon</i>
    </Button>
  )
}
```

### React.ReactNode

Allows multiple children, strings, numbers, fragments, portals... We could use the above example but it is a little verbose and ReactNode covers a little more.

```js
type ButtonProps = {
  children: React.ReactNode
}
const Button = ({ children }: ButtonProps) => <button>{children}</button>

export default function Card() {
  return (
    <Button>
      click me
      <i>svg icon</i>
    </Button>
  )
}
```

## Conclusion

And that's it, you now have no excuses for adding type checking for your children.

## Useful Links

- [React and TypeScript Course by Steve Kinney](https://frontendmasters.com/courses/react-typescript/)
- [TypeScript Fundamentals, v3 course by Mike North](https://frontendmasters.com/courses/typescript-v3/)
- [Typescript docs](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript in 50 lessons](https://www.smashingmagazine.com/printed-books/typescript-in-50-lessons/)

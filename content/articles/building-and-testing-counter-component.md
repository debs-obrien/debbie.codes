---
title: Building and Testing a Counter Component
date: 2022-01-12
description: We want to build and test a counter component built with React and TypeScript. So where do we start? Which components do we need to build to create this component and what do we test?
image: v1642010879/debbie.codes/blog/2022/counter_2x_ma1ik6
provider: cloudinary
tags: [Testing, React, all]
---

We want to build and test a [counter component](https://bit.dev/learn-bit-react/ecommerce/ui/product/counter/~code/counter.tsx) built with React and TypeScript. So where do we start? First of all looking at the component I can see it is made up of 2 [button components](https://bit.dev/learn-bit-react/base-ui/ui/button) that increase and decrease the count and an [input component](https://bit.dev/learn-bit-react/base-ui/ui/forms/input) that shows the value of the count.

## Building a Counter Component

![counter component](https://res.cloudinary.com/debsobrien/image/upload/v1642010879/debbie.codes/blog/2022/counter_2x_ma1ik6)

### Importing our Components

As we already have a [button component](https://bit.dev/learn-bit-react/base-ui/ui/button) and [input component](https://bit.dev/learn-bit-react/base-ui/ui/forms/input) already created I will just import them as well as import React and useState and the styles.

```js
import React, { useState } from 'react'
import { Button } from '@learn-bit-react/base-ui.ui.button'
import { Input } from '@learn-bit-react/base-ui.ui.forms.input'
import styles from './counter.module.scss'
```

### Creating our Types

The next thing we need to define is our types for our props. We want the consumer to be able to start the count at any number as well as end it at any number. It might be useful to have a count starting at zero for scoring or 1 for purchasing a product. We also want the consumer to be able to increment and decrement by a given amount such as 1 or 5. And finally we want to have a function that is called when the count is changed.

```js
export type CounterProps = {
  /**
   * min Value of counter
   */
  min?: number,
  /**
   * max Value
   */
  max?: number,
  /**
   * increment value
   */
  increment?: number,
  /**
   * decrement value
   */
  decrement?: number,
  /**
   * a function that registers the count when changed
   */
  onCountChange: (count: number) => void
} & React.HTMLAttributes<HTMLDivElement>
```

### Creating our Component

Next we need to create our component which we call Counter and pass in the props with some default values for the `min`, `max`, `increment` and `decrement`. We then add in the components we need. The Button component has a prop of `counter` which will give us the styling we need for a counter button. It also accepts a prop of `onClick` which will be called when the button is clicked. We can give this the value of `handleClickSubtract` and later we can write the function for it to decrease the count.

Next is our input component which will be of type Number and here we pass in the the `min` and `max` props as well as the value equal to `count` and an `onChange` function that will be called when the value is changed. We will need to create the function for `handleClick` later.

And finally we add our next button component which will be responsible for decreasing the count. This accepts the prop of counter for styling and an `onClick` with the value of `handleClickAdd` which we will create later.

```js
...
export function Counter({
  ...
}: CounterProps) {

  return (
    <div className={styles.counter}>
      <Button counter onClick={handleClickSubtract}>
        -
      </Button>
      <Input
        className={styles.counterInput}
        type="number"
        min={min}
        max={max}
        value={count}
        width="80px"
        onChange={handleClick}
      />
      <Button counter onClick={handleClickAdd}>
        +
      </Button>
    </div>
  )
}
```

Now that we have our component setup visually we need to add functionality to it. We will use the `useState` hook to create a state variable called `count` and set the default to be value of our `min` prop.

### Using State

```js
const [count, setCount] = useState(min)
```

We will also create a function called `handleClickAdd` function that will check to see if the count value is less the the `max` value and if it is then we will increase the count by the `increment` value. It will also call the `onCountChange` function and increment the count. This function is what will let us pass the count value to another component if needed.

### Add Function

```js
function handleClickAdd() {
  if (count < max) {
    setCount(count + increment)
    onCountChange(count + increment)
  }
}
```

### Subtract Function

We then need to do the same for the `handleClickSubtract` function and if the count is greater than the `min` value then we will decrease the count by the `decrement` value as well as call the `onCountChange` function.

```js
function handleClickSubtract() {
  if (count > min) {
    setCount(count - decrement)
    onCountChange(count - decrement)
  }
}
```

### Handle Click Function

Next is our `handleClick` function which will be called when the input value is manually changed. We will check to see if the value is less than the `max` value and if it is then we will set the `count` to the value of the input as well as update the `onCountChange` function.

```js
function handleClick(e) {
  setCount(e.target.valueAsNumber)
  onCountChange(e.target.valueAsNumber)
}
```

### Full Code

And now our counter component is ready to go.

```js
import React, { useState } from 'react'
import { Button } from '@learn-bit-react/base-ui.ui.button'
import { Input } from '@learn-bit-react/base-ui.ui.forms.input'
import styles from './counter.module.scss'

export type CounterProps = {
  /**
   * min Value of counter
   */
  min?: number,
  /**
   * max Value
   */
  max?: number,
  /**
   * increment value
   */
  increment?: number,
  /**
   * decrement value
   */
  decrement?: number,
  /**
   * a function that registers the count when changed
   */
  onCountChange: (count: number) => void
} & React.HTMLAttributes<HTMLDivElement>

export function Counter({
  min = 1,
  max = 20,
  increment = 1,
  decrement = 1,
  onCountChange
}: CounterProps) {
  const [count, setCount] = useState(min)

  function handleClickAdd() {
    if (count < max) {
      setCount(count + increment)
      onCountChange(count + increment)
    }
  }
  function handleClickSubtract() {
    if (count > min) {
      setCount(count - decrement)
      onCountChange(count - decrement)
    }
  }

  function handleClick(e) {
    setCount(e.target.valueAsNumber)
    onCountChange(e.target.valueAsNumber)
  }

  return (
    <div className={styles.counter}>
      <Button counter onClick={handleClickSubtract}>
        -
      </Button>
      <Input
        className={styles.counterInput}
        type="number"
        min={min}
        max={max}
        value={count}
        width="80px"
        onChange={handleClick}
      />
      <Button counter onClick={handleClickAdd}>
        +
      </Button>
    </div>
  )
}
```

## Creating our Compositions

When building our components we need to see what is going on and for this in Bit we use compositions so we can build our component as an independent component and see it in isolation using bits dev server. However if you are not using bit you can just import the component into another component or into your app and see it working there.

Our composition uses our previously created Counter component and also shows what the count value is in a `<p>` tag which of course could be another component. This shows us that our count value is being updated in the UI in real time. We are not passing in any `min` or `max` values here as we want to use the default values but we could create another composition that shows a different counter with different values.

```js
import React, { useState } from 'react'
import { Counter } from './counter'

export const BasicCounter = () => <Counter onCountChange={count => count} />

export function CounterWithSetCount() {
  const [count, setCount] = useState(1)
  return (
    <>
      <Counter
        onCountChange={count => {
          setCount(count)
        }}
      />
      <p>Count is: {count}</p>
    </>
  )
}
```

## Testing Our Counter

The final step is to write some tests for our counter to make sure it works as it should. Of course some would say that you should create the tests first but that's up in which way you want to build things.

In our test file we need to import React, as well as the `render` and `screen` functions from `@testing-library/react` and our `BasicCounter` component. As we want to test the buttons we need to add the `userEvent` method from `@testing-library/user-event`.

```js
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BasicCounter } from './counter.composition'
```

We can then think about what we want to test and write todos for each of them.

```js
it.todo('should render a counter with value of 1')

it.todo('should increase count when plus button is clicked')

it.todo('should decrease count when minus button is clicked')

it.todo('should not decrease to less than 1')
```

We then render our `BasicCounter` component and use the `screen` method with the function of `getByRole`. As we don't know what role is available to us we can use `screen.getByRole('blah')` which shows us that blah doesn't exist but that `spinbutton` does which is the role for our input of type number. We then expect our counter to have the value of 1 which was the min default value.

```js
it('should render a counter with value of 1', () => {
  render(<BasicCounter />)
  basicCounter = screen.getByRole('spinbutton')
  expect(basicCounter).toHaveValue(1)
})
```

Our next test also needs to render the `BasicCounter` component as well as the the Button component with the name `+` and we know that we will also have to render the Button component with the name `-` in the last tests so we can go ahead and create a `beforeEach` function which will render these before each test is called.

```js
let basicCounter
let increaseCount
let decreaseCount

beforeEach(() => {
  render(<BasicCounter />)
  basicCounter = screen.getByRole('spinbutton')
  increaseCount = screen.getByRole('button', { name: '+' })
  decreaseCount = screen.getByRole('button', { name: '-' })
})
```

Our first test will now look like this:

```js
it('should render a counter with value of 1', () => {
  expect(basicCounter).toHaveValue(1)
})
```

Our second test will make sure sure the value starts at 1 and when the button is clicked it will update to 2 using the `userEvent` method.

```js
it('should increase count when plus button is clicked', () => {
  expect(basicCounter).toHaveValue(1)
  userEvent.click(increaseCount)
  expect(basicCounter).toHaveValue(2)
})
```

Our next test will start by calling the `userEvent` method to click the `+` button and then make sure that the value is 2. Now we can test the decrease button by clicking that and making sure the value is back to 1.

```js
it('should decrease count when minus button is clicked', () => {
  userEvent.click(increaseCount)
  expect(basicCounter).toHaveValue(2)
  userEvent.click(decreaseCount)
  expect(basicCounter).toHaveValue(1)
})
```

Our last test will make sure that the value is not less than 1 and when the minus button is clicked it will still have the value of 1 as that is the min value allowed.

```js
it('should not decrease to less than 1', () => {
  expect(basicCounter).toHaveValue(1)
  userEvent.click(decreaseCount)
  expect(basicCounter).toHaveValue(1)
})
```

All our tests are passing and if we break anything in our component our tests will break as well.

### Full Code Example

```js
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BasicCounter } from './counter.composition'

let basicCounter
let increaseCount
let decreaseCount

beforeEach(() => {
  render(<BasicCounter />)
  basicCounter = screen.getByRole('spinbutton')
  increaseCount = screen.getByRole('button', { name: '+' })
  decreaseCount = screen.getByRole('button', { name: '-' })
})

it('should render a counter with value of 1', () => {
  expect(basicCounter).toHaveValue(1)
})

it('should increase count when plus button is clicked', () => {
  expect(basicCounter).toHaveValue(1)
  userEvent.click(increaseCount)
  expect(basicCounter).toHaveValue(2)
})

it('should decrease count when minus button is clicked', () => {
  userEvent.click(increaseCount)
  expect(basicCounter).toHaveValue(2)
  userEvent.click(decreaseCount)
  expect(basicCounter).toHaveValue(1)
})

it('should not decrease to less than 1', () => {
  expect(basicCounter).toHaveValue(1)
  userEvent.click(decreaseCount)
  expect(basicCounter).toHaveValue(1)
})
```

## Conclusion

And that's it. We now have a counter component that works as we would expect and can now be used in the component where it should be used knowing that it will work correctly. Compositions are a great way of seeing the different states of our components and we can then use the composition file to understand what we need to do to make our component work when using it in our next component/app.

![counter component changing on click](https://res.cloudinary.com/debsobrien/image/upload/v1642011045/debbie.codes/blog/2022/counter-couting_zn9mcw.gif)

We should also document our component so that it contains clear instructions and examples which makes it even easier for our consumer to understand what the component does and how to use it. And of course tests make sure our component not only works as expected but also that if we do make any changes to it our tests ensure that it can not be exported if our tests are broken meaning if we do have any breaking changes we can fix our tests and release a new major version of our component.

## Useful Links

- [Counter Component](https://bit.dev/learn-bit-react/ecommerce/ui/product/counter)
- [Counter Component Code](https://bit.dev/learn-bit-react/ecommerce/ui/product/counter/~code/counter.tsx)
- [Counter Component Composition](https://bit.dev/learn-bit-react/ecommerce/ui/product/counter/~code/counter.composition.tsx)
- [Counter Component Tests](https://bit.dev/learn-bit-react/ecommerce/ui/product/counter/~code/counter.spec.tsx)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

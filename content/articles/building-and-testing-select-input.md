---
title: Building and Testing a Select Component
date: 2022-01-10
description: Building a Select component with a Composition to see the component render in isolation as well as Tests using React Testing Library to test the select works on change and shows a new value.
image: v1641812664/debbie.codes/blog/2022/select_2x_g2mbjj
provider: cloudinary
tags: [React, Testing, all]
published: true
---

I have created a component that is actually made up of 2 smaller components, a [Select](https://bit.dev/learn-bit-react/base-ui/ui/forms/select) element and a [Label](https://bit.dev/learn-bit-react/base-ui/ui/forms/label). Together these two components make up a component I have named [`select-size`](https://bit.dev/learn-bit-react/ecommerce/ui/product/select-size) and is the component used in the [demo e-commerce project](https://bit-shoe-store.netlify.app/) I have created in order for users to select the size of the product.

## Building the Select Component

![select-size](https://res.cloudinary.com/debsobrien/image/upload/v1641812664/debbie.codes/blog/2022/select_2x_g2mbjj)

### Importing React, Testing Library and Components

The component is built in React and TypeScript and imports React, useState and the two components needed to build this component as well as the styles.

```jsx
import React, { useState } from 'react'
import { Select } from '@learn-bit-react/base-ui.ui.forms.select'
import { Label } from '@learn-bit-react/base-ui.ui.forms.label'
import styles from './select-size.module.scss'
```

### Prop Types

The props being passed down are the `availableSizes` which is an array of numbers and the `sizeSelected` which is a function that passes in the `size` of the product. As we are using Typescript we first export our types, this ensures our user can only use the types specified such as the array of available sizes can only be a number and not a string.

```jsx
export type SelectSizeProps = {
  /**
   * sizes as an array of numbers
   */
  availableSizes: number[],
  /**
   * a function that registers the selected size.
   */
  sizeSelected: size => void
} & React.SelectHTMLAttributes<HTMLSelectElement>
```

### Passing down Props

We then pass down the props into our SelectSize component as well as `...rest` which gives access to all other props that a html select element can have.

```jsx
export function SelectSize({
  availableSizes,
  sizeSelected,
  ...rest
}: SelectSizeProps) {}
```

### Adding State

Our component uses the `useState` hook to set the size of the product. `size` is the value of the select element and `setSize` is the function that allows us to set a new value. The default state will be the first number of the `availableSizes` array.

```jsx
export function SelectSize({
  availableSizes,
  sizeSelected,
  ...rest
}: SelectSizeProps) {
  const [size, setSize] = useState(availableSizes[0])
}
```

### Using the Select and Label Components

We can now add the return statement to our component and return the Select and Label components that we have imported. The [Label component](https://bit.dev/learn-bit-react/base-ui/ui/forms/label) is pretty straight forward and just adds some styles and the `htmlFor` attribute with the value of `size`. For the [Select component](https://bit.dev/learn-bit-react/base-ui/ui/forms/select) we need to add the `id` of `size`, the className for the styles, and the options for the select component which is equal to the value of the `availableSizes` array.

The Select component takes in a prop of options and will map over the array to give us an `<option>` for each number in the array. We then need an `onChange` function to handle the change for every time the user changes the size. And of course we pass in the `...rest` of the props that a html select element can take.

```jsx
const [size, setSize] = useState(availableSizes[0])
return (
  <div className={styles.selectSize}>
    <Label className={styles.label} htmlFor="size">
      Choose a size:
    </Label>
    <Select
      id="size"
      className={styles.select}
      options={availableSizes}
      onChange={handleChange}
      {...rest}
    />
  </div>
)
```

### Creating the handleChange function

We can now create our `handleChange` function which will set the state of `size` to be the value of the select element as well as call the `sizeSelected` function with the value of the select element.

```jsx
function handleChange(e) {
  setSize(e.target.value)
  sizeSelected(e.target.value)
}
```

### Final Code

The full code for our component will look like this:

```jsx
import React, { useState } from 'react'
import { Select } from '@learn-bit-react/base-ui.ui.forms.select'
import { Label } from '@learn-bit-react/base-ui.ui.forms.label'
import styles from './select-size.module.scss'

export type SelectSizeProps = {
  /**
   * sizes as an array of numbers
   */
  availableSizes: number[],
  /**
   * a function that registers the selected size.
   */
  sizeSelected: size => void
} & React.SelectHTMLAttributes<HTMLSelectElement>

export function SelectSize({
  availableSizes,
  sizeSelected,
  ...rest
}: SelectSizeProps) {
  const [size, setSize] = useState(availableSizes[0])

  function handleChange(e) {
    setSize(e.target.value)
    sizeSelected(e.target.value)
  }

  return (
    <div className={styles.selectSize}>
      <Label className={styles.label} htmlFor="size">
        Choose a size:
      </Label>
      <Select
        id="size"
        className={styles.select}
        options={availableSizes}
        onChange={handleChange}
        {...rest}
      />
    </div>
  )
}
```

---

## Creating Compositions

We now need to make compositions for our component to see the component in action. Compositions are a feature of Bit that allows you to see your component in isolation. If not using Bit then you can create mocks to test your component.

My compositions imports React and useState as well as the component we just created. We then create a `SelectSizeAndShowSelectedSize` component that will render the `SelectSize` component. We first create a const of `sizes` equal to an array of numbers, the sizes the want to show. We then use the `useState` hook to set the state of the `selectedSize` giving it the default of the first value from our sizes array.

Then in our component we make the prop of `sizeSelected` equal to a function that passes in the argument of `size` and sets the state of `selectedSize` to be the value of `size`. This give us access to the value of the size selected so as we can use it in another component.

We also add the value of our `sizes` array to the `availableSizes` prop of the `SelectSize` component.

And finally we add a `<p>` tag with the value of the `selectedSize` so we can see the size of the product updated in the UI as we change it.

```jsx
import React, { useState } from 'react'
import { SelectSize } from './select-size'

export function SelectSizeAndShowSelectedSize() {
  const sizes = [36, 37, 38, 39, 40, 45, 46, 47]
  const [selectedSize, setSelectedSize] = useState(sizes[0])

  return (
    <>
      <SelectSize
        sizeSelected={size => {
          setSelectedSize(parseInt(size))
        }}
        availableSizes={sizes}
      />
      <p>You're selected size is: {selectedSize}</p>
    </>
  )
}
```

We can now see our component works as we would expect it to. As we are building this component using Bit I have a dev server that shows me the component running in isolation. If you are not using Bit then you will need to import it into another component to see it working.

---

### Writing Tests

We can therefore move on to write the tests for this component and use the composition created in order to test it.

### Importing what we need

We are using Testing Library to test our component so we need to import `render, screen, fireEvent` from `@testing-library/react` as well as React from 'react'. We also need to import our composition component as our tests are based on the composition we created earlier.

```jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectSizeAndShowSelectedSize } from './select-size.composition'
```

### Describing our Test

Our test should check that the value changes when the user chooses a new size so we can start with that as a description.

```jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectSizeAndShowSelectedSize } from './select-size.composition'

it('checks value changes when user chooses a new size', () => {})
```

### Rendering our Composition Component

We then render the component we want to test which is the component we created in our composition file which uses our select size component and also adds in a <p> tag with the value of the `selectedSize` so we can see the size of the product selected as we change it.

```jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectSizeAndShowSelectedSize } from './select-size.composition'

it('checks value changes when user chooses a new size', () => {
  render(<SelectSizeAndShowSelectedSize />)
})
```

### Checking what Role Exists

In order to see what role is available can use the `screen.getByRole` function and pass in any string. This will tell us that the role we are looking for doesn't exist but will show us what roles do exist on our component.

```jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectSizeAndShowSelectedSize } from './select-size.composition'

it('checks value changes when user chooses a new size', () => {
  render(<SelectSizeAndShowSelectedSize />)
  const selectSizeAndShowSelectedSize = screen.getByRole('blah')
```

### Getting by Correct Role

As we are running our tests in watch mode we can see that the role `blah` does not exist but it tells us that `combobox` does exist meaning we can use this for our role. We can also pass in the name with the value of the label. This also makes sure we have the correct label. Adding in a regex with `i` at the end means we won't have to worry about case sensitivity.

```jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectSizeAndShowSelectedSize } from './select-size.composition'

it('checks value changes when user chooses a new size', () => {
  render(<SelectSizeAndShowSelectedSize />)
  const selectSizeAndShowSelectedSize = screen.getByRole('combobox', {
    name: /choose a size/i
  })
})
```

### Expecting our Component to Have Correct Value

We now use `expect` to make sure our component has the correct value which will be the default value we set it to. We can see what value this is by first adding in any value such as `0` and seeing our test fail. The failing test will tell us what value it is expecting which should be the first value in our array that we created in the composition file, `36`.

```jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectSizeAndShowSelectedSize } from './select-size.composition'

it('checks value changes when user chooses a new size', () => {
  render(<SelectSizeAndShowSelectedSize />)
  const selectSizeAndShowSelectedSize = screen.getByRole('combobox', {
    name: /choose a size/i
  })
  expect(selectSizeAndShowSelectedSize).toHaveValue('36')
})
```

### Firing an Event and Expecting the Value to Change

As we want to make sure the value is updated when the user chooses a new size we can use the `fireEvent` method with the `change` function passing in what we want to change and what the target is. In our case it is the const of `selectSizeAndShowSelectedSize` and the target is the `value` and we can add in what value we want to change it to. We then use the `expect` method to make sure the value has been updated correctly to the new value of the `fireEvent`.

```jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectSizeAndShowSelectedSize } from './select-size.composition'

it('checks value changes when user chooses a new size', () => {
  render(<SelectSizeAndShowSelectedSize />)
  const selectSizeAndShowSelectedSize = screen.getByRole('combobox', {
    name: /choose a size/i
  })
  expect(selectSizeAndShowSelectedSize).toHaveValue('36')
  fireEvent.change(selectSizeAndShowSelectedSize, { target: { value: '45' } })
  expect(selectSizeAndShowSelectedSize).toHaveValue('45')
})
```

---

## Conclusion

And that's it. We now have a select component that works as we would expect and can now be used in the component where it should be used knowing that it will work correctly. Compositions are a great way of seeing the different states of our components and we can then use the composition file to understand what we need to do to make our component work when using it in our next component/app.

![select element changing size on click](https://res.cloudinary.com/debsobrien/video/upload/v1641812321/debbie.codes/blog/2022/select-on-change_bvkj1x.gif)

We should also document our component so that it contains clear instructions and examples which makes it even easier for our consumer to understand what the component does and how to use it. And of course tests make sure our component not only works as expected but also that if we do make any changes to it our tests ensure that it can not be exported if our tests are broken meaning if we do have any breaking changes we can fix our tests and release a new major version of our component.

## Using the Component

The [select size component can be found here](https://bit.dev/learn-bit-react/ecommerce/ui/product/select-size) and is fully open source meaning you can install it in your own project using bit, npm or yarn so feel free to take it for a test drive.

```bash
bit install @learn-bit-react/ecommerce.ui.product.select-size

npm i @learn-bit-react/ecommerce.ui.product.select-size

yarn add @learn-bit-react/ecommerce.ui.product.select-size
```

## Useful Links

- [Select Size Component](https://bit.dev/learn-bit-react/ecommerce/ui/product/select-size)
- [Select Size Component Code](https://bit.dev/learn-bit-react/ecommerce/ui/product/select-size/~code/select-size.tsx)
- [Select Size Component composition](https://bit.dev/learn-bit-react/ecommerce/ui/product/select-size/~code/select-size.composition.tsx)
- [Select Size Test File](https://bit.dev/learn-bit-react/ecommerce/ui/product/select-size/~code/select-size.spec.tsx)
- [Testing Library Docs](https://testing-library.com/docs/)
- [docs for useState()](https://beta.reactjs.org/reference/usestate)

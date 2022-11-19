---
title: Testing a Sites Color Mode with Playwright
date: 2022-09-03
description: My site has a color mode option to change from light theme to dark theme or sepia theme or use the system preference. So how can we write a test to make sure this all works?
image: v1662280533/debbie.codes/blog/2022/testing-color-mode_j9i7sj.png
ogImage: https://res.cloudinary.com/debsobrien/image/upload/f_webp,q_80,c_fit,w_480/v1662280533/debbie.codes/blog/2022/testing-color-mode_j9i7sj.png
provider: cloudinary
tags: [testing, playwright]
published: true
loading: eager
---

My website uses the Nuxt color mode module to allow the user to change the theme of the site. The user can choose between light, dark, sepia or use the system preference. Take a look at the color mode at the bottom of this page to see it in action.

I wanted to write a test to make sure that the color mode is working as expected especially after it stopped working due to an update and I only found out after someone sent me a DM on Twitter to tell me. Funnily enough I had actually written a test for this but it was not working as expected. I wasn't testing everything I should so although the user was changing the theme to light mode, the message from the color picker was saying light mode but the html class was not updating and therefore the theme was not changing. It was time to write better tests.

## Getting Started

First [install Playwright](https://playwright.dev/docs/intro) and then import `test` and `expect` from Playwright's test runner. Playwright uses the expect library from Jest so you can use the same matchers as you would in Jest.

Before each test we want to go to the home page and test from there as the color mode module is not available on all pages. We can do this by adding a `beforeEach` function and then calling `page.goto` to go to the home page.

```js
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})
```

## Setting the Base

I have set the Base URL in the `playwright.config` file as the `localhost: 8888`. The port is 8888 as that is the port I have set in my `package.json` file in the dev script using `--port 8888`.

```js
const config: PlaywrightTestConfig = {
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:8888'
  }
}
```

## Running the Nuxt server

I am running my tests on a local build rather than a staging or preview environment so in order to set this I add the following to my `playwright.config` file.

```js
const config: PlaywrightTestConfig = {
  /* Run your local dev server before starting the tests */
  webServer: process.env.CI
    ? {
        command: 'yarn dev',
        port: 8888,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI
      }
    : undefined
}
```

## Testing light mode

Next we can test the color mode picker starting with a `describe` block where we will add all our tests. Our first test will test the page in light mode. We use locators to find an element on a page and selectors to select the `aria-label` selector as this also tests our accessability. We then expect the locator with the text of color mode to have the text of light and expect it to be visible on the page.

```js
test.describe('Color Picker', () => {
  test('shows page in light mode', async ({ page }) => {
    await page.locator('[aria-label="light mode"]').click()
    await expect(page.locator('text=color mode >> text=light')).toBeVisible()
  })
})
```

## Testing the HTML class

This test will work but really is only testing that the text updated on the page. What if the css class never updated which is what happened on my site. The module adds a css class of 'light' or 'dark' to the html element but you may have something in your config file that stops this from updating or the module might have changed. So how can we make sure the css class is also giving us the right mode? We can do this by using a selector to select the html element and check it contains an attribute with the class of 'light'.

```js
test.describe('Color Picker', () => {
  test('shows page in light mode', async ({ page }) => {
    await page.locator('[aria-label="light mode"]').click()
    await expect(page.locator('text=color mode >> text=light')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'light')
  })
})
```

## Testing dark mode and sepia

Now we can do the same for dark mode and sepia mode.

```js
test('shows page in dark mode', async ({ page }) => {
  await page.locator('[aria-label="dark mode"]').click()
  await expect(page.locator('text=color mode >> text=dark')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('class', 'dark')
})

test('shows page in sepia mode', async ({ page }) => {
  await page.locator('[aria-label="sepia mode"]').click()
  await expect(page.locator('text=color mode >> text=sepia')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('class', 'sepia')
})

```

## Testing system preference

And finally we need to test our system preference. If the user has their system set to dark mode then the page should change to dark mode when the system preference icon is selected or light mode if the system preference is light mode. So how can we test this? We can emulate the color scheme by telling your test to use the `colorScheme` property and set it to the value you require which in our case is dark. This will now emulate the users color preference to dark mode and we can now test that the page is in dark mode when clicked.

```js
test.use({ colorScheme: 'dark' })

test('shows page in system mode', async ({ page }) => {
  await page.locator('[aria-label="system mode"]').click()
  await expect(
    page.locator('text=color mode >> text=system (dark mode detected)')
  ).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('class', 'dark')
})

```

## Final Test

Our final test now looks like this.

```js
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Color Picker', () => {
  test('shows page in light mode', async ({ page }) => {
    await page.locator('[aria-label="light mode"]').click()
    await expect(page.locator('text=color mode >> text=light')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'light')
  })

  test('shows page in dark mode', async ({ page }) => {
    await page.locator('[aria-label="dark mode"]').click()
    await expect(page.locator('text=color mode >> text=dark')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'dark')
  })

  test('shows page in sepia mode', async ({ page }) => {
    await page.locator('[aria-label="sepia mode"]').click()
    await expect(page.locator('text=color mode >> text=sepia')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'sepia')
  })

  test.use({ colorScheme: 'dark' })

  test('shows page in system mode', async ({ page }) => {
    await page.locator('[aria-label="system mode"]').click()
    await expect(
      page.locator('text=color mode >> text=system (dark mode detected)')
    ).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'dark')
  })
})
```

## Checking it works

You can run the tests to see if the tests fail but if you want to see the page open while tests are running to visually see the color mode change then I suggest using the VS Code Extension. From there you can select to show browsers and then run the tests from VS Code. Then modify the test to change the color scheme and run the test again to see the page in the browser with the new color scheme.

<video width="auto" height="auto" controls>
  <source src="https://res.cloudinary.com/debsobrien/video/upload/f_auto,q_auto/f_auto,q_auto/v1662282584/debbie.codes/blog/2022/color-mode-demo_vsikkn" type="video/mp4">
  <source src="https://res.cloudinary.com/debsobrien/video/upload/f_auto,q_auto/f_auto,q_auto/v1662282584/debbie.codes/blog/2022/color-mode-demo_vsikkn" type="video/ogg">
Your browser does not support the video tag.
</video>

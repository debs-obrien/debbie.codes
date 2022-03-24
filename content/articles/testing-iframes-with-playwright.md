---
title: Testing iframes with Playwright
date: 2022-03-24
description: Have you ever had to test something in an iframe on your page with end to end testing? Even testing the play button of an embedded video used to be difficult but then along came Playwright. Let's take a look at how Playwright can help you test iframes.
image: v1648106423/debbie.codes/blog/2022/codegen_2x_psrpgk.png
provider: cloudinary
tags: [Testing, all]
published: true
---

Have you ever had to test something in an iframe on your page with end to end testing? Even testing the play button of an embedded video used to be difficult but then along came [Playwright](https://playwright.dev/), reliable end-to-end testing for modern web apps. Let's take a look at how Playwright can help you test iframes.

If you are new to testing with Playwright, you might want to check out my previous post [Getting Started with Playwright](https://debbie.codes/blog/getting-started-with-playwright-testing) to get a better understanding of how Playwright works and how to easily get started with this amazing tool.

## Locators

Before we dive into testing iframes let's first understand how Playwright works when it comes to using [locators](https://playwright.dev/docs/locators).

A locator is a way to find element(s) on the page at any moment with built in auto-waiting and retry-ability. That means no set timeouts are needed as Playwright will auto wait for the element to appear, including iframes.

Locators are created with the `page.locator(selector[, options])` method.

![diagram showing locators in use](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1648135568/debbie.codes/blog/2022/locators_2x_kjg4xn.png)

### Strict by default

Locators are strict by default meaning it will throw an error if it finds more than one.

```js
await page.locator('button').click()
```

So imagine this scenario where we have many buttons on the page. If there is more than one button element on the page then the test will fail as it won't know which button you want it to click on.

![page showing multiple card components with the same button](https://res.cloudinary.com/debsobrien/image/upload/v1648135760/debbie.codes/blog/2022/home-page-button-example_2x_rrjtm5.png)

### Locators + first

There are many ways to fix this but one example is to choose the first instance of the button.

```js
await page.locator('button').first().click()
```

### Locators + nth-child

Another option is to use the CSS `nth-child` selector. This will select the element that is the nth-child of it's parent. In this case the first one.

```js
await page.locator('div:nth-child(1) button').click()
```

### Locators + hasText

Another options is using `HasText` which is case insensitive substring matching and accepts both strings and regular expressions. This means we can search in every div with the class of 'shoes-card' and find the one which has the text 'Guchi' and locate the button inside of it.

```js
await page
  .locator('.shoes-card', { hasText: 'Guchi' })
  .locator('button')
  .click()
```

### Locators + has:

Another option similar to the one above is to use the `has:` option which makes sure it contains another locator inside of it.

```js
await page
  .locator('.shoes-card', { has: page.locator('text=Guchi') })
  .locator('button')
  .click()
```

To show you another example of this in action we have a shopping cart page with items in a cart. We want to select the remove from cart button to make sure we can remove a specific item from the cart.

Again we use the `has:` option to find the row that has the a locator this time using the image alt selector with the value of 'Guchi'. Our locator now concentrates only inside this one row and locates the button with the aria label of remove from cart. Again we need to be careful of strict mode and ensure we really only have one image alt with the value of 'Guchi' otherwise our test will fail.

![code example showing a shopping cart rows with an arrow pointing to the button of only one row](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1648137581/debbie.codes/blog/2022/has-locator_2x_wlg69v.png)

## Frame Locators

When testing iframes we can use the FrameLocator which allows us to retrieve the iframe and locate elements inside that iframe. For example we could test a play or pause button from a youTube video embedded on your page.

![page with a youtube iframe and dev tools open showing the code](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1648137047/debbie.codes/blog/2022/iframe_2x_qqetp2.png)

FrameLocator can be created with either `page.frameLocator(selector)` or `locator.frameLocator(selector)` method.

```js
await page.frameLocator('iframe').locator('[aria-label="Pause"]').click()
```

Just like with locators, Frame locators are also strict so this test will throw an error if it finds more than one iframe on the page.

## Conclusion

And thats how you can use locators and frame locators to test iframes on a page. Have fun testing and as always reach out if you have any questions or comments.

## Useful Links

- [Playwright docs](https://playwright.dev/)
- [Codegen](https://playwright.dev/docs/cli#generate-code)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [FrameLocator](https://playwright.dev/docs/api/class-framelocator)
- [Getting Started with Playwright](https://debbie.codes/blog/getting-started-with-playwright-testing)

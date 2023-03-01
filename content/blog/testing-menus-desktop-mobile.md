---
title: Testing Menus on Desktop and Mobile
date: 2023-03-01
description: We can write a simple test to make sure that when a user clicks on an item in the menu it takes them to the correct page. To test my website I use Playwright which I already have installed. Let's take a look at how to test the menu on desktop and mobile.
image: photo-1510267413785-9d9e64460cde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&q=80
ogImage: https://unsplash.com/photo-1510267413785-9d9e64460cde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&q=80
provider: imgix
tags: [playwright, testing]
published: true
---

We normally all have a menu on our website so we can link from one page to another. For example on my website the menu links to the about page, videos page, podcasts page, courses page and blog page. We can write a simple test to make sure that when a user clicks on an item in the menu it takes them to the correct page. To test my website I use [Playwright](https://playwright.dev/) which I already have installed. Let's take a look at how to test the menu on desktop and mobile.

## Testing the menu on desktop

Playwright has a great way of easily getting started with testing by using the test generator. I normally use the [Playwright VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) to generate my tests. Then I simply open the the testing sidebar and click on record new. This will create a `test-1.spec.ts` file which I can later rename to `navigation.spec.ts`. 

By clicking on the record new button a browser window will appear where I can add in the URL that I want to test which in this case is `debbie.codes`. Playwright will record your user actions and generate the test code for you so basically in the browser window you can click on the about link in the menu and it will generate the code for you. 

```js
import { expect, test } from '@playwright/test';

test(`test`, async ({ page }) => {
  await page.goto('/debbie.codes');
  await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
})
```

From here we can simply modify the test to actually assert something. For example we can assert that the URL is correct once the click action has happened. We can also change the title and modify the `page.goto` to just be `/` instead of `/debbie.codes` as we have the base URL set in the `playwright.config.ts` file.

```js
import { expect, test } from '@playwright/test';

test(`menu links to about page`, async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/about/);
})
```

### Creating a loop

We could repeat this whole process for each link in the menu. However, we can make this a lot easier by using a loop. We can create an array of the links we want to test and then loop over them. This way we can test all the links in the menu with just a few lines of code.

```js
import { expect, test } from '@playwright/test';

const links = ['about', 'videos', 'podcasts', 'blog', 'courses']

test(`menu links to ${link}`, async ({ page }) => {
  await page.goto('/');

  for (const link of links) {
    await page.getByRole('navigation').getByRole('link', { name: link }).click();
    await expect(page).toHaveURL(link);
  }
})
```

We now have a very simple test that will test all the links in the menu. We can run this test by clicking on the play button in the testing sidebar. This will run the test with the browser opened once we have **show browser** checked in our testing sidebar in VS Code.

## Testing the menu on desktop

So what happens when we want to run this test on mobile? Setting up testing on mobile viewports is easily done through the Playwright config. There are two examples in the projects array already commented out so we can just uncomment them. This means our tests will now run on these mobile viewports as well as the default desktop browsers.

```js
projects: [
  // ...
  /* Test against mobile viewports. */
  {
    name: 'Mobile Chrome',
    use: {
      ...devices['Pixel 5'],
    },
  },
  {
    name: 'Mobile Safari',
    use: {
      ...devices['iPhone 12'],
    },
  },
]
``` 

The [Playwrigh VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) runs on 'Chromium' by default but we can change this to run on one of our mobile projects by clicking on the arrow next to the play button at the top of the testing sidebar and then clicking on **select the default profile**. Here we can choose 'Mobile Safari'. Now when we run our test in VS Code it will use the mobile Safari browser.

When we run the test we will see that the test fails. This is because the menu is hidden on mobile viewports and we need to click on the hamburger menu to open and see the navigation links. So how do we tell Playwright to click on the hamburger if the viewport is mobile?

### isMobile Fixture

We can use the `isMobile` fixture, first passing it into our test function beside the `page` fixture. We can the write an if statement to check if the viewport is mobile and if it is then we can click on the hamburger menu. To find the right locator for the hamburger menu we can either use the **pick locator** option or we can use the **record from cursor** which will record us clicking ont the hamburger menu and generate the locator for us right where our cursor is located in the test.

```js
if(isMobile){
  await page.getByRole('button', { name: 'open menu' }).click();
}
```

### Adding a describe block and beforeEach block

We can tidy up the code a little by adding a `describe` block and a `beforeEach` block. The `describe` block will group all the tests together and the `beforeEach` block will run before each test. We can then move the `if` statement into the `beforeEach` block so that it runs before each test.


```js
test.describe('main navigation', () => {

  test.beforeEach(async ({ page, isMobile }) => {
    if(isMobile){
      await page.getByRole('button', { name: 'open menu' }).click();
    }
  });

  for (const link of links) {
    test(`menu links to ${link}`, async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: link }).click();
      await expect(page).toHaveURL(link);
    })
  }
})
```

Now clicking on the play button we will see the test passes on mobile. To now check it works on desktop we can either change the default profile back to 'Chromium' or select all profiles and run the test again which will now run it on both mobile and desktop.

Normally when I want to run tests on all projects I will use the command line. `npx playwright test` which will run my tests in headless mode meaning I won't see a browser window open. This can be a little quicker when developing and it will give me a nice report at the end of it so I can investigate if one of the tests failed.


## Useful Links

- [Playwright docs](https://playwright.dev/)
- [Playwright VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [Navigation Test file](https://github.com/debs-obrien/debbie.codes/blob/master/tests/navigation.spec.ts)

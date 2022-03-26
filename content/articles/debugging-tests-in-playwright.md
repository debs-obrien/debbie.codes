---
title: Debugging Tests in Playwright
date: 2022-03-25
description: Let's take a look at some of the ways you can debug your tests in Playwright should they fail. Playwright scripts work with existing debugging tools, like Node.js debuggers and browser developer tools. Playwright also introduces new debugging features for browser automation.
image: v1648217584/debbie.codes/blog/2022/running-tests_2x_twjt1c.png
provider: cloudinary
tags: [testing, all]
published: true
---

Playwright scripts work with existing debugging tools, like Node.js debuggers and browser developer tools. Playwright also introduces new debugging features for browser automation.

If you are new to testing with Playwright, you might want to check out my previous post [Getting Started with Playwright](https://debbie.codes/blog/getting-started-with-playwright-testing) to get a better understanding of how Playwright works and how to easily get started with this amazing tool.

Let's take a look at some of the ways you can debug your tests should they fail.

## Running Tests

### VS Code

Once you have generated your code using codegen and pasted it into your test file in VS Code you can then run the test by pressing the green triangle next to the line where your test starts. Playwright will run through each step of the test and show you that the test passed.

<!-- <a href="https://res.cloudinary.com/debsobrien/video/upload/v1648208896/debbie.codes/blog/2022/running-tests_l4uye7.mp4" title="video showing tests running in vscode"><img src="https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1648209250/debbie.codes/blog/2022/runing-tests_2x_mzi8ng.png" alt="Video showing tests running in vs code" /></a> -->

<video width="auto" height="auto" controls>
  <source src="https://res.cloudinary.com/debsobrien/video/upload/v1648208896/debbie.codes/blog/2022/running-tests_l4uye7.mp4" type="video/mp4">
  <source src="https://res.cloudinary.com/debsobrien/video/upload/v1648208896/debbie.codes/blog/2022/running-tests_l4uye7.ogg" type="video/ogg">
Your browser does not support the video tag.
</video>

### CLI

Alternatively you can run the tests using the following command which will run the test in headed mode meaning you will see the output of the test only in the terminal.

```bash
npx playwright test
```

If you want to run the test in headed mode you can add the '--headed' flag to the command. This will open a browser window where you will see Playwright run through each step of the test. Be wared though as tests are super fast so it will literally flash before your eyes. Later we will look at how to stop the test so the browser window stays open.

```bash
npx playwright test --headed
```

## Breaking Tests

As we have written a perfect test it is no fun, as the test passes. Lets make the test fail so we can debug it. In this example I will change the locator text from Women to Men. When creating this example I expected the test to break on line 9 which should now look for an incorrect route but my test actually broke before it even got to that line. Take a look and see for yourself.

<!-- <a href="https://res.cloudinary.com/debsobrien/video/upload/v1648210220/debbie.codes/blog/2022/failing-tests_nz5bkj.mp4" title="video showing tests failing in vscode"><img src="https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1648210313/debbie.codes/blog/2022/tests-failing_2x_ue6rrj.png" alt="Video showing tests failing in vs code" /></a> -->

<video width="auto" height="auto" controls>
  <source src="https://res.cloudinary.com/debsobrien/video/upload/v1648210220/debbie.codes/blog/2022/failing-tests_nz5bkj.mp4" type="video/mp4">
  <source src="https://res.cloudinary.com/debsobrien/video/upload/v1648210220/debbie.codes/blog/2022/failing-tests_nz5bkj.ogg" type="video/ogg">
Your browser does not support the video tag.
</video>

The error messaging from VS Code is very clear and it is telling us exactly why it broke.

![error message for broken tests](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1648217584/debbie.codes/blog/2022/running-tests_2x_twjt1c.png)

The reason is strict mode, which we looked at in a [previous post](https://debbie.codes/blog/testing-iframes-with-playwright). With strict mode you can only have one instance and as the word Men can also be found in the word Women. Playwright doesn't know which one to select and so fails.

VS Code gives us two options to solve this which are, to use the word Women, or to use selectors and select the first child of the element that has the text Men. In our case the Text men is the first instance of the nav bar and therefore it will select that.

```js
await page.locator('Text=Men >> nth=0').click()
```

Once we have added this we can rerun the test and now it will fail on the url as we expected.

## Debugging Tests

If we want to visualize what is going on when the test fails we can add a breakpoint right in VS Code itself. You can do this by clicking next to the line where you want to add the breakpoint. You should see a red dot once the breakpoint is added. Then right click on the green triangle and choose 'run in debug mode'. This will open a browser window and show us what is happening at that breakpoint.

In this example it will show us that the test has issues with the text 'Men' as it appears in both 'Men' and 'Women'. If we add the word 'hello' in our editor we won't see anything highlighted in the browser as there is no word 'hello' on our page. However if we change it to the word 'Children' then we will see in our browser that Children is selected.

<!-- <a href="https://res.cloudinary.com/debsobrien/video/upload/v1648211390/debbie.codes/blog/2022/debugging-tests_mze1rs.mp4" title="video showing debugging tests in vscode"><img src="https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1648211568/debbie.codes/blog/2022/debugging-tests_2x_up8f32.png" alt="Video showing debugging tests in vs code" /></a> -->

<video width="auto" height="auto" controls>
  <source src="https://res.cloudinary.com/debsobrien/video/upload/v1648211390/debbie.codes/blog/2022/debugging-tests_mze1rs.mp4" type="video/mp4">
  <source src="https://res.cloudinary.com/debsobrien/video/upload/v1648211390/debbie.codes/blog/2022/debugging-tests_mze1rs.ogg" type="video/ogg">
Your browser does not support the video tag.
</video>

You can use the buttons in VS Code to step through the test, replay the test etc. Don't forget to set a breakpoint when running in debug mode otherwise it will quickly open the browser window and close it again as there is nothing to debug.

## Conclusion

Being able to interact directly with your code and see the selectors highlighted is pretty cool and extremely useful for debugging. It also makes debugging fun. Check out the [debugging docs](<(https://playwright.dev/docs/debug)>) for more options of debugging including the `page.pause()` method.

## Useful Links

- [Playwright docs](https://playwright.dev/)
- [Codegen](https://playwright.dev/docs/cli#generate-code)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [Debugging in Playwright](https://playwright.dev/docs/debug)
- [Getting Started with Playwright](https://debbie.codes/blog/getting-started-with-playwright-testing)

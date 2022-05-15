---
title: Testing with Accessability in Mind
date: 2022-04-21
description: desc
image: v1640962583/debbie.codes/blog/tailwindcss-button_2x_gtcqu9
provider: cloudinary
tags: [testing, playwright, accessibility]
published: false
---

As frontend developers we are faced with so many challenges when it comes to writing code. We have to write good code and keep performance in mind as well as accessability and then we are asked to test our code. Shipping a simple feature is not so simple after all. However more and more each day we are starting to care about the code we write as we rely on the internet for so much of our daily lives. But how can we find the balance of shipping code fast yet ensuring it meets accessability standards and will stand the test of time?

I have fought for many years to try to introduce testing to the many teams and companies I have previously worked with. I succeeded sometimes but mainly failed. Why? Because developers are just too busy. Because the time given to do a task is too little. And here is the biggest one, because developers are not used to writing tests, have little experience and sometimes just don't know where to start.

So how can we fix this? By building better tools for a start. Although that's not completely going to solve the problem. We need to make developers lives easier by giving them something meaningful for little in return. A kind of trade off. Instead of saying we need to write more tests or we need to make our code more accessible how about lets write some tests to ensure our code is accessible. Now we have a meaning and understanding for our tests.

## End to End tests - Seeing what your user sees

When it comes to writing e2e tests sometimes its hard to understand what we should be testing. When looking at a typical website we could say let's test the navigation or the contact form. That makes sense. Great. Now where do we start? We need to invest time in learning a new library, understand how to test, write the code, understand how to run the test and fix it if it fails and then there's all that CI stuff to think about so it runs on each pr. And that's when the devs say, yeah, let's leave it till we have more time. But experienced devs know that there will never be more time and going back to test your code later on is just not going to happen.

So what is the solution? That's where the better tools comes into play. The tool I am going to talk about is Playwright. Playwright is a library that you can easily install into any project or run on it's own. It comes with a codegen that allows you to click around the website while it simply writes the tests for you. All you have to do is be the user and do what the user would do, navigate or fill out the contact form for example. As you scroll and click and fill out things Playwright will write the tests for you which you can then simply copy and paste into a test file in your editor.

Yes it really is as simple as that. So what's the catch? There is none. Playwright is open source and free to use. It comes with a VS Code extension too meaning you can run the tests right from your editor and easily debug and fix tests thanks to the warning messages it gives.

## What does this have to do with Accessability?

OK, great question. If you have ever visited my site and scrolled down to the bottom you will see I have a color mode picker so you can see the site in light mode or dark mode as well as sepia or the color set by your system.

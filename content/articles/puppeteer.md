---
title: Using puppeteer to create an image
date: 2020-10-09
description: Puppeteer
published: false
image: https://images.unsplash.com/photo-1580408485028-225972105876?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
tags: [Puppeteer, all]
---

```js
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/integrations/cloudinary')
  await page.setViewport({ width: 2400, height: 2000, deviceScaleFactor: 2 })
  const hrefElement = await page.$('.hero')

  await hrefElement.screenshot({ path: 'example.jpeg' })

  await browser.close()
})()
```

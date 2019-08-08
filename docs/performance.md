# Performance

Performance tests should be done in development to pick up on simple issues and again once deployed and then checked regualary.

## Webpack Analyzer

You can run `yarn build -a` to launch the analyzer tool for webpack which shows you how much code is being used per page, vendor, plugin etc.

## Lighthouse Audit

The Chrome dev tools give you a fantastic way to audit your code and check your performance with suggestions on how to improve and fix these issues.

## Code Coverage

Code Coverage is great for checking if you are loading too much unused code especially when using code from vendors. You can find this tool in chrome under the tools section.

## CSS Stats

This tool is great for checking if your CSS is bigger than it should be or if you are loading to many colours etc. [CSSStats](https://cssstats.com/).

## Accesability and SEO

We can check if our SEO and Asscesability is correct with this [tool](http://wave.webaim.org/report#/patterson.travel/privacidad). This will show us if we have h1 tags on the page alt tags etc.

You can also use chrome dev tools to hover over any item to see the color contrast ratio and to see if it passes the accesability requirements.

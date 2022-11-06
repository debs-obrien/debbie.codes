---
title: JS CAMP Barceona 2019
---

18-19 July 2019, Notes from conference including links to slides

## FOUC and the Death of Progressive Enhancement

Kyle Simpson

- [github](https://github.com/getify)
- [blog](https://medium.com/@getify)

Turn our attention to the user. Mirror mirror on the wall, developers see developers not users. Users don't adjust the width of the page to make it responsive so as developers neither should we. On mobile users see missing things. Users should get first priority. Don't make things better for developers thinking it will then make things better for users. Make the user a part of the experience. We need to design focused primarily on the user. Font sizes gives users the choice of what size. New York Times is a great example. Don't ask permission just build things a better way.

## Shape of the Web

Henri Helvetic

## What happens next: a choose-your-own-adventure with iterators

Jenn Creighton

- [slides](https://noti.st/jenncreighton/EFyoAp/what-tamagotchis-can-teach-you-about-es6-generators)
- [blog](https://noti.st/explore)

Iterators, iterables, destructoring, spread operator, generators
https://bit.ly/2JTMwb0

## Accessible JavaScript patterns

Garance Flore Vallat

- [github](https://github.com/garancev)
- [website](https://garancevallat.com/)

- Accessability with keyboard focus and dropdowns and modals.
- Pally integrate into the command line.

## CSS in JS - The good, the bad and the ugly

Maya Shavin

- [website](https://www.mayashavin.com/)
- [github](https://github.com/mayashavin)

CSS modules, CSS in JS. Should we or shouldn't we. There is always a time and a place just not every time and all the places.

## Pwototyping

Adam Argyle

- [website](https://nerdy.dev/)
- [github](https://github.com/argyleink)

PWA, manifest, name, styles, icons. PWA extras - display, orientation. Verify on chrome dev tools. Meta name viewport content initial scale.Remove 300ms delay. App theme, app brand, add preload, defer/async. System fonts, remove tap highlight. Body on load. Sticky class. Snap points, scroll snap type. Image set sizes inline. image src set for retina, @2x @1x. Loading = lazy. starturl: "/index.html".

## Rethinking Reactivity

Rich Harris

- [github](https://github.com/Rich-Harris)

Omit needless words. Write less. Build better more robust software. Why I don't use web components article.

- [Svelte](https://svelte.dev/)

## How to effectively use the dev tools in all the browsers

Paul Verbeek-Mast

- [website](http://paulvm.com/)
- [slides](https://noti.st/paul/cUKUID/how-to-effectively-use-the-dev-tools-in-all-the-browsers)

- oldweb.today
- Firefox for debugging css. Changes step, copy all changes. Flexbox inspector.

Chrome console:

- `$0` to see which elemet you are on
- `$(div)`
- `$$(div)` to get all elements
- `inspect($(.myClass))` will select it in elemet selector
- `inspect(\$(.myClass))` will select it in elemet selector
- `Monitor(sum)` - sum is a funciton we would like to monitor. It gives us a message when the function is being called also for events.
- `MonitorEvents($_, 'click')`
- `$_` the last thing you used

Chrome network:

- Capture screeenshot, clear cache and play to see what is loaded when.

Safari: canvas tab

## JAMStack - The total Victory of JavaScript

Shawn Wang

- [website](https://www.swyx.io/)
- [blog](https://www.swyx.io/writing)
- [github](https://github.com/sw-yx)

Chris Coyer article on JamStack

- JamStack being served directly from a CDN. From Lamp to Mean to JamStack. Client side v Server side. Static site genaration.

## Inside V8: weak collections, emphemerons, and private fields

Sigurd Schneider

- [github](https://github.com/sigurdschneider)

- Garbage Collection and how it works.
- Maps
- WeakMap()
- Map keeps key and value alive
- WeakMap keeps value alive
- An entry dies if weakMap dies or a key dies.

## Error handling: doing it right

Ruben Bridgewater

- [github](http://github.com/BridgeAR)

- Handling errors, promise all. Error classes. Util.promisfy. Async await easier for debugging.

## Webpack Performance

Sean Larkin

- [github](https://github.com/TheLarkInn)

- Service workers, workbox. Offline plugin. [Webhint](https://webhint.io/) - like lighthouse. Apps/size-auditor

## Fast by default: algorithmic performace optimization in practice

Vladimir Agafonkin

- [github](http://github.com/mourner)
- [website](https://agafonkin.com/)

- Simplify code

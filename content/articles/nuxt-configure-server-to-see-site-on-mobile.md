---
title: Configure the Nuxt.js server to see your site on your mobile
date: 2020-04-21
description: Sometimes you want to test out your site on your actual mobile device or tablet and not just in the dev tools. This is great when bug fixing or just to see how it looks in a real environment.
image: photo-1423666639041-f56000c27a9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjF9&auto=format&fit=crop&w=800&q=60
provider: unsplash
tags: [Nuxt, all]
---

Sometimes you want to test out your site on your actual mobile device or tablet and not just in the dev tools. This is great when bug fixing or just to see how it looks in a real environment.

By default, the Nuxt.js development server host is localhost which is only accessible from within the host machine meaning you can't open localhost on your mobile.

However you can modify the server in your nuxt.confg.js file.

```javascript
export default {
  server: {
    host: '0' // default: localhost
  }
}
```

By assigning the string value of '0' which is short for '0.0.0.0' Nuxt.js will give you your local IP address.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/gve0ynnj783dtm5hbmw4.png)

Now instead of typing localhost to see your application you will type your local IP address. In this example mine is http://192.168.0.199:3000/

You can now go to you mobile or tablet and open your website using that link.

The default port is 3000. Should you wish to change it you can also do so by using the port property.

```javascript
export default {
  server: {
    port: 8000 // default: 3000
  }
}
```

If this port is already in use, Nuxt.js will give you a random port.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/46fajq67md7nvt9qaoyj.png)

Although you can modify this in the nuxt.config.js file it is not advised to as it might cause you issues when hosting your site. It is much better to modify the host direct in the dev command.

```bash
HOST=0 npm run dev
```

or the port that you want

```bash
PORT=8000 npm run dev
```

or both

```bash
HOST=0 PORT=8000 npm run dev
```

You can even setup a script command in your package.json. For this example I will call it dev:host but you can call it whatever you like. You can add the hostname you always want to use or you can add '0' to get a random one.

```json
"scripts": {
  "dev:host": "nuxt --hostname '192.168.0.199' --port 8000"
}
```

Which means you only have to run one command when you want to change your servers and the normal dev command for when you want to run on localhost.

```bash
npm run dev:host
```

Although you can now see your site on your mobile you can't share this port with anyone outside of your LAN. That means if you are working remote and want to share your work in progress with someone not on the same wifi connection as you, then this method will not work.

Give it a try and start testing your mobile user experience, while in development, on an actual mobile.

[See the nuxt docs for more info](https://nuxtjs.org/faq/host-port)

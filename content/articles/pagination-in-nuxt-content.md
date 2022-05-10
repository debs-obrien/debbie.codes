---
title: Pagination in Nuxt Content
date: 2022-03-26
description: My blog was getting bigger and bigger and so time to add pagination. I am using Nuxt Content to manage my blog posts. So how do I add pagination to my blog? Let me show you how I did it.
image: v1648296331/debbie.codes/blog/2022/pagination_2x_ppog9g.png
ogImage: https://res.cloudinary.com/debsobrien/image/upload/f_webp,q_80,c_fit,w_480/v1648296331/debbie.codes/blog/2022/pagination_2x_ppog9g.png
provider: cloudinary
tags: [nuxt, pagination]
published: true
loading: eager
---

Nuxt content is by far my favorite feature of Nuxt. It allows me to easily write my blog posts in Markdown format yet add components on to the page if and when I need to. And I love the live edit where I can simply click and edit the text directly in the browser and it saves the code for me. Mind blowing feature.

Writing my content in markdown makes it then easy for me to copy those posts and paste them to [my dev.to](https://dev.to/debs_obrien) account with a canonical link to my site. I don't need a content management tool to write my posts and am quite happy using Nuxt content to write my post, push it to GitHub and have Netlify build and publish a new version of my static site.

## Why Pagination

As I started to write more posts my blog page was getting very long and even though I had already split the posts into categories some of the categories were also getting quite long. This means the pages where handing a lot of content that needs to be scrolled and a lot of content that needs to be loaded on the page. Adding pagination would make for a better user experience but also better performance.

## Querying your Endpoint

The first thing I did was try to get pagination on the main blog page and then worry about getting it to work on the categories. Nuxt content will fetch my markdown files from a directory inside the content folder.

Remember you can test your queries locally by adding `_content` in your localhost URL and seeing the results of the data returned.

```js
http://localhost:3000/_content/articles?only=title&limit=9&skip=9
```

## Fetching the Posts

To fetch the data we use `asyncData` passing in `$content` and `params` so we can access them from the Nuxt context. Then we add a const of `pageNo` which will get the number of the page from the params and we use `parseInt` to convert it to a number. Note: At the moment I am using Nuxt 2 until Nuxt 3 can support Nuxt content.

I want to get 9 Articles per page so we create a const called `getArticles` and then use the `$content` method passing in the folder to where my posts are stored. We then add a condition using `.where`. We want to make sure we only publish posts that do not have published set to false.

```js
const getArticles = await $content('articles').fetch()
```

Make sure you always add the `.fetch()` at the end of your query. I have very often forgotten this and wondered why I wasn't getting any data back.

### Fetch only posts where published is not false

In my posts I add `published: false` for those posts that are still a work in progress. That means I can still push them to GitHub but they won't get fetched by Nuxt content until I remove this from the yaml or set published to true. The reason I choose to use not equal to false instead of making it true was to basically not have to go back over all posts and add a condition to publish them.

```js
const getArticles = await $content('articles')
  .where({ published: { $ne: false } })
  .fetch()
```

### Limit the amount of posts returned

Next we want to limit the amount of posts that come back so that we only have 9 posts per page.

```js
const getArticles = await $content('articles')
  .where({ published: { $ne: false } })
  .limit(9)
  .fetch()
```

### Skip the posts based on page number

We then add a condition to skip the first 9 posts times the page number -1 so if on page 1, don't skip any. If on page 2 skip 9 etc. This is because we want to show the first page of posts and then the second page of posts and so on.

```js
const getArticles = await $content('articles')
  .where({ published: { $ne: false } })
  .limit(9)
  .skip(9 * (pageNo - 1))
  .fetch()
```

### Sort the posts by date

Next we sort the posts by date in descending order so that the newest posts are on top.

```js
const getArticles = await $content('articles')
  .where({ published: { $ne: false } })
  .limit(9)
  .skip(9 * (pageNo - 1))
  .sortBy('date', 'desc')
  .fetch()
```

### Set the next page

Next page is set to true if the amount of articles received is equal to 9. This means we can then render our next page button if the condition is true.

```js
const nextPage = getArticles.length === 9
```

### Return what we need

Our final step and one of the most important is to return our data which is our const of `getArticles` as well as return our `nextPage` and our `pageNo`.

```js
return {
  nextPage,
  getArticles,
  pageNo
}
```

The final code looks something like this. Note I have the layout properties in here so that all my blog pages use the same layout which I named blog. I also added a const called `numArticles` making it equal to 9 just to keep things dry and finally I added an if statement to deal with errors incase there are no articles returned. This will render my error page with the message of 'no articles found'

```js
export default {
  layout: 'blog',
  async asyncData({ $content, params }) {
    const pageNo = parseInt(params.number)
    const numArticles = 9

    const getArticles = await $content('articles')
      .where({ published: { $ne: false } })
      .limit(numArticles)
      .skip(numArticles * (pageNo - 1))
      .sortBy('date', 'desc')
      .fetch()

    if (!getArticles.length) {
      return error({ statusCode: 404, message: 'No articles found!' })
    }

    const nextPage = getArticles.length === numArticles
    getArticles
    return {
      nextPage,
      getArticles,
      pageNo
    }
  }
}
```

## Rendering the posts

The next step is to render the posts. We do this by using `v-for` and looping over the `getArticles` and rendering each article using the 'PostsCard' component.

```js
<div v-for="article of getArticles" :key="article.slug" class="flex flex-col">
  <PostsCard :item="article" />
</div>
```

### Rendering the Pagination Component

We then render the pagination component which has a prop of `nextPage` and a prop of `pageNo`. We want the first page to be 1 and the `nextPage` will be either true or false depending on if the length of our articles is equal to 9.

```js
<Pagination :nextPage="nextPage" :pageNo="1" urlPrefix="/blog/all" />
```

## Creating Dynamic Category Pages

We have pagination on the main blog page but now we need to create pages for each category so we can have pagination for the Nuxt category, React category, Testing category etc. In Nuxt we can create dynamic pages by creating a folder with `_category` and inside it a folder with `_number`. This will give you a url of `/blog/category/number` but as it is dynamic it will render something like this `/blog/nuxt/1`.

We then create an index file inside the `_number` folder. This will be the page that gets rendered containing the blog posts for that category.

The main difference between this and the main blog page is adding the `selectedTag` to our data with the value of the category we get back from our route params.

```js
data() {
      return {
        selectedTag: this.$route.params.category
      }
    },

```

We also need to add a computed property to filter the articles by the selected Tag. Using the `.filter()` method it will go through each article to see if the selected Tag, which we get from our route params, is found inside the tags array that is added to the yaml of each article. The tags array looks something like this `tags: [nuxt]`.

```js
    computed: {
      filteredArticles() {
        return this.getArticles.filter(article =>
          article.tags.includes(this.selectedTag)
        )
      }
    }
```

## Rendering our filtered posts

Now when rendering our posts we need to use the `filteredArticles` instead of the `getArticles`.

```html
<div
  v-for="article of filteredArticles"
  :key="article.slug"
  class="flex flex-col"
>
  <PostsCard :item="article" />
</div>
```

### Rendering the pagination

For our pagination component we need to pass in the prop of `prevPage` and set it to true of false if the page number is greater than 1. We also pass in our `nextPage` and `pageNo` props and finally our `urlPrefix` which gets our category from the route params.

```html
<Pagination
  :prevPage="pageNo > 1"
  :nextPage="nextPage"
  :pageNo="pageNo"
  :urlPrefix="`/blog/${this.$route.params.category}`"
/>
```

## Conclusion

I now have pagination running on my blog and a page for each category and number. These pages are dynamic and upon building my static site, Nuxt will pre-render a page for each of these dynamic pages. This will enhance performance and give users a much better experience.

There is one thing I am not too happy with. My main blog page is practically a copy of the dynamic index page under the category/number folder. This means I have to maintain this code twice and that is never good. There are a few ways around this.

I could create a middleware that intercepts this route and brings me to the all category page 1 route. I could also create a Netlify redirect that will do the same thing. However I do like having the blog page route of just `/blog` so I am undecided on what the best solution here is. If you have any suggestions let me know.

## Useful Links

My code is fully open source so clone, copy, or use whatever you like. Have fun.

- [Code on GitHub](https://github.com/debs-obrien/debbie.codes/tree/master/pages/blog)
- [Blog Page](https://debbie.codes/blog)
- [Nuxt Content API Endpoint](https://content.nuxtjs.org/advanced#api-endpoint)
- [Crate a Blog with Nuxt Content](https://nuxtjs.org/tutorials/creating-blog-with-nuxt-content)

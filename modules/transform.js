import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'

// tell highlightjs to look for code chunks of type 'javascript'
hljs.registerLanguage('javascript', javascript)

// init markdown and inject the highlighter
const md = require('markdown-it')({
  html: true,
  langPrefix: '',
  typographer: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
        )
      } catch (__) {}
    }
    return ''
  },
})

// make all markdown images 100x100 using Netlify Large Media Transforms
md.renderer.rules.image = function(tokens, idx) {
  const src = tokens[0].attrs[0][1]
  const alt = tokens[0].content

  return `<img src='${src}?nf_resize=fit&w=100&h=100' alt='${alt}'/>`
}

export default function() {
  // called after nuxt has cleared and re-created the .nuxt dir!
  this.nuxt.hook('builder:prepared', (generator) => {
    mkdirSync('.nuxt/data/')

    // collect a master list of post titles & slugs for our /blogs/ page
    const blogLookup = readdirSync('./assets/content/blog').map((filename) => {
      const post = JSON.parse(readFileSync('./assets/content/blog/' + filename))

      // pre-transform the markdown and shove to 'blarg' in the object
      post.blarg = md.render(post.body)

      // write the individual page data to the page's dedicated file
      writeFileSync('.nuxt/data/' + filename, JSON.stringify(post))

      return {
        title: post.title,
        slug: filename.replace('.json', ''),
      }
    })

    // write the blog list data object that /blog/ will import
    writeFileSync('.nuxt/blogList.json', JSON.stringify(blogLookup))
  })
}

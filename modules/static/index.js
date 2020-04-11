const path = require('path')
const crypto = require('crypto')
const { writeFile, ensureDir } = require('fs-extra')

const BUILD_HASH = crypto
  .createHash('md5')
  .update(new Date().toISOString())
  .digest('hex')
  .substr(0, 20)

module.exports = function(moduleOptions) {
  const options = {
    exclude: [],
    ...this.options.static,
    ...moduleOptions
  }

  const relativePayloadDirPathFromGenerateDir = path.join(
    this.nuxt.options.build.publicPath,
    '__payloads',
    BUILD_HASH
  )
  this.nuxt.hook('generate:page', async (page) => {
    if (!this.nuxt.options.generate.subFolders) {
      throw new Error('generate.subFolders should be true for @nuxt/static')
    }
    if (options.exclude.some((regex) => regex.test(page.route))) {
      return page
    }

    const windowNamespace = this.nuxt.options.globals.context(
      this.nuxt.options.globalName
    )
    const payload = extractPayloadData(page, windowNamespace)

    const basePayloadDirPath = path.join(
      this.nuxt.options.generate.dir,
      relativePayloadDirPathFromGenerateDir
    )
    const generateRouteDirPath = path.join(basePayloadDirPath, page.route)

    await writePayloadAndReturnPath(
      payload,
      generateRouteDirPath,
      windowNamespace
    )

    page.html = recreatePageHtmlWithPayloadJs(
      page,
      windowNamespace,
      relativePayloadDirPathFromGenerateDir
    )

    return page
  })

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      relativePathFromGenerateDir: relativePayloadDirPathFromGenerateDir,
      rawExcludeRegexes: []
        .concat(options.exclude, this.options.generate.exclude)
        .map(String)
    }
  })
  this.nuxt.options.router.middleware.push('nuxt-static')
}

const recreatePageHtmlWithPayloadJs = function(
  { html, route },
  windowNamespace,
  relativePathFromGenerateDir
) {
  const chunks = html.split(`<script>window.${windowNamespace}=`)
  const [pre] = chunks
  const post = chunks[1]
    .split('</script>')
    .slice(1)
    .join('</script>')
  const path = route === '/' ? '' : route

  return `${pre}<script defer src="${relativePathFromGenerateDir}/${path}/payload.js"></script>${post}`
}

const extractPayloadData = function({ html, route }, windowNamespace) {
  const chunks = html.split(`<script>window.${windowNamespace}=`)
  return chunks[1].split('</script>').shift()
}

const writePayloadAndReturnPath = async function(
  payload,
  routePath,
  windowNamespace
) {
  // Make sure the directory exists
  await ensureDir(routePath)

  // if routes are nested, ignore parent routes and extract last one
  // eslint-disable-next-line no-eval
  const nuxtContext = eval(`(${payload})`)
  const { data: pageData } = nuxtContext

  const stringifiedPageData = JSON.stringify(pageData)

  // Write payload.json (page data)
  const fullPath = path.resolve(routePath, `payload.json`)

  await Promise.all([
    writeFile(fullPath, stringifiedPageData, 'utf-8'),
    writeFile(
      path.resolve(routePath, `payload.js`),
      `window.${windowNamespace}=${payload}`,
      'utf-8'
    )
  ])
}

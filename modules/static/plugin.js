import { getMatchedComponents } from './utils.js'
import Middleware from './middleware'

const { relativePathFromGenerateDir, rawExcludeRegexes } = <%= JSON.stringify(options, null, 2) %>

const excludeRegexes = rawExcludeRegexes.map(s => new RegExp(s))

const hasStaticAsyncData = Component => Boolean(Component.options.asyncData) && Component.options.static !== false

Middleware['nuxt-static'] = async ({ route }) => {
  if (process.server) {
    return
  }
  if (!process.static) {
    return
  }

  if(excludeRegexes.some(r => r.test(route.path))){
    return
  }

  const Components = getMatchedComponents(route)
  Components.forEach((Component) => {
    Component._payloads = Component._payloads || {}
    if (Component.options.asyncData) {
      Component.options.asyncData = ({ route }) => Component._payloads[route.path.replace(/\/$/, '')]
    }
  })
  const path = route.path.replace(/\/$/, '')
  const isFetchNeeded = Components.some(Component => hasStaticAsyncData(Component) && !Component._payloads[path])

  if (!isFetchNeeded) {
    return
  }

  const payloadPath = `${relativePathFromGenerateDir}${path}/payload.json`.replace(/\/+/, '/')
  const pageData = await fetch(payloadPath).then((res) => {
    if (!res.ok) {
      return null
    }

    return res.json()
  })

  if (!pageData) {
    // eslint-disable-next-line no-console
    console.error(`[@nuxt/static] Could not fetch ${payloadPath}`)
    return
  }

  Components.forEach((Component, index) => {
    if (hasStaticAsyncData(Component)) {
      Component._payloads[path] = pageData[index]
    }
  })
}

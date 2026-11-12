interface WebMCPContext {
  registerTool?: (tool: object, options?: object) => Promise<unknown>
}

declare global {
  interface Document {
    modelContext?: WebMCPContext
  }
}

export default defineNuxtPlugin(() => {
  const mc = document.modelContext
  if (!mc || typeof mc.registerTool !== 'function')
    return

  const api = { registerTool: mc.registerTool.bind(mc) }
  // Dynamic import only after feature detect. The webmcp-tools chunk is also
  // stripped from HTML prefetch/modulepreload in nuxt.config so visitors
  // without document.modelContext never download it.
  import('~/utils/webmcp/register')
    .then(({ registerWebMCPTools }) => registerWebMCPTools(api))
    .catch(() => {})
})

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
  // Dynamic import only after feature detect. Nuxt build:manifest also strips
  // prefetch/modulepreload for utils/webmcp so visitors without
  // document.modelContext never download the tools chunk.
  import('~/utils/webmcp/register')
    .then(({ registerWebMCPTools }) => registerWebMCPTools(api))
    .catch(() => {})
})

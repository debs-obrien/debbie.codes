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

  import('~/utils/webmcp/register')
    .then(({ registerWebMCPTools }) => registerWebMCPTools(mc))
    .catch(() => {})
})

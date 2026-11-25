interface WebMCPContext {
  registerTool?: (tool: object, options?: object) => Promise<unknown>
  waitForToolsUntil?: (promise: Promise<unknown>) => void
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
  // Agents can briefly see zero tools while this settles; tell WebMCP to wait.
  const registration = import('~/utils/webmcp/register')
    .then(({ registerWebMCPTools }) => registerWebMCPTools(api))
    .catch(() => {})

  if (typeof mc.waitForToolsUntil === 'function') {
    try {
      mc.waitForToolsUntil(registration)
    }
    catch {
      // InvalidStateError / NotAllowedError must never break the page.
    }
  }
})

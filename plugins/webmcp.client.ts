export default defineNuxtPlugin(() => {
  const mc = (document as any).modelContext ?? (navigator as any).modelContext
  if (!mc || typeof mc.registerTool !== 'function')
    return

  import('~/utils/webmcp/register').then(({ registerWebMCPTools }) => registerWebMCPTools(mc))
})

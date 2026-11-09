import { originTrialMeta } from '~/utils/origin-trial'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  // Baked at build time (see nuxt.config runtimeConfig.public.webmcpOtRender).
  if (String(config.public.webmcpOtRender) !== '1')
    return

  const meta = originTrialMeta(config.public.webmcpOtChrome, config.public.webmcpOtEdge)
  if (meta.length)
    useHead({ meta })
})

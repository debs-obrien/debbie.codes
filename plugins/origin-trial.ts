import { originTrialMeta } from '~/utils/origin-trial'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const meta = originTrialMeta(config.public.webmcpOtChrome, config.public.webmcpOtEdge)
  if (meta.length)
    useHead({ meta })
})

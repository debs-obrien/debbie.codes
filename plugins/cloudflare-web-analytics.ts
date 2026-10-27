export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  // Baked at build time (see nuxt.config runtimeConfig.public.cfWebAnalytics).
  if (String(config.public.cfWebAnalytics) !== '1')
    return

  useHead({
    script: [{
      'src': 'https://static.cloudflareinsights.com/beacon.min.js',
      'defer': true,
      'data-cf-beacon': '{"token": "2e4614220fa04e208244f7d4d5771685"}',
    }],
  })
})

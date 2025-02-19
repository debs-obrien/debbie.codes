export default defineEventHandler((event) => {
  if (event.path !== '/' && event.path.endsWith('/')) {
    const { path } = event
    const nextPath = path.replace(/\/+$/, '') || '/'
    return sendRedirect(event, nextPath, 301)
  }
})

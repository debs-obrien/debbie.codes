/**
 * Middleware to enforce trailing slashes on all route navigations.
 *
 * @param {RouteLocationNormalized} to - The target route being navigated to.
 * @param {RouteLocationNormalized} from - The current route being navigated from.
 * @returns {Promise<void> | void} - Redirects if the route path does not end with a trailing slash.
 *
 * @example
 * // Navigating to `/about`
 * // Redirects to `/about/` with a 301 status code
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const { path } = to

  if (!path.endsWith('/')) {
    return navigateTo(path + '/', { redirectCode: 301 })
  }
})

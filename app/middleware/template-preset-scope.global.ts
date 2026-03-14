const STORAGE_KEY = 'lumio:template-scope:previous-theme'
const SCOPED_ROUTE_PREFIXES = ['/designer-preview', '/p/']

function isScopedTemplateRoute(path: string) {
  return SCOPED_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))
}

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) {
    return
  }

  const toIsScoped = isScopedTemplateRoute(to.path)
  const fromIsScoped = isScopedTemplateRoute(from.path)

  if (toIsScoped || fromIsScoped) {
    sessionStorage.removeItem(STORAGE_KEY)
  }
})
export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const { preset } = useThemePresets()

  const apply = () => {
    const c = preset.value.colors
//  =========== Cores do Tema Ativo ================
//  ----------- Cor Terciária --------------
    appConfig.ui.colors.primary = c.primary
    appConfig.ui.colors.secondary = c.secondary
    appConfig.ui.colors.tertiary = c.tertiary as typeof appConfig.ui.colors.tertiary
    appConfig.ui.colors.success = c.success
    appConfig.ui.colors.info = c.info
    appConfig.ui.colors.warning = c.warning
    appConfig.ui.colors.error = c.error
    appConfig.ui.colors.neutral = c.neutral
  }

  apply()

  if (import.meta.client) {
    watch(preset, apply, { deep: true })
  }
})
export default defineNuxtPlugin(async () => {
  const auth = useSupabaseAuth()

  await auth.initialize()
})
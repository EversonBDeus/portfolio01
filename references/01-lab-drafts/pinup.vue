<script setup lang="ts">
// pages/auth/confirm.vue

import type { FormSubmitEvent } from '@nuxt/ui'



const toast = useToast()
const router = useRouter()

// Estado que guarda o valor do código
const state = reactive({
  code: []
})

// Validamos que o código deve ter exatamente 6 dígitos



function onSubmit(payload: FormSubmitEvent<Schema>) {
  const finalCode = payload.data.code.join('')
  console.log('Código verificado:', finalCode)
  
  toast.add({ title: 'Conta confirmada!', description: 'Redirecionando para o painel...', color: 'success' })
  // router.push('/dashboard')
}
</script>

<template>
  <UPageCard class="surface-panel w-full text-center p-6">
    <div class="mb-6">
      <UIcon name="i-heroicons-envelope-open" class="w-12 h-12 text-primary mx-auto mb-4" />
      <h2 class="text-2xl font-bold">Verifique seu e-mail</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Digitamos um código de 6 dígitos que enviamos para o seu e-mail.
      </p>
    </div>

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
      <UFormField name="code" class="flex justify-center">
        <UPinInput 
          v-model="state.code" 
          :length="6" 
          autofocus 
          size="lg"
        />
      </UFormField>

      <UButton type="submit" block color="primary">
        Confirmar Código
      </UButton>
    </UForm>
    
    <div class="mt-6 text-sm">
      Não recebeu? <UButton variant="link" color="primary" :padded="false">Reenviar código</UButton>
    </div>
  </UPageCard>
</template>
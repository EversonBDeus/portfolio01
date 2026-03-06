<script setup lang="ts">
import type { NotificationsData } from '~/composables/usePerfilState'
import { useDashboardThemeUi } from '~/composables/useDashboardThemeUi'

const props = defineProps<{ model: NotificationsData }>()
const emit = defineEmits<{ dirty: [] }>()

const { cardUi, switchUi } = useDashboardThemeUi()

function markDirty() {
  emit('dirty')
}
</script>

<template>
  <div class="space-y-8">
    <div class="mx-auto w-full max-w-4xl space-y-6">
      <div class="space-y-1">
        <h2 class="text-base font-semibold">Notificações</h2>
        <p class="text-sm text-muted">
          Escolha como você quer receber avisos sobre sua conta e seu portfólio.
        </p>
      </div>

      <div class="grid w-full items-stretch gap-6 lg:grid-cols-2">
        <UCard
          variant="outline"
          class="h-full"
          :ui="{
            ...cardUi,
            body: 'p-5 space-y-4'
          }"
        >
          <div class="space-y-1">
            <p class="font-semibold leading-tight">E-mail</p>
            <p class="text-sm text-muted leading-tight">
              Mensagens enviadas para o e-mail cadastrado na sua conta.
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Atualizações importantes</p>
                <p class="text-xs text-muted">Mudanças relevantes e comunicados.</p>
              </div>
              <USwitch
                v-model="props.model.emailUpdates"
                size="lg"
                color="success"
                :ui="switchUi"
                @update:model-value="markDirty"
              />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Segurança</p>
                <p class="text-xs text-muted">Login, alterações de senha e alertas.</p>
              </div>
              <USwitch
                v-model="props.model.emailSecurity"
                size="lg"
                color="success"
                :ui="switchUi"
                @update:model-value="markDirty"
              />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Cobrança e assinatura</p>
                <p class="text-xs text-muted">Pagamentos, renovação e recibos.</p>
              </div>
              <USwitch
                v-model="props.model.emailBilling"
                size="lg"
                color="success"
                :ui="switchUi"
                @update:model-value="markDirty"
              />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Novidades do produto</p>
                <p class="text-xs text-muted">Recursos novos e melhorias.</p>
              </div>
              <USwitch
                v-model="props.model.emailProduct"
                size="lg"
                color="success"
                :ui="switchUi"
                @update:model-value="markDirty"
              />
            </div>
          </div>
        </UCard>

        <UCard
          variant="outline"
          class="h-full"
          :ui="{
            ...cardUi,
            body: 'p-5 space-y-4'
          }"
        >
          <div class="space-y-1">
            <p class="font-semibold leading-tight">WhatsApp</p>
            <p class="text-sm text-muted leading-tight">
              Avisos rápidos (se você habilitar e confirmar seu número).
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Atualizações importantes</p>
                <p class="text-xs text-muted">Mudanças relevantes e comunicados.</p>
              </div>
              <USwitch
                v-model="props.model.whatsappUpdates"
                size="lg"
                color="success"
                :ui="switchUi"
                @update:model-value="markDirty"
              />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Segurança</p>
                <p class="text-xs text-muted">Login e alertas críticos.</p>
              </div>
              <USwitch
                v-model="props.model.whatsappSecurity"
                size="lg"
                color="success"
                :ui="switchUi"
                @update:model-value="markDirty"
              />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium">Cobrança e assinatura</p>
                <p class="text-xs text-muted">Pagamentos e renovação.</p>
              </div>
              <USwitch
                v-model="props.model.whatsappBilling"
                size="lg"
                color="success"
                :ui="switchUi"
                @update:model-value="markDirty"
              />
            </div>
          </div>

          <UAlert
            class="dashboard-note-alert"
            icon="i-lucide-info"
            title="Observação"
            description="No futuro você poderá conectar um número e confirmar via código."
            color="neutral"
            variant="outline"
          />
        </UCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Domínio' })

import { computed } from 'vue'
import type { PlanTier } from '~/composables/usePerfilState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'
import { useDomainState } from '~/composables/useDomainState'

const toast = useToast()

const {
  domain,
  isPaidPlan,
  normalizedDomain,
  activationUrl,
  dnsRecords,
  statusMeta,
  setPlanTier,
  saveDomain,
  validateDns,
  simulateDnsError,
  removeDomain
} = useDomainState()

const planOptions: Array<{ label: string; value: PlanTier }> = [
  { label: 'Free', value: 'free' },
  { label: 'Plus', value: 'plus' },
  { label: 'Pro', value: 'pro' }
]

const hasCustomDomain = computed(() => Boolean(normalizedDomain.value))
const canValidate = computed(() => isPaidPlan.value && hasCustomDomain.value)

function onSaveDomain() {
  const ok = saveDomain()

  toast.add({
    title: ok ? 'Domínio salvo' : 'Plano insuficiente',
    description: ok
      ? 'Os registros DNS foram preparados para validação.'
      : 'Faça upgrade para um plano pago para usar domínio próprio.',
    color: ok ? 'success' : 'warning',
    icon: ok ? 'i-lucide-circle-check' : 'i-lucide-lock'
  })
}

function onValidateDns() {
  const ok = validateDns()

  if (!ok) return

  toast.add({
    title: 'DNS validado',
    description: 'O domínio foi marcado como ativo no modo visual desta etapa.',
    color: 'success',
    icon: 'i-lucide-badge-check'
  })
}

function onSimulateDnsError() {
  const ok = simulateDnsError()

  if (!ok) return

  toast.add({
    title: 'Falha simulada',
    description: 'O domínio foi marcado com erro para testar o estado visual.',
    color: 'error',
    icon: 'i-lucide-octagon-alert'
  })
}

function onRemoveDomain() {
  removeDomain()

  toast.add({
    title: 'Domínio removido',
    description: 'A configuração personalizada foi limpa neste modo visual.',
    color: 'neutral',
    icon: 'i-lucide-trash-2'
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Domínio</h1>
      <p class="text-sm text-muted">
        Configure domínio próprio, valide DNS e acompanhe o status de ativação da publicação.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-globe"
      title="Regras desta tela"
      description="Usuários gratuitos usam o domínio padrão da plataforma. Domínio próprio fica liberado apenas em planos pagos."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
      <div class="space-y-6">
        <div
          class="dashboard-form-surface-2 space-y-5 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="space-y-1">
              <h2 class="text-base font-semibold">Configuração do domínio</h2>
              <p class="text-sm text-muted">
                Salve o domínio desejado para gerar os registros DNS que precisam ser configurados.
              </p>
            </div>

            <UBadge :color="statusMeta.color" variant="subtle" class="shrink-0">
              {{ statusMeta.label }}
            </UBadge>
          </div>

          <UAlert
            v-if="!isPaidPlan"
            class="dashboard-note-alert"
            icon="i-lucide-lock"
            title="Upgrade necessário"
            description="No plano Free, a publicação continua usando apenas o domínio padrão da plataforma."
            color="warning"
            variant="outline"
          />

                  <div class="relative">
                    <UInput
                      v-model="domain.customDomain"
                      placeholder=""
                      autocomplete="off"
                      size="lg"
                      :disabled="!isPaidPlan"
                      :ui="{
                        base: 'peer w-full ps-10 bg-[color:var(--dashboard-form-surface)] text-[var(--dashboard-field-text)] placeholder:text-transparent ring-1 ring-inset ring-[color:var(--dashboard-field-ring)] transition-colors focus:ring-2 focus:ring-primary',
                        leading: 'absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none',
                        leadingIcon: 'size-5 text-[var(--dashboard-field-icon)]'
                      }"
                    >
                      <template #leading>
                        <UIcon name="i-lucide-globe" />
                      </template>

                      <template #default>
                        <label
                          class="pointer-events-none absolute start-10 z-[1] top-px -translate-y-1/2 text-xs font-medium text-highlighted transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-dimmed peer-focus:top-px peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-highlighted"
                        >
                          <span class="inline-block bg-[color:var(--dashboard-form-surface)] px-1 leading-none">
                            Domínio personalizado
                          </span>
                        </label>
                      </template>
                    </UInput>
                  </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              icon="i-lucide-save"
              :disabled="!isPaidPlan"
              @click="onSaveDomain"
            >
              Salvar domínio
            </UButton>

            <UButton
              color="primary"
              variant="outline"
              icon="i-lucide-badge-check"
              :disabled="!canValidate"
              @click="onValidateDns"
            >
              Validar DNS
            </UButton>

            <UButton
              color="warning"
              variant="outline"
              icon="i-lucide-octagon-alert"
              :disabled="!canValidate"
              @click="onSimulateDnsError"
            >
              Simular erro DNS
            </UButton>

            <UButton
              color="error"
              variant="outline"
              icon="i-lucide-trash-2"
              :disabled="!hasCustomDomain"
              @click="onRemoveDomain"
            >
              Remover domínio
            </UButton>
          </div>
        </div>

        <div
          class="dashboard-form-surface-2 space-y-5 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
        >
          <div class="space-y-1">
            <h2 class="text-base font-semibold">Registros DNS esperados</h2>
            <p class="text-sm text-muted">
              Use estes registros no provedor do domínio para concluir a ativação.
            </p>
          </div>

          <UAlert
            v-if="!hasCustomDomain"
            class="dashboard-note-alert"
            icon="i-lucide-info"
            title="Nada para validar ainda"
            description="Informe e salve um domínio para gerar os registros DNS desta tela."
            color="neutral"
            variant="outline"
          />

          <div v-else class="grid gap-3">
            <div
              v-for="record in dnsRecords"
              :key="`${record.type}-${record.host}`"
              class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <UBadge color="neutral" variant="soft">{{ record.type }}</UBadge>
                    <UBadge :color="record.isValid ? 'success' : 'warning'" variant="subtle">
                      {{ record.isValid ? 'Válido' : 'Pendente' }}
                    </UBadge>
                  </div>

                  <p class="text-sm text-muted">
                    Host: <strong class="text-default">{{ record.host }}</strong>
                  </p>

                  <p class="break-all text-sm text-muted">
                    Valor: <strong class="text-default">{{ record.value }}</strong>
                  </p>
                </div>

                <div class="text-right text-sm text-muted">
                  TTL: {{ record.ttl }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div
          class="dashboard-form-surface-2 space-y-4 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
        >
          <div class="space-y-1">
            <h2 class="text-base font-semibold">Status e publicação</h2>
            <p class="text-sm text-muted">
              Acompanhe o estado atual do domínio e o endereço público ativo.
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
            <div class="flex items-start gap-3">
              <UIcon :name="statusMeta.icon" class="mt-0.5 size-5 shrink-0 text-primary" />
              <div class="space-y-1">
                <p class="font-medium">{{ statusMeta.label }}</p>
                <p class="text-sm text-muted">{{ statusMeta.description }}</p>
              </div>
            </div>
          </div>

          <div class="grid gap-3">
            <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
              <p class="text-xs uppercase tracking-wide text-muted">Domínio padrão</p>
              <p class="mt-1 break-all text-sm font-medium">
                {{ domain.platformUrl }}
              </p>
            </div>

            <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
              <p class="text-xs uppercase tracking-wide text-muted">Domínio personalizado</p>
              <p class="mt-1 break-all text-sm font-medium">
                {{ normalizedDomain || 'Não configurado' }}
              </p>
            </div>

            <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
              <p class="text-xs uppercase tracking-wide text-muted">Última verificação</p>
              <p class="mt-1 text-sm font-medium">{{ domain.lastCheckedAt }}</p>
            </div>
          </div>
        </div>

        <div
          class="dashboard-form-surface-2 space-y-4 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
        >
          <div class="space-y-1">
            <h2 class="text-base font-semibold">Cenário de plano</h2>
            <p class="text-sm text-muted">
              Controle visual temporário para testar a regra de Free x plano pago antes da integração com cobrança real.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="option in planOptions"
              :key="option.value"
              size="sm"
              :variant="domain.planTier === option.value ? 'solid' : 'outline'"
              :color="domain.planTier === option.value ? 'primary' : 'neutral'"
              @click="setPlanTier(option.value)"
            >
              {{ option.label }}
            </UButton>
          </div>

          <UAlert
            class="dashboard-note-alert"
            icon="i-lucide-sparkles"
            title="Regra do produto"
            description="Free usa domínio padrão. Plus e Pro liberam domínio próprio, conforme a regra definida para a plataforma."
            color="neutral"
            variant="outline"
          />
        </div>
      </div>
    </div>
  </div>
</template>
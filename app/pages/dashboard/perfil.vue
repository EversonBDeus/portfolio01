<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Perfil' })

import type { TabsItem } from '@nuxt/ui'
import {
  initialUser,
  initialAccount,
  type SecurityData,
  type NotificationsData,
  type PlanData
} from '~/composables/usePerfilState'
import { useDashboardThemeUi } from '~/composables/useDashboardThemeUi'

import ProfileTabProfile from '~/components/dashboard/profile/ProfileTabProfile.vue'
import ProfileTabAccount from '~/components/dashboard/profile/ProfileTabAccount.vue'
import ProfileTabSecurity from '~/components/dashboard/profile/ProfileTabSecurity.vue'
import ProfileTabNotifications from '~/components/dashboard/profile/ProfileTabNotifications.vue'
import ProfileTabPlan from '~/components/dashboard/profile/ProfileTabPlan.vue'

const toast = useToast()
const isSaving = ref(false)
const isDirty = ref(false)
const activeTab = ref('portfolio')

const { cardUi, tabsUi } = useDashboardThemeUi()

const user = reactive({ ...initialUser })
const account = reactive({ ...initialAccount })

const security = reactive<SecurityData>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: false,
  twoFactorMethod: 'app'
})

const notifications = reactive<NotificationsData>({
  emailUpdates: true,
  emailSecurity: true,
  emailBilling: true,
  emailProduct: false,
  whatsappUpdates: false,
  whatsappBilling: false,
  whatsappSecurity: false
})

const plan = reactive<PlanData>({
  tier: 'free',
  status: 'ativa',
  renewAt: '—',
  coupon: ''
})

const tabs: TabsItem[] = [
  { label: 'Portfólio', value: 'portfolio', icon: 'i-lucide-briefcase-business' },
  { label: 'Conta', value: 'conta', icon: 'i-lucide-settings' },
  { label: 'Segurança', value: 'seguranca', icon: 'i-lucide-shield-check' },
  { label: 'Notificações', value: 'notificacoes', icon: 'i-lucide-bell' },
  { label: 'Plano', value: 'plano', icon: 'i-lucide-credit-card' }
]

async function save() {
  if (isSaving.value) return

  isSaving.value = true
  await new Promise((resolve) => setTimeout(resolve, 600))
  isSaving.value = false
  isDirty.value = false

  toast.add({
    title: 'Alterações salvas',
    icon: 'i-lucide-circle-check',
    color: 'success'
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 space-y-1">
        <h1 class="text-2xl font-semibold leading-tight">Perfil</h1>
        <p class="text-sm text-muted">
          Edite o que aparece no seu portfólio e o que pertence à sua conta no sistema.
        </p>
      </div>

      <UButton
        size="sm"
        icon="i-lucide-save"
        class="shrink-0"
        :loading="isSaving"
        :disabled="!isDirty"
        @click="save"
      >
        Salvar
      </UButton>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-layout-panel-top"
      title="Separação desta tela"
      description="A aba Portfólio controla os dados públicos do template. Conta, Segurança, Notificações e Plano controlam dados internos do sistema."
      color="neutral"
      variant="outline"
    />

    <div class="overflow-x-auto pb-1">
      <UTabs
        v-model="activeTab"
        :items="tabs"
        value-key="value"
        variant="pill"
        :content="false"
        :ui="tabsUi"
      />
    </div>

    <UCard
      variant="outline"
      class="dashboard-card-shell"
      :ui="{
        ...cardUi,
        body: 'p-4 sm:p-6'
      }"
    >
      <ProfileTabProfile
        v-show="activeTab === 'portfolio'"
        :model="user"
        @dirty="isDirty = true"
      />

      <ProfileTabAccount
        v-show="activeTab === 'conta'"
        :model="account"
        @dirty="isDirty = true"
      />

      <ProfileTabSecurity
        v-show="activeTab === 'seguranca'"
        :model="security"
        @dirty="isDirty = true"
      />

      <ProfileTabNotifications
        v-show="activeTab === 'notificacoes'"
        :model="notifications"
        @dirty="isDirty = true"
      />

      <ProfileTabPlan
        v-show="activeTab === 'plano'"
        :model="plan"
        @dirty="isDirty = true"
      />
    </UCard>
  </div>
</template>
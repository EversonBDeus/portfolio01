<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Perfil & Conta' })

import type { TabsItem } from '@nuxt/ui'
import { initialUser, initialAccount } from '~/composables/usePerfilState'
import type { SecurityData } from '~/composables/usePerfilState'
import ProfileTabNotifications from '~/components/dashboard/profile/ProfileTabNotifications.vue'
import type { NotificationsData } from '~/composables/usePerfilState'

import ProfileTabProfile from '~/components/dashboard/profile/ProfileTabProfile.vue'
import ProfileTabAccount from '~/components/dashboard/profile/ProfileTabAccount.vue'
import ProfileTabSecurity from '~/components/dashboard/profile/ProfileTabSecurity.vue'
import ProfileTabPlan from '~/components/dashboard/profile/ProfileTabPlan.vue'
import type { PlanData } from '~/composables/usePerfilState'
const toast = useToast()
const isSaving = ref(false)
const isDirty = ref(false)
const activeTab = ref('perfil')

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
  { label: 'Perfil', value: 'perfil', icon: 'i-lucide-user' },
  { label: 'Conta', value: 'conta', icon: 'i-lucide-settings' },
  { label: 'Segurança', value: 'seguranca', icon: 'i-lucide-shield-check' },
  { label: 'Notificações', value: 'notificacoes', icon: 'i-lucide-bell' },
  { label: 'Plano', value: 'plano', icon: 'i-lucide-credit-card' }
]

async function save() {
  if (isSaving.value) return
  isSaving.value = true
  await new Promise((r) => setTimeout(r, 600))
  isSaving.value = false
  isDirty.value = false
  toast.add({ title: 'Alterações salvas', icon: 'i-lucide-circle-check', color: 'success' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl font-semibold leading-tight">Perfil & Conta</h1>
        <p class="text-sm text-muted">Base do painel do SaaS. Depois pluga Supabase.</p>
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

    <!-- ✅ Tabs ocupam largura no desktop, scroll no mobile -->
    <div class="overflow-x-auto">
      <UTabs
        v-model="activeTab"
        :items="tabs"
        value-key="value"
        variant="pill"
        :content="false"
        :ui="{
          list: 'bg-muted/40 rounded-xl p-1 w-max md:w-full',
          trigger: 'md:flex-1 md:justify-center whitespace-nowrap'
        }"
      />
    </div>

    <UCard :ui="{ body: 'p-4 sm:p-6' }">
      <ProfileTabProfile v-show="activeTab === 'perfil'" :model="user" @dirty="isDirty = true" />
      <ProfileTabAccount v-show="activeTab === 'conta'" :model="account" @dirty="isDirty = true" />
      <ProfileTabSecurity v-show="activeTab === 'seguranca'" :model="security" @dirty="isDirty = true" />

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
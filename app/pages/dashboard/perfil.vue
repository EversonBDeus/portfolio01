<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import {
  initialUser,
  initialAccount,
  type AccountData,
  type UserProfile
} from '~/composables/usePerfilState'
import {
  useProfilePersistence,
  type ProfileRemotePayload
} from '~/composables/useProfilePersistence'
import { useDashboardThemeUi } from '~/composables/useDashboardThemeUi'

import ProfileTabProfile from '~/components/dashboard/profile/ProfileTabProfile.vue'
import ProfileTabAccount from '~/components/dashboard/profile/ProfileTabAccount.vue'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Perfil' })

const toast = useToast()
const isDirty = ref(false)
const activeTab = ref('portfolio')

const { cardUi, tabsUi } = useDashboardThemeUi()
const {
  lastSavedAt,
  loadProfileFromServer,
  loadingFromServer,
  saveProfileToServer,
  savingToServer
} = useProfilePersistence()

const user = reactive<UserProfile>({
  ...initialUser,
  mainSkills: [...initialUser.mainSkills]
})

const account = reactive<AccountData>({
  ...initialAccount
})

const tabs: TabsItem[] = [
  { label: 'Portfólio', value: 'portfolio', icon: 'i-lucide-briefcase-business' },
  { label: 'Conta', value: 'conta', icon: 'i-lucide-settings' },
  { label: 'Segurança', value: 'seguranca', icon: 'i-lucide-shield-check' },
  { label: 'Notificações', value: 'notificacoes', icon: 'i-lucide-bell' },
  { label: 'Plano', value: 'plano', icon: 'i-lucide-credit-card' }
]

const isRemoteBusy = computed(() => loadingFromServer.value || savingToServer.value)

const syncDescription = computed(() => {
  if (!lastSavedAt.value) {
    return 'Esta tela já está conectada ao backend real do MVP.'
  }

  return `Última sincronização do perfil: ${formatSavedAt(lastSavedAt.value)}.`
})

function formatSavedAt(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'data indisponível'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

function applyRemotePayload(payload: ProfileRemotePayload) {
  Object.assign(user, {
    ...payload.profile,
    mainSkills: [...payload.profile.mainSkills]
  })

  Object.assign(account, payload.account)

  isDirty.value = false
}

onMounted(async () => {
  const payload = await loadProfileFromServer()

  if (!payload) {
    toast.add({
      title: 'Não foi possível carregar o perfil agora',
      description: 'A tela continua acessível, mas tente recarregar para sincronizar os dados do backend.',
      color: 'warning',
      icon: 'i-lucide-cloud-off'
    })

    return
  }

  applyRemotePayload(payload)
})

async function save() {
  if (savingToServer.value || !isDirty.value) {
    return
  }

  const result = await saveProfileToServer({
    ...user,
    mainSkills: [...user.mainSkills]
  })

  if (!result.ok) {
    toast.add({
      title: 'Não foi possível salvar o perfil',
      description: result.error,
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })

    return
  }

  applyRemotePayload(result.payload)

  toast.add({
    title: 'Perfil sincronizado',
    description: 'Seus dados públicos e profissionais foram salvos no backend.',
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
          Edite os dados-base do portfólio e acompanhe o estado real da sua conta no sistema.
        </p>
      </div>

      <UButton
        size="sm"
        icon="i-lucide-save"
        class="shrink-0"
        :loading="savingToServer"
        :disabled="!isDirty || isRemoteBusy"
        @click="save"
      >
        Salvar
      </UButton>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-database"
      title="Tela alinhada ao backend MVP"
      description="Portfólio e Conta agora usam dados reais. Segurança, Notificações e Plano continuam como próximas etapas para não abrir escopo cedo demais."
      color="neutral"
      variant="outline"
    />

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-refresh-cw"
      title="Sincronização da tela"
      :description="syncDescription"
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
      class="dashboard-card-shell dashboard-form-surface-3"
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
      />

      <div
        v-show="activeTab === 'seguranca'"
        class="space-y-4"
      >
        <div class="space-y-1">
          <h2 class="text-base font-semibold">Segurança</h2>
          <p class="text-sm text-muted">
            Esta área entra na próxima fase, junto com fluxo real de senha e autenticação avançada.
          </p>
        </div>

        <UAlert
          class="dashboard-note-alert"
          icon="i-lucide-shield-check"
          title="Etapa posterior do produto"
          description="Nesta fase do backend MVP, priorizamos persistência real de perfil, editor, template e publicação. Segurança avançada fica desacoplada desta tela por enquanto."
          color="neutral"
          variant="outline"
        />
      </div>

      <div
        v-show="activeTab === 'notificacoes'"
        class="space-y-4"
      >
        <div class="space-y-1">
          <h2 class="text-base font-semibold">Notificações</h2>
          <p class="text-sm text-muted">
            Notificações reais ainda não fazem parte do backend MVP mínimo desta fase.
          </p>
        </div>

        <UAlert
          class="dashboard-note-alert"
          icon="i-lucide-bell"
          title="Fora do escopo imediato"
          description="O MVP atual precisa consolidar dados, editor e publicação. Preferências reais de notificação entram depois, sem misturar prioridades."
          color="neutral"
          variant="outline"
        />
      </div>

      <div
        v-show="activeTab === 'plano'"
        class="space-y-4"
      >
        <div class="space-y-1">
          <h2 class="text-base font-semibold">Plano</h2>
          <p class="text-sm text-muted">
            O plano atual já é mostrado na aba Conta. Billing e upgrade real entram em etapa própria.
          </p>
        </div>

        <UAlert
          class="dashboard-note-alert"
          icon="i-lucide-credit-card"
          title="Billing real fica para depois"
          description="Nesta fase mantemos apenas a leitura do plano salvo. Checkout, cobrança e limites comerciais ficam fora do backend MVP imediato."
          color="neutral"
          variant="outline"
        />
      </div>
    </UCard>
  </div>
</template>
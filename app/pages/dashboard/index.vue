<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'
import { useDashboardOverview } from '~/composables/useDashboardOverview'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Início' })

const toast = useToast()

const {
  completionPercent,
  lastLoadedAt,
  loadOverviewFromServer,
  loadingFromServer,
  overview
} = useDashboardOverview()

const currentTemplate = computed(() => {
  return PORTFOLIO_TEMPLATES.find((template) => template.id === overview.value.publication.templateId) ?? null
})

const syncDescription = computed(() => {
  if (!lastLoadedAt.value) {
    return 'Esta home agora lê o estado real da conta diretamente do backend.'
  }

  return `Última sincronização do dashboard: ${formatDateTime(lastLoadedAt.value)}.`
})

const planLabel = computed(() => {
  if (overview.value.account.plan === 'plus') {
    return 'Plus'
  }

  if (overview.value.account.plan === 'pro') {
    return 'Pro'
  }

  return 'Free'
})

const onboardingLabel = computed(() => {
  if (overview.value.account.onboardingStatus === 'completed') {
    return 'Concluído'
  }

  if (overview.value.account.onboardingStatus === 'in_progress') {
    return 'Em andamento'
  }

  return 'Não iniciado'
})

const onboardingColor = computed(() => {
  if (overview.value.account.onboardingStatus === 'completed') {
    return 'success'
  }

  if (overview.value.account.onboardingStatus === 'in_progress') {
    return 'warning'
  }

  return 'neutral'
})

const publicationLabel = computed(() => {
  return overview.value.publication.publicationStatus === 'published' ? 'Publicado' : 'Rascunho'
})

const publicationColor = computed(() => {
  return overview.value.publication.publicationStatus === 'published' ? 'success' : 'warning'
})

const editorLabel = computed(() => {
  if (!overview.value.editor.hasEditor) {
    return 'Ainda não salvo'
  }

  return overview.value.editor.hasCustomEditor ? 'Customizado' : 'Base sincronizada'
})

const editorColor = computed(() => {
  if (!overview.value.editor.hasEditor) {
    return 'warning'
  }

  return overview.value.editor.hasCustomEditor ? 'primary' : 'success'
})

const templateLabel = computed(() => {
  if (currentTemplate.value) {
    return currentTemplate.value.name
  }

  return overview.value.publication.templateId || 'Nenhum template salvo ainda'
})

const publicRouteLabel = computed(() => {
  return overview.value.publication.publicUrl || 'Defina um slug para gerar a rota pública'
})

const nextAction = computed(() => {
  if (overview.value.account.onboardingStatus !== 'completed') {
    return {
      title: 'Concluir onboarding',
      description: 'Feche as etapas iniciais da conta antes de seguir para o painel completo.',
      to: '/onboarding',
      icon: 'i-lucide-rocket'
    }
  }

  if (!overview.value.summary.hasProfileBase) {
    return {
      title: 'Preencher dados-base',
      description: 'Complete perfil público e dados profissionais para alimentar o produto.',
      to: '/dashboard/perfil',
      icon: 'i-lucide-user-round-pen'
    }
  }

  if (!overview.value.summary.hasTemplate) {
    return {
      title: 'Selecionar template',
      description: 'Escolha e salve um template para conectar editor e publicação.',
      to: '/dashboard/templates',
      icon: 'i-lucide-layout-template'
    }
  }

  if (!overview.value.editor.hasEditor) {
    return {
      title: 'Montar editor',
      description: 'Abra o editor e salve ao menos a base inicial do portfólio.',
      to: '/dashboard/editor',
      icon: 'i-lucide-sliders-horizontal'
    }
  }

  if (!overview.value.summary.hasPublishedPortfolio) {
    return {
      title: 'Publicar portfólio',
      description: 'Defina slug e status para liberar a rota pública do MVP.',
      to: '/dashboard/domain',
      icon: 'i-lucide-globe'
    }
  }

  return {
    title: 'Revisar rota pública',
    description: 'Sua configuração principal já está pronta. Agora revise sua página pública.',
    to: overview.value.publication.publicUrl || '/dashboard/domain',
    icon: 'i-lucide-external-link'
  }
})

const journeyItems = computed(() => [
  {
    id: 'onboarding',
    label: 'Onboarding concluído',
    description: 'Conta liberada para seguir no dashboard do produto.',
    complete: overview.value.account.onboardingStatus === 'completed',
    to: '/onboarding'
  },
  {
    id: 'profile',
    label: 'Dados-base preenchidos',
    description: 'Perfil público e dados profissionais já alimentam o backend.',
    complete: overview.value.summary.hasProfileBase,
    to: '/dashboard/perfil'
  },
  {
    id: 'template',
    label: 'Template selecionado',
    description: 'O template atual já está vinculado à conta.',
    complete: overview.value.summary.hasTemplate,
    to: '/dashboard/templates'
  },
  {
    id: 'editor',
    label: 'Editor persistido',
    description: 'O snapshot editorial já existe no backend.',
    complete: overview.value.editor.hasEditor,
    to: '/dashboard/editor'
  },
  {
    id: 'publication',
    label: 'Portfólio publicado',
    description: 'Seu endereço público já está disponível para acesso.',
    complete: overview.value.summary.hasPublishedPortfolio,
    to: '/dashboard/domain'
  }
])

const quickLinks = computed(() => [
  {
    title: 'Perfil',
    description: 'Edite a base pública e profissional do portfólio.',
    to: '/dashboard/perfil',
    icon: 'i-lucide-user'
  },
  {
    title: 'Templates',
    description: 'Revise o template atual e as opções disponíveis.',
    to: '/dashboard/templates',
    icon: 'i-lucide-layout-template'
  },
  {
    title: 'Editor',
    description: 'Ajuste as seções do portfólio e salve o conteúdo editorial.',
    to: '/dashboard/editor',
    icon: 'i-lucide-sliders-horizontal'
  },
  {
    title: 'Publicação',
    description: 'Controle slug, draft e published na rota pública.',
    to: '/dashboard/domain',
    icon: 'i-lucide-globe'
  }
])

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'data indisponível'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

onMounted(async () => {
  const payload = await loadOverviewFromServer()

  if (!payload) {
    toast.add({
      title: 'Não foi possível carregar o dashboard agora',
      description: 'Tente recarregar a página quando a sessão estiver estável.',
      color: 'warning',
      icon: 'i-lucide-cloud-off'
    })
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Início</h1>
        <p class="text-sm text-muted">
          Acompanhe o status da sua conta, do conteúdo e da publicação em um só lugar.
        </p>
    </div>



    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-refresh-cw"
      title="Sincronização da tela"
      :description="syncDescription"
      color="neutral"
      variant="outline"
    />

    <UAlert
      v-if="loadingFromServer"
      class="dashboard-note-alert"
      icon="i-lucide-loader-circle"
      title="Sincronizando overview"
      description="Carregando o estado atual da conta e do portfólio."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div
        class="dashboard-form-surface-2 space-y-5 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
            <h2 class="text-base font-semibold">Progresso da configuração</h2>
            <p class="text-sm text-muted">
              Veja o que já foi concluído e o que ainda falta ajustar.
            </p>
        </div>

        <div class="space-y-3 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-muted">Etapas concluídas</p>
            <p class="text-sm font-medium">
              {{ overview.summary.completionCount }}/{{ overview.summary.completionTotal }}
            </p>
          </div>

          <div class="h-2 rounded-full bg-(--dashboard-surface-2)">
            <div
              class="h-2 rounded-full bg-primary transition-all"
              :style="{ width: `${completionPercent}%` }"
            />
          </div>

          <p class="text-xs text-muted">
            {{ completionPercent }}% da sua configuração já foi concluída.
          </p>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <article
            v-for="item in journeyItems"
            :key="item.id"
            class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="font-medium">{{ item.label }}</p>
                <p class="text-sm text-muted">
                  {{ item.description }}
                </p>
              </div>

              <UBadge
                :color="item.complete ? 'success' : 'warning'"
                variant="subtle"
                class="shrink-0"
              >
                {{ item.complete ? 'OK' : 'Pendente' }}
              </UBadge>
            </div>

            <UButton
              size="sm"
              variant="outline"
              color="neutral"
              :to="item.to"
            >
              Abrir etapa
            </UButton>
          </article>
        </div>
      </div>

      <div
        class="dashboard-form-surface-2 space-y-4 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
            <h2 class="text-base font-semibold">Próximo passo</h2>
            <p class="text-sm text-muted">
              Continue de onde faz mais sentido para concluir sua configuração.
            </p>
        </div>

        <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-4">
          <div class="flex items-start gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UIcon :name="nextAction.icon" class="size-5" />
            </div>

            <div class="space-y-1">
              <p class="font-medium">{{ nextAction.title }}</p>
              <p class="text-sm text-muted">
                {{ nextAction.description }}
              </p>
            </div>
          </div>

          <UButton
            block
            icon="i-lucide-arrow-right"
            :to="nextAction.to"
          >
            Ir para a etapa
          </UButton>
        </div>

        <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-muted">Última atividade relevante</p>
            <p class="text-sm font-medium">
              {{ overview.summary.lastActivityAt ? formatDateTime(overview.summary.lastActivityAt) : 'Ainda não disponível' }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted">Rota pública atual</p>
            <p class="break-all font-medium">
              {{ publicRouteLabel }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted">Template atual</p>
            <p class="font-medium">
              {{ templateLabel }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm text-muted">Plano da conta</p>
            <p class="text-2xl font-semibold">{{ planLabel }}</p>
            <p class="text-xs text-muted">Leitura real da conta já integrada.</p>
          </div>

          <UBadge color="primary" variant="subtle">
            {{ planLabel }}
          </UBadge>
        </div>
      </article>

      <article
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm text-muted">Onboarding</p>
            <p class="text-2xl font-semibold">{{ onboardingLabel }}</p>
            <p class="text-xs text-muted">Status operacional da conta no fluxo inicial.</p>
          </div>

          <UBadge :color="onboardingColor" variant="subtle">
            {{ onboardingLabel }}
          </UBadge>
        </div>
      </article>

      <article
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm text-muted">Editor</p>
            <p class="text-2xl font-semibold">{{ editorLabel }}</p>
            <p class="text-xs text-muted">
              {{ overview.editor.projectCount }} projeto(s) persistido(s) no snapshot atual.
            </p>
          </div>

          <UBadge :color="editorColor" variant="subtle">
            {{ editorLabel }}
          </UBadge>
        </div>
      </article>

      <article
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm text-muted">Publicação</p>
            <p class="text-2xl font-semibold">{{ publicationLabel }}</p>
            <p class="text-xs text-muted">
              {{ overview.publication.publicSlug || 'Nenhum slug salvo ainda.' }}
            </p>
          </div>

          <UBadge :color="publicationColor" variant="subtle">
            {{ publicationLabel }}
          </UBadge>
        </div>
      </article>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
      >
        <div class="space-y-1">
          <h2 class="text-lg font-semibold">Resumo operacional da conta</h2>
          <p class="text-sm text-muted">
            Estado atual dos pontos mais importantes para manter o produto coerente no MVP.
          </p>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">E-mail da conta</p>
            <p class="font-medium break-words">
              {{ overview.account.email || '—' }}
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">Username</p>
            <p class="font-medium break-words">
              {{ overview.account.username || '—' }}
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">Nome público</p>
            <p class="font-medium break-words">
              {{ overview.profile.publicName || 'Ainda não preenchido' }}
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">Headline</p>
            <p class="font-medium break-words">
              {{ overview.profile.headline || 'Ainda não preenchida' }}
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-2">
            <p class="text-sm text-muted">Perfil base</p>

            <UBadge
              :color="overview.summary.hasProfileBase ? 'success' : 'warning'"
              variant="subtle"
            >
              {{ overview.summary.hasProfileBase ? 'Preenchido' : 'Pendente' }}
            </UBadge>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">Habilidades salvas</p>
            <p class="font-medium">
              {{ overview.profile.skillsCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <section
          class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
        >
          <div class="space-y-1">
            <h2 class="text-lg font-semibold">Acessos rápidos</h2>
            <p class="text-sm text-muted">
              Navegue pelos pontos principais do fluxo do produto.
            </p>
          </div>

          <div class="mt-5 space-y-3">
            <article
              v-for="link in quickLinks"
              :key="link.to"
              class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UIcon :name="link.icon" class="size-5" />
                  </div>

                  <div class="space-y-1">
                    <p class="font-medium">{{ link.title }}</p>
                    <p class="text-sm text-muted">
                      {{ link.description }}
                    </p>
                  </div>
                </div>

                <UButton
                  size="sm"
                  variant="outline"
                  color="neutral"
                  :to="link.to"
                >
                  Abrir
                </UButton>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
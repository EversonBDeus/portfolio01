<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePublicationState } from '~/composables/usePublicationState'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Publicação' })

const toast = useToast()

const {
  isPublished,
  loadingFromServer,
  normalizedPublicSlug,
  publicationStatus,
  publicSlug,
  publicUrl,
  savePublication,
  savingToServer,
  setPublicationStatus,
  templateId,
  loadPublication
} = usePublicationState()

const statusLabel = computed(() => {
  return isPublished.value ? 'Publicado' : 'Rascunho'
})

const statusColor = computed(() => {
  return isPublished.value ? 'success' : 'warning'
})

const absolutePublicUrl = computed(() => {
  if (!publicUrl.value) {
    return ''
  }

  if (import.meta.client) {
    return `${window.location.origin}${publicUrl.value}`
  }

  return publicUrl.value
})

onMounted(async () => {
  const loaded = await loadPublication()

  if (!loaded) {
    toast.add({
      title: 'Não foi possível carregar a publicação',
      description: 'Tente salvar novamente quando a sessão estiver estável.',
      color: 'warning',
      icon: 'i-lucide-cloud-off'
    })
  }
})

async function handleSavePublication() {
  const result = await savePublication()

  if (!result.ok) {
    toast.add({
      title: 'Não foi possível salvar',
      description: result.error,
      color: 'error',
      icon: 'i-lucide-octagon-alert'
    })

    return
  }

  toast.add({
    title: result.publicationStatus === 'published' ? 'Portfólio publicado' : 'Rascunho salvo',
    description:
      result.publicationStatus === 'published'
        ? 'A rota pública já está liberada pelo slug informado.'
        : 'O slug foi salvo, mas a rota pública continua bloqueada até publicar.',
    color: result.publicationStatus === 'published' ? 'success' : 'warning',
    icon: result.publicationStatus === 'published' ? 'i-lucide-rocket' : 'i-lucide-save'
  })
}

async function handleCopyLink() {
  if (!import.meta.client || !absolutePublicUrl.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(absolutePublicUrl.value)

    toast.add({
      title: 'Link copiado',
      description: 'A URL pública foi copiada para a área de transferência.',
      color: 'success',
      icon: 'i-lucide-copy'
    })
  } catch {
    toast.add({
      title: 'Não foi possível copiar',
      description: 'Copie manualmente a URL exibida no painel ao lado.',
      color: 'warning',
      icon: 'i-lucide-copy-x'
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Publicação</h1>
      <p class="text-sm text-muted">
        Defina o slug público e o status mínimo de publicação do portfólio.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-rocket"
      title="Escopo desta etapa"
      description="Agora a conta passa a ter slug público real, status draft/published e rota pública lendo diretamente do backend."
      color="neutral"
      variant="outline"
    />

    <UAlert
      v-if="loadingFromServer"
      class="dashboard-note-alert"
      icon="i-lucide-refresh-cw"
      title="Sincronizando publicação"
      description="Carregando o slug e o status atuais desta conta."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div
        class="dashboard-form-surface-2 space-y-5 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
          <h2 class="text-base font-semibold">Slug público</h2>
          <p class="text-sm text-muted">
            Este slug será usado na rota pública do MVP.
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Slug</label>

          <UInput
            v-model="publicSlug"
            placeholder="seu-nome-ou-marca"
            icon="i-lucide-link"
            size="lg"
          />

          <p class="text-xs text-muted">
            URL final:
            <span class="font-medium text-default">
              {{ normalizedPublicSlug ? `/p/${normalizedPublicSlug}` : '/p/seu-slug' }}
            </span>
          </p>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">Status da publicação</p>

          <div class="flex flex-wrap gap-3">
            <UButton
              :variant="publicationStatus === 'draft' ? 'solid' : 'outline'"
              color="warning"
              icon="i-lucide-file-pen-line"
              @click="setPublicationStatus('draft')"
            >
              Rascunho
            </UButton>

            <UButton
              :variant="publicationStatus === 'published' ? 'solid' : 'outline'"
              color="success"
              icon="i-lucide-globe"
              :disabled="!templateId"
              @click="setPublicationStatus('published')"
            >
              Publicado
            </UButton>
          </div>

          <p class="text-xs text-muted">
            Em rascunho, a rota pública fica bloqueada. Em publicado, o slug responde com os dados persistidos.
          </p>
        </div>

        <UAlert
          v-if="!templateId"
          class="dashboard-note-alert"
          icon="i-lucide-layout-template"
          title="Template obrigatório"
          description="Selecione e salve um template antes de publicar o portfólio."
          color="warning"
          variant="outline"
        />

        <div class="flex flex-wrap gap-3">
          <UButton
            icon="i-lucide-save"
            :loading="savingToServer"
            @click="handleSavePublication"
          >
            Salvar publicação
          </UButton>

          <UButton
            v-if="publicUrl"
            variant="outline"
            icon="i-lucide-copy"
            :disabled="!isPublished"
            @click="handleCopyLink"
          >
            Copiar link público
          </UButton>
        </div>
      </div>

      <div
        class="dashboard-form-surface-2 space-y-4 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
          <h2 class="text-base font-semibold">Resumo da publicação</h2>
          <p class="text-sm text-muted">
            Estado atual da rota pública desta conta.
          </p>
        </div>

        <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-muted">Status</p>

            <UBadge :color="statusColor" variant="subtle">
              {{ statusLabel }}
            </UBadge>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted">Template conectado</p>
            <p class="font-medium">
              {{ templateId || 'Nenhum template salvo ainda' }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted">Slug atual</p>
            <p class="font-medium">
              {{ normalizedPublicSlug || '—' }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted">URL pública</p>
            <p class="break-all font-medium">
              {{ absolutePublicUrl || 'Defina um slug para gerar a URL.' }}
            </p>
          </div>

          <UAlert
            :icon="isPublished ? 'i-lucide-badge-check' : 'i-lucide-lock'"
            :title="isPublished ? 'Rota pública liberada' : 'Rota pública bloqueada'"
            :description="isPublished
              ? 'O portfólio já pode ser acessado externamente pelo slug salvo.'
              : 'O portfólio continua privado até o status ser salvo como publicado.'"
            :color="isPublished ? 'success' : 'warning'"
            variant="outline"
          />
        </div>
      </div>
    </div>
  </div>
</template>
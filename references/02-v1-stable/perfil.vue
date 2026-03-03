<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Perfil — PortfolioSaaS' })

const toast = useToast()
const isSaving = ref(false)

const user = reactive({
  nome: 'João Silva',
  username: 'joaosilva',
  email: 'joao@exemplo.com',
  bio: 'Designer UX & Developer apaixonado por criar experiências que encantam.',
  location: 'Lisboa, Portugal',
  website: 'joaosilva.com',
  avatar: ''
})

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notifications = reactive({
  visitasEmail: true,
  visitasPush: false,
  newsEmail: true,
  tipsEmail: true
})

const activeTab = ref('perfil')
const tabs = [
  { id: 'perfil', label: 'Perfil', icon: 'i-heroicons-user' },
  { id: 'conta', label: 'Conta', icon: 'i-heroicons-cog-6-tooth' },
  { id: 'seguranca', label: 'Segurança', icon: 'i-heroicons-shield-check' },
  { id: 'notificacoes', label: 'Notificações', icon: 'i-heroicons-bell' },
  { id: 'plano', label: 'Plano', icon: 'i-heroicons-credit-card' }
]

async function save() {
  isSaving.value = true
  await new Promise(r => setTimeout(r, 1000))
  isSaving.value = false
  toast.add({ title: 'Perfil guardado!', color: 'success' })
}

const planFeatures = ['1 portfólio', 'Templates básicos', 'Subdomínio portfoliosaas.com/ti', '100 MB de armazenamento', 'Analytics básico']
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">

    <!-- Sidebar igual ao Dashboard -->
    <aside class="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-800 flex-col">
      <div class="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100 dark:border-neutral-800">
        <div class="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-sparkles" class="text-white text-xs" />
        </div>
        <span class="font-bold text-gray-900 dark:text-white">PortfolioSaaS</span>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-squares-2x2" class="text-lg" />Dashboard
        </NuxtLink>
        <NuxtLink to="/editor" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-pencil-square" class="text-lg" />Editor
        </NuxtLink>
        <NuxtLink to="/perfil" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium text-sm">
          <UIcon name="i-heroicons-user-circle" class="text-lg" />Perfil
        </NuxtLink>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-chart-bar" class="text-lg" />Analytics
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-lg" />Definições
        </a>
      </nav>
      <div class="p-4 border-t border-gray-100 dark:border-neutral-800">
        <div class="flex items-center gap-3">
          <UAvatar text="JS" size="sm" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">João Silva</p>
            <p class="text-xs text-gray-400 truncate">Plano Gratuito</p>
          </div>
        </div>
      </div>
    </aside>

    <main class="lg:pl-64">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur border-b border-gray-100 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 class="font-bold text-gray-900 dark:text-white">Perfil & Conta</h1>
        <UButton size="sm" :loading="isSaving" label="Guardar alterações" leading-icon="i-heroicons-check" @click="save" />
      </div>

      <div class="p-4 sm:p-6 lg:p-8">
        <div class="max-w-3xl">

          <!-- Tabs -->
          <div class="flex gap-1 bg-gray-100 dark:bg-neutral-900 rounded-xl p-1 mb-8 flex-wrap">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="activeTab === tab.id ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" class="text-sm" />
              {{ tab.label }}
            </button>
          </div>

          <!-- PERFIL TAB -->
          <div v-if="activeTab === 'perfil'" class="space-y-6">
            <UCard>
              <h3 class="font-bold text-gray-900 dark:text-white mb-5">Informação pessoal</h3>

              <!-- Avatar -->
              <div class="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-neutral-800">
                <div class="relative">
                  <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                    {{ user.nome.split(' ').map(n => n[0]).join('').slice(0,2) }}
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white mb-1">Foto de perfil</p>
                  <p class="text-sm text-gray-500 mb-3">PNG, JPG ou WebP. Máx 2MB.</p>
                  <div class="flex gap-2">
                    <UButton variant="outline" size="sm" label="Carregar foto" leading-icon="i-heroicons-arrow-up-tray" />
                    <UButton variant="ghost" color="error" size="sm" label="Remover" />
                  </div>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <UFormField label="Nome completo">
                  <UInput v-model="user.nome" />
                </UFormField>
                <UFormField label="Username">
                  <UInput v-model="user.username" :ui="{ base: 'pl-8' }">
                    <template #leading>
                      <span class="text-gray-400 text-sm">@</span>
                    </template>
                  </UInput>
                </UFormField>
                <UFormField label="Localização" class="sm:col-span-2">
                  <UInput v-model="user.location" placeholder="Cidade, País" />
                </UFormField>
                <UFormField label="Website" class="sm:col-span-2">
                  <UInput v-model="user.website" placeholder="exemplo.com" />
                </UFormField>
                <UFormField label="Biografia" class="sm:col-span-2">
                  <UTextarea v-model="user.bio" :rows="3" placeholder="Conta um pouco sobre ti..." />
                  <template #hint>
                    <span class="text-xs text-gray-400">{{ user.bio.length }}/200 caracteres</span>
                  </template>
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- CONTA TAB -->
          <div v-else-if="activeTab === 'conta'" class="space-y-6">
            <UCard>
              <h3 class="font-bold text-gray-900 dark:text-white mb-5">Informação da conta</h3>
              <div class="space-y-4">
                <UFormField label="E-mail">
                  <UInput v-model="user.email" type="email" />
                </UFormField>
                <UFormField label="Username público">
                  <UInput v-model="user.username" />
                  <template #hint>
                    <span class="text-xs text-gray-400">portfoliosaas.com/{{ user.username }}</span>
                  </template>
                </UFormField>
              </div>
            </UCard>

            <UCard class="border-error-200 dark:border-error-800">
              <h3 class="font-bold text-error-600 dark:text-error-400 mb-2">Zona de perigo</h3>
              <p class="text-sm text-gray-500 mb-4">Estas ações são irreversíveis. Procede com cuidado.</p>
              <div class="flex gap-3 flex-wrap">
                <UButton variant="soft" color="warning" label="Exportar dados" leading-icon="i-heroicons-arrow-down-tray" />
                <UButton variant="soft" color="error" label="Eliminar conta" leading-icon="i-heroicons-trash" />
              </div>
            </UCard>
          </div>

          <!-- SEGURANÇA TAB -->
          <div v-else-if="activeTab === 'seguranca'" class="space-y-6">
            <UCard>
              <h3 class="font-bold text-gray-900 dark:text-white mb-5">Alterar palavra-passe</h3>
              <div class="space-y-4 max-w-sm">
                <UFormField label="Palavra-passe atual">
                  <UInput v-model="security.currentPassword" type="password" />
                </UFormField>
                <UFormField label="Nova palavra-passe">
                  <UInput v-model="security.newPassword" type="password" />
                </UFormField>
                <UFormField label="Confirmar nova palavra-passe">
                  <UInput v-model="security.confirmPassword" type="password" />
                </UFormField>
                <UButton label="Alterar palavra-passe" leading-icon="i-heroicons-lock-closed" />
              </div>
            </UCard>

            <UCard>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white">Autenticação de dois fatores</h3>
                  <p class="text-sm text-gray-500 mt-1">Aumenta a segurança da tua conta com 2FA.</p>
                </div>
                <UButton variant="outline" color="neutral" label="Ativar 2FA" />
              </div>
            </UCard>
          </div>

          <!-- NOTIFICAÇÕES TAB -->
          <div v-else-if="activeTab === 'notificacoes'" class="space-y-4">
            <UCard>
              <h3 class="font-bold text-gray-900 dark:text-white mb-5">Preferências de notificação</h3>
              <div class="space-y-5">
                <div v-for="(item, key) in [
                  { key: 'visitasEmail', label: 'Visitas ao portfólio (email)', desc: 'Recebe um resumo diário das visitas.' },
                  { key: 'visitasPush', label: 'Visitas ao portfólio (push)', desc: 'Notificações em tempo real no browser.' },
                  { key: 'newsEmail', label: 'Novidades e atualizações', desc: 'Fica a saber das novas funcionalidades.' },
                  { key: 'tipsEmail', label: 'Dicas e sugestões', desc: 'Conteúdo para melhorar o teu portfólio.' }
                ]" :key="key" class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.label }}</p>
                    <p class="text-xs text-gray-500">{{ item.desc }}</p>
                  </div>
                  <UToggle v-model="notifications[item.key as keyof typeof notifications]" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- PLANO TAB -->
          <div v-else-if="activeTab === 'plano'" class="space-y-6">
            <UCard>
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white">Plano atual: <span class="text-primary-500">Gratuito</span></h3>
                  <p class="text-sm text-gray-500 mt-1">Estás a usar o plano gratuito.</p>
                </div>
                <UButton label="Fazer upgrade para Pro" trailing-icon="i-heroicons-arrow-right" />
              </div>
              <div class="mt-5 pt-5 border-t border-gray-100 dark:border-neutral-800">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">O que inclui o teu plano:</p>
                <ul class="space-y-2">
                  <li v-for="f in planFeatures" :key="f" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UIcon name="i-heroicons-check" class="text-success-500 flex-shrink-0" />
                    {{ f }}
                  </li>
                </ul>
              </div>
            </UCard>

            <UCard class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 border-primary-200 dark:border-primary-800">
              <div class="flex items-start gap-4">
                <UIcon name="i-heroicons-star" class="text-primary-500 text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white mb-1">Upgrade para Pro — €9/mês</h4>
                  <p class="text-sm text-gray-500 mb-4">Portfólios ilimitados, domínio próprio, analytics avançado e muito mais.</p>
                  <UButton label="Começar trial de 14 dias" trailing-icon="i-heroicons-arrow-right" />
                </div>
              </div>
            </UCard>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Dashboard — PortfolioSaaS' })

const toast = useToast()

const stats = [
  { label: 'Visitas este mês', value: '1.284', change: '+12%', trend: 'up', icon: 'i-heroicons-eye' },
  { label: 'Portfólios ativos', value: '3', change: '+1', trend: 'up', icon: 'i-heroicons-document-duplicate' },
  { label: 'Links partilhados', value: '47', change: '+5', trend: 'up', icon: 'i-heroicons-share' },
  { label: 'Tempo médio na página', value: '2m 34s', change: '-8s', trend: 'down', icon: 'i-heroicons-clock' }
]

const portfolios = [
  { id: 1, name: 'Portfólio Principal', slug: 'joaosilva', views: 842, lastEdit: 'Hoje, 14:32', status: 'published', template: 'Moderno', thumb: 'from-primary-400 to-primary-600' },
  { id: 2, name: 'Portfolio Criativo', slug: 'joaosilva-creative', views: 312, lastEdit: 'Ontem', status: 'published', template: 'Editorial', thumb: 'from-secondary-400 to-secondary-600' },
  { id: 3, name: 'CV Digital', slug: 'joaosilva-cv', views: 130, lastEdit: 'Há 3 dias', status: 'draft', template: 'Minimalista', thumb: 'from-neutral-400 to-neutral-600' }
]

const activities = [
  { icon: 'i-heroicons-eye', text: 'O teu portfólio foi visitado por alguém em Lisboa', time: 'Há 5 min', color: 'text-primary-500' },
  { icon: 'i-heroicons-link', text: 'Link do Portfolio Criativo partilhado via WhatsApp', time: 'Há 1h', color: 'text-secondary-500' },
  { icon: 'i-heroicons-pencil-square', text: 'Portfólio Principal editado', time: 'Hoje, 14:32', color: 'text-success-500' },
  { icon: 'i-heroicons-eye', text: 'CV Digital visitado 5 vezes seguidas', time: 'Ontem, 22:10', color: 'text-primary-500' },
  { icon: 'i-heroicons-plus-circle', text: 'Novo portfólio "CV Digital" criado', time: 'Há 3 dias', color: 'text-success-500' }
]

function deletePortfolio(id: number) {
  toast.add({ title: 'Portfólio eliminado', color: 'error' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">

    <!-- ===== SIDEBAR (desktop) ===== -->
    <aside class="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-800 flex-col">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100 dark:border-neutral-800">
        <div class="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-sparkles" class="text-white text-xs" />
        </div>
        <span class="font-bold text-gray-900 dark:text-white">PortfolioSaaS</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium text-sm">
          <UIcon name="i-heroicons-squares-2x2" class="text-lg" />
          Dashboard
        </NuxtLink>
        <NuxtLink to="/editor" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-pencil-square" class="text-lg" />
          Editor
        </NuxtLink>
        <NuxtLink to="/perfil" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-user-circle" class="text-lg" />
          Perfil
        </NuxtLink>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-chart-bar" class="text-lg" />
          Analytics
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm transition-colors">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-lg" />
          Definições
        </a>
      </nav>

      <!-- User -->
      <div class="p-4 border-t border-gray-100 dark:border-neutral-800">
        <div class="flex items-center gap-3">
          <UAvatar text="JS" size="sm" class="bg-gradient-to-br from-primary-400 to-secondary-500 text-white" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">João Silva</p>
            <p class="text-xs text-gray-400 truncate">Plano Gratuito</p>
          </div>
          <UButton variant="ghost" color="neutral" icon="i-heroicons-arrow-right-on-rectangle" size="xs" to="/login" />
        </div>
      </div>
    </aside>

    <!-- ===== MAIN CONTENT ===== -->
    <main class="lg:pl-64">

      <!-- Header -->
      <div class="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur border-b border-gray-100 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div>
          <h1 class="font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p class="text-xs text-gray-400">Sexta, 27 de Fevereiro de 2026</p>
        </div>
        <div class="flex items-center gap-2">
          <UButton variant="ghost" color="neutral" icon="i-heroicons-bell" size="sm" />
          <UButton to="/editor" size="sm" label="Novo portfólio" leading-icon="i-heroicons-plus" />
        </div>
      </div>

      <div class="p-4 sm:p-6 lg:p-8 space-y-8">

        <!-- Boas-vindas -->
        <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <h2 class="text-xl font-bold mb-1 relative">Olá, João 👋</h2>
          <p class="text-white/80 text-sm relative mb-4">O teu portfólio teve <strong>84 visitas</strong> nas últimas 24h!</p>
          <UButton color="white" variant="solid" size="sm" label="Ver analytics" trailing-icon="i-heroicons-arrow-right" />
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard v-for="stat in stats" :key="stat.label" class="hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-3">
              <div class="w-9 h-9 bg-gray-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                <UIcon :name="stat.icon" class="text-gray-500 dark:text-gray-400" />
              </div>
              <UBadge
                :color="stat.trend === 'up' ? 'success' : 'error'"
                variant="soft"
                :label="stat.change"
                size="sm"
              />
            </div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ stat.label }}</p>
          </UCard>
        </div>

        <!-- Portfólios + Actividade -->
        <div class="grid lg:grid-cols-3 gap-6">

          <!-- Portfólios -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-900 dark:text-white">Os meus portfólios</h3>
              <UButton to="/editor" variant="ghost" size="sm" label="Novo" leading-icon="i-heroicons-plus" />
            </div>
            <div class="space-y-3">
              <UCard
                v-for="p in portfolios"
                :key="p.id"
                class="hover:shadow-md transition-all duration-200 group"
              >
                <div class="flex items-center gap-4">
                  <!-- Thumbnail -->
                  <div :class="`w-14 h-14 rounded-xl bg-gradient-to-br ${p.thumb} flex-shrink-0`" />
                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                      <p class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ p.name }}</p>
                      <UBadge
                        :color="p.status === 'published' ? 'success' : 'neutral'"
                        :label="p.status === 'published' ? 'Publicado' : 'Rascunho'"
                        variant="soft"
                        size="xs"
                      />
                    </div>
                    <p class="text-xs text-gray-400">{{ p.slug }} · {{ p.template }}</p>
                    <div class="flex items-center gap-3 mt-1.5">
                      <span class="text-xs text-gray-500 flex items-center gap-1">
                        <UIcon name="i-heroicons-eye" class="text-xs" />
                        {{ p.views }} visitas
                      </span>
                      <span class="text-xs text-gray-400">Editado {{ p.lastEdit }}</span>
                    </div>
                  </div>
                  <!-- Actions -->
                  <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <UButton variant="ghost" color="neutral" icon="i-heroicons-pencil-square" size="xs" to="/editor" />
                    <UButton variant="ghost" color="neutral" icon="i-heroicons-arrow-top-right-on-square" size="xs" />
                    <UButton variant="ghost" color="error" icon="i-heroicons-trash" size="xs" @click="deletePortfolio(p.id)" />
                  </div>
                </div>
              </UCard>
            </div>
          </div>

          <!-- Actividade recente -->
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">Actividade recente</h3>
            <UCard>
              <div class="space-y-4">
                <div v-for="(act, i) in activities" :key="i" class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UIcon :name="act.icon" :class="`text-sm ${act.color}`" />
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{{ act.text }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ act.time }}</p>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Upgrade banner (se plano free) -->
        <UCard class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-star" class="text-amber-500 text-2xl flex-shrink-0" />
              <div>
                <p class="font-semibold text-gray-900 dark:text-white text-sm">Passa para o Pro e desbloqueia tudo</p>
                <p class="text-xs text-gray-500">Domínio próprio, analytics avançado, templates premium e muito mais.</p>
              </div>
            </div>
            <UButton color="warning" variant="soft" label="Ver planos" size="sm" trailing-icon="i-heroicons-arrow-right" />
          </div>
        </UCard>

      </div>
    </main>
  </div>
</template>

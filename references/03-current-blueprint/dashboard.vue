<script setup lang="ts">
// Dizemos ao Nuxt para envelopar esta página com o nosso menu lateral
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Dashboard — MeuSaaS' })

const toast = useToast()

// Dados simulados (Mock)
const stats = [
  { label: 'Visitas este mês', value: '1.284', change: '+12%', trend: 'up', icon: 'i-heroicons-eye' },
  { label: 'Portfólios ativos', value: '3', change: '+1', trend: 'up', icon: 'i-heroicons-document-duplicate' },
  { label: 'Links partilhados', value: '47', change: '+5', trend: 'up', icon: 'i-heroicons-share' },
  { label: 'Tempo médio na página', value: '2m 34s', change: '-8s', trend: 'down', icon: 'i-heroicons-clock' }
]

const portfolios = [
  { id: 1, name: 'Portfólio Principal', slug: 'joaosilva', views: 842, lastEdit: 'Hoje, 14:32', status: 'published', template: 'Moderno', thumb: 'from-primary-400 to-primary-600' },
  { id: 2, name: 'Portfolio Criativo', slug: 'joaosilva-creative', views: 312, lastEdit: 'Ontem', status: 'published', template: 'Editorial', thumb: 'from-secondary-400 to-secondary-600' },
  { id: 3, name: 'CV Digital', slug: 'joaosilva-cv', views: 130, lastEdit: 'Há 3 dias', status: 'draft', template: 'Minimalista', thumb: 'from-gray-400 to-gray-600' }
]

const activities = [
  { icon: 'i-heroicons-eye', text: 'O teu portfólio foi visitado por alguém em Lisboa', time: 'Há 5 min', color: 'text-primary-500' },
  { icon: 'i-heroicons-link', text: 'Link do Portfolio Criativo partilhado via WhatsApp', time: 'Há 1h', color: 'text-secondary-500' },
  { icon: 'i-heroicons-pencil-square', text: 'Portfólio Principal editado', time: 'Hoje, 14:32', color: 'text-success-500' },
  { icon: 'i-heroicons-plus-circle', text: 'Novo portfólio "CV Digital" criado', time: 'Há 3 dias', color: 'text-success-500' }
]

function deletePortfolio(id: number) {
  toast.add({ title: 'Portfólio eliminado', color: 'error', icon: 'i-heroicons-trash' })
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Bem-vindo de volta! Aqui está o teu resumo.</p>
      </div>
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="gray" icon="i-heroicons-bell" size="md" />
        <UButton to="/editor/novo" size="md" label="Novo portfólio" icon="i-heroicons-plus" color="primary" />
      </div>
    </header>

    <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
      <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <h2 class="text-xl font-bold mb-1 relative">Olá, João 👋</h2>
      <p class="text-white/80 text-sm relative mb-4">O teu portfólio principal teve <strong>84 visitas</strong> nas últimas 24h!</p>
      <UButton color="white" variant="solid" size="sm" label="Ver analytics" trailing-icon="i-heroicons-arrow-right" class="text-primary-600" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
            <UIcon :name="stat.icon" class="text-gray-600 dark:text-gray-400 text-lg" />
          </div>
          <UBadge :color="stat.trend === 'up' ? 'success' : 'error'" variant="subtle" size="sm">
            {{ stat.change }}
          </UBadge>
        </div>
        <p class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ stat.value }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
      </UCard>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">

      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-gray-900 dark:text-white text-lg">Os meus portfólios</h3>
          <UButton to="/dashboard/layouts" variant="ghost" size="sm" color="primary" label="Ver todos" trailing-icon="i-heroicons-arrow-right" />
        </div>
        
        <UCard v-for="p in portfolios" :key="p.id" class="group transition-shadow hover:shadow-md">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div :class="`w-16 h-16 rounded-xl bg-gradient-to-br ${p.thumb} flex-shrink-0`" />
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="font-bold text-gray-900 dark:text-white truncate">{{ p.name }}</p>
                <UBadge :color="p.status === 'published' ? 'success' : 'gray'" variant="soft" size="xs">
                  {{ p.status === 'published' ? 'Publicado' : 'Rascunho' }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-500 truncate">{{ p.slug }} · Tema: {{ p.template }}</p>
              <div class="flex items-center gap-4 mt-2">
                <span class="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <UIcon name="i-heroicons-eye" class="text-sm" /> {{ p.views }} visitas
                </span>
                <span class="text-xs text-gray-400">Editado {{ p.lastEdit }}</span>
              </div>
            </div>

            <div class="flex gap-2 mt-4 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton variant="soft" color="gray" icon="i-heroicons-pencil-square" size="sm" to="/editor/1" />
              <UButton variant="soft" color="gray" icon="i-heroicons-arrow-top-right-on-square" size="sm" />
              <UButton variant="soft" color="error" icon="i-heroicons-trash" size="sm" @click="deletePortfolio(p.id)" />
            </div>
          </div>
        </UCard>
      </div>

      <div class="space-y-4">
        <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2">Atividade Recente</h3>
        <UCard>
          <div class="space-y-6">
            <div v-for="(act, i) in activities" :key="i" class="flex gap-4">
              <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <UIcon :name="act.icon" :class="act.color" />
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ act.text }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ act.time }}</p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

    </div>

    <UCard class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-star" class="text-amber-500 text-3xl flex-shrink-0" />
          <div>
            <p class="font-bold text-gray-900 dark:text-white">Passa para o Pro e desbloqueia tudo</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Domínio próprio, analytics avançado, templates premium e muito mais.</p>
          </div>
        </div>
        <UButton color="amber" variant="solid" label="Ver planos" trailing-icon="i-heroicons-arrow-right" class="w-full sm:w-auto flex justify-center" />
      </div>
    </UCard>

  </div>
</template>
<script setup lang="ts">
// pages/dashboard/index.vue
import { ref } from 'vue'

// Define o layout do painel administrativo
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Visão Geral — PortfolioSaaS' })

// Dados simulados do usuário logado
const user = { 
  nome: 'João Silva',
  plano: 'Gratuito'
}

// Estatísticas de performance do portfólio
const stats = [
  { label: 'Visitas Totais', value: '1.284', icon: 'i-heroicons-eye', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-950/30', trend: '+12%', trendUp: true },
  { label: 'Downloads do CV', value: '85', icon: 'i-heroicons-document-arrow-down', color: 'text-secondary-500', bg: 'bg-secondary-50 dark:bg-secondary-950/30', trend: '+5%', trendUp: true },
  { label: 'Tempo Médio', value: '2m 14s', icon: 'i-heroicons-clock', color: 'text-tertiary-500', bg: 'bg-tertiary-50 dark:bg-tertiary-950/30', trend: '-2%', trendUp: false },
  { label: 'Projetos Publicados', value: '12', icon: 'i-heroicons-folder-open', color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-950/30', trend: '0%', trendUp: true },
]

// Feed de atividades recentes
const recentActivity = [
  { id: 1, event: 'Nova visita de São Paulo, BR', time: 'há 2 minutos' },
  { id: 2, event: 'Download do seu currículo', time: 'há 45 minutos' },
  { id: 3, event: 'Projeto "App de Entregas" atualizado', time: 'há 3 horas' },
  { id: 4, event: 'Visita via link do LinkedIn', time: 'há 5 horas' },
]

// Controle da barra de armazenamento
const storageUsed = ref(15) // Em Megabytes
const storageMax = ref(100) // Em Megabytes (Plano Gratuito)
</script>

<template>
  <div class="flex-1 p-4 sm:p-6 lg:p-8">
    
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Olá, {{ user.nome.split(' ')[0] }}! 👋</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Veja o que aconteceu no seu portfólio nos últimos 7 dias.</p>
      </div>
      <div class="flex items-center gap-3">
        <UButton color="gray" variant="outline" label="Ver meu site" icon="i-heroicons-arrow-top-right-on-square" to="/" target="_blank" />
        <UButton color="primary" label="Editar Portfólio" icon="i-heroicons-paint-brush" to="/dashboard/editor" />
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="stat in stats" 
        :key="stat.label" 
        class="surface-panel p-5 transition-transform hover:-translate-y-1"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <h3 class="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{{ stat.value }}</h3>
          </div>
          <div :class="[stat.color, stat.bg, 'p-2.5 rounded-xl']">
            <UIcon :name="stat.icon" class="text-xl" />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <UBadge 
            :color="stat.trendUp ? 'success' : 'error'" 
            variant="subtle" 
            size="xs"
            class="font-bold"
          >
            {{ stat.trend }}
          </UBadge>
          <span class="text-xs text-gray-400">vs semana passada</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        
        <UCard class="surface-panel overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-gray-900 dark:text-white">Estado do Portfólio</h3>
              <div class="flex items-center gap-2">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                </span>
                <span class="text-sm font-medium text-success-600 dark:text-success-400">Online</span>
              </div>
            </div>
          </template>
          
          <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-56 h-36 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative group">
              <div class="h-4 bg-gray-200 dark:bg-gray-900 w-full flex gap-1 items-center px-2">
                <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              </div>
              <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                <UIcon name="i-heroicons-photo" class="text-4xl text-gray-400 opacity-50" />
              </div>
            </div>
            
            <div class="flex-1 flex flex-col justify-between py-1">
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">Tema Ativo: <span class="text-primary-500">Neon Spectrum</span></p>
                <p class="text-xs text-gray-500 mt-1">Última publicação: Hoje às 10:32</p>
              </div>
              
              <div class="space-y-2 mt-4 md:mt-0">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500 font-medium">Armazenamento (Imagens e CV)</span>
                  <span class="text-gray-900 dark:text-white font-bold">{{ storageUsed }} MB / {{ storageMax }} MB</span>
                </div>
                <UProgress :value="storageUsed" :max="storageMax" color="primary" size="sm" />
                <p class="text-[10px] text-gray-400 text-right">Plano {{ user.plano }}</p>
              </div>
            </div>
          </div>
        </UCard>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NuxtLink to="/dashboard/projetos/novo" class="surface-panel p-4 flex flex-col items-center justify-center gap-2 hover:border-primary-500 transition-colors group cursor-pointer text-center">
            <UIcon name="i-heroicons-plus-circle" class="text-2xl text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Novo Projeto</span>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/temas" class="surface-panel p-4 flex flex-col items-center justify-center gap-2 hover:border-secondary-500 transition-colors group cursor-pointer text-center">
            <UIcon name="i-heroicons-swatch" class="text-2xl text-gray-400 group-hover:text-secondary-500 transition-colors" />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Trocar Tema</span>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/perfil" class="surface-panel p-4 flex flex-col items-center justify-center gap-2 hover:border-tertiary-500 transition-colors group cursor-pointer text-center">
            <UIcon name="i-heroicons-document-text" class="text-2xl text-gray-400 group-hover:text-tertiary-500 transition-colors" />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Atualizar CV</span>
          </NuxtLink>
          
          <button class="surface-panel p-4 flex flex-col items-center justify-center gap-2 hover:border-success-500 transition-colors group cursor-pointer text-center">
            <UIcon name="i-heroicons-share" class="text-2xl text-gray-400 group-hover:text-success-500 transition-colors" />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Compartilhar</span>
          </button>
        </div>
      </div>

      <UCard class="surface-panel h-fit">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-bolt" class="text-primary-500" />
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Atividade Recente</h3>
          </div>
        </template>
        
        <div class="space-y-6">
          <div v-for="item in recentActivity" :key="item.id" class="flex gap-4">
            <div class="relative flex flex-col items-center">
              <div class="w-2.5 h-2.5 mt-1 rounded-full bg-primary-500 ring-4 ring-primary-50 dark:ring-primary-950/50" />
              <div v-if="item.id !== recentActivity.length" class="w-px h-full bg-gray-200 dark:bg-gray-800 mt-1 absolute top-3" />
            </div>
            
            <div class="pb-2">
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-tight font-medium">{{ item.event }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ item.time }}</p>
            </div>
          </div>
          
          <UButton variant="ghost" color="gray" label="Ver todo o histórico" block size="sm" class="mt-2 text-xs" />
        </div>
      </UCard>

    </div>
  </div>
</template>
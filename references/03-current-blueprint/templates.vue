<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Escolher Template — PortfolioSaaS' })

const categories = ['Todos', 'Minimalista', 'Criativo', 'Profissional', 'Dark Mode']
const selectedCategory = ref('Todos')

const templates = [
  { 
    id: 1, 
    name: 'Berlim', 
    category: 'Minimalista', 
    tier: 'Free',
    preview: 'from-gray-100 to-gray-300',
    description: 'Focado em tipografia limpa e muito espaço em branco.'
  },
  { 
    id: 2, 
    name: 'Tóquio', 
    category: 'Criativo', 
    tier: 'Pro',
    preview: 'from-purple-500 to-pink-500',
    description: 'Layout dinâmico com animações de entrada arrojadas.'
  },
  { 
    id: 3, 
    name: 'Nova Iorque', 
    category: 'Profissional', 
    tier: 'Free',
    preview: 'from-blue-600 to-slate-800',
    description: 'Ideal para consultores e engenheiros de software.'
  },
  { 
    id: 4, 
    name: 'Londres', 
    category: 'Dark Mode', 
    tier: 'Pro',
    preview: 'from-neutral-800 to-neutral-950',
    description: 'Elegância em tons escuros com detalhes em néon.'
  }
]

// Filtro reativo
const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'Todos') return templates
  return templates.filter(t => t.category === selectedCategory.value)
})

function selectTemplate(id: number) {
  // Aqui navegarias para o editor já com o template ID
  console.log('Template selecionado:', id)
  navigateTo('/editor/novo')
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    
    <header>
      <UButton 
        to="/dashboard" 
        icon="i-heroicons-arrow-left" 
        variant="ghost" 
        color="gray" 
        label="Voltar ao Dashboard" 
        class="-ml-2 mb-4"
      />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Escolhe o teu ponto de partida</h1>
      <p class="text-gray-500 mt-2">Seleciona um template para começar a criar o teu portfólio. Podes mudar as cores e fontes depois.</p>
    </header>

    <div class="flex flex-wrap gap-2 border-b border-gray-100 dark:border-neutral-800 pb-6">
      <UButton
        v-for="cat in categories"
        :key="cat"
        :label="cat"
        :variant="selectedCategory === cat ? 'solid' : 'ghost'"
        :color="selectedCategory === cat ? 'primary' : 'gray'"
        rounded="full"
        @click="selectedCategory = cat"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <UCard 
        v-for="temp in filteredTemplates" 
        :key="temp.id"
        class="group overflow-hidden flex flex-col"
        :ui="{ body: { padding: 'p-0' } }"
      >
        <div :class="`aspect-[4/3] bg-gradient-to-br ${temp.preview} relative overflow-hidden`">
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <UButton color="white" variant="solid" label="Pré-visualizar" icon="i-heroicons-eye" />
            <UButton color="primary" label="Usar este" icon="i-heroicons-check" @click="selectTemplate(temp.id)" />
          </div>
          
          <div class="absolute top-3 right-3">
            <UBadge :color="temp.tier === 'Pro' ? 'amber' : 'gray'" variant="solid">
              {{ temp.tier }}
            </UBadge>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ temp.name }}</h3>
            <span class="text-xs font-medium text-primary-500 uppercase tracking-wider">{{ temp.category }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ temp.description }}
          </p>
        </div>
      </UCard>
    </div>

    <div v-if="filteredTemplates.length === 0" class="py-20 text-center">
      <UIcon name="i-heroicons-magnifying-glass" class="text-5xl text-gray-300 mb-4" />
      <p class="text-gray-500">Não encontrámos templates nesta categoria.</p>
    </div>

  </div>
</template>
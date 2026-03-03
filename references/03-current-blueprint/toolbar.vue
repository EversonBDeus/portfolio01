<script setup lang="ts">
// pages/dashboard/projetos/index.vue
import { ref, computed } from 'vue'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Meus Projetos — PortfolioSaaS' })

const toast = useToast()

// Campo de pesquisa
const search = ref('')

// Simulando os projetos vindos da base de dados (Supabase/API)
const projects = ref([
  {
    id: 1,
    title: 'App de Entregas FastFood',
    description: 'Design de interface e experiência de utilizador para uma app de entregas local.',
    image: 'https://images.unsplash.com/photo-1607004468138-c7e4f16509ea?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    tags: ['UX Design', 'Figma']
  },
  {
    id: 2,
    title: 'Dashboard Financeiro',
    description: 'Painel administrativo desenvolvido em Vue.js para gestão de finanças.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    tags: ['Front-end', 'Vue.js']
  },
  {
    id: 3,
    title: 'Landing Page SaaS',
    description: 'Página de conversão focada em alta performance e SEO.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    status: 'draft',
    tags: ['Web Design', 'Nuxt']
  }
])

// Filtra os projetos de acordo com a pesquisa
const filteredProjects = computed(() => {
  if (!search.value) return projects.value
  return projects.value.filter(p => 
    p.title.toLowerCase().includes(search.value.toLowerCase()) ||
    p.tags.some(tag => tag.toLowerCase().includes(search.value.toLowerCase()))
  )
})

// Opções do menu de 3 pontinhos (Dropdown) de cada card
const getProjectActions = (project: any) => [
  [
    {
      label: 'Editar projeto',
      icon: 'i-heroicons-pencil-square',
      to: `/dashboard/projetos/${project.id}`
    },
    {
      label: project.status === 'published' ? 'Mover para rascunho' : 'Publicar agora',
      icon: project.status === 'published' ? 'i-heroicons-eye-slash' : 'i-heroicons-eye',
      click: () => {
        project.status = project.status === 'published' ? 'draft' : 'published'
        toast.add({ title: 'Status atualizado com sucesso!', color: 'success' })
      }
    }
  ],
  [
    {
      label: 'Excluir',
      icon: 'i-heroicons-trash',
      color: 'red',
      click: () => {
        projects.value = projects.value.filter(p => p.id !== project.id)
        toast.add({ title: 'Projeto excluído.', color: 'gray' })
      }
    }
  ]
]
</script>

<template>
  <div class="flex-1 p-4 sm:p-6 lg:p-8">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Meus Projetos</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gira os trabalhos que aparecem no seu portfólio.</p>
      </div>
      <UButton 
        color="primary" 
        size="lg" 
        icon="i-heroicons-plus" 
        label="Novo Projeto" 
        to="/dashboard/projetos/novo" 
      />
    </header>

    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Pesquisar projetos ou tags..."
        class="w-full sm:w-96"
        size="md"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="search !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark"
            :padded="false"
            @click="search = ''"
          />
        </template>
      </UInput>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <span class="text-sm text-gray-500">Filtrar por:</span>
        <USelect 
          :options="['Todos', 'Publicados', 'Rascunhos']" 
          size="md"
          class="w-full sm:w-40"
        />
      </div>
    </div>

    <div v-if="filteredProjects.length === 0" class="surface-panel flex flex-col items-center justify-center p-12 text-center mt-8">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <UIcon name="i-heroicons-folder-open" class="text-3xl text-gray-400" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhum projeto encontrado</h3>
      <p class="text-gray-500 max-w-sm mx-auto mb-6">
        {{ search ? 'Tente procurar com outras palavras.' : 'Ainda não adicionaste nenhum trabalho ao teu portfólio.' }}
      </p>
      <UButton 
        v-if="!search"
        color="primary" 
        variant="soft" 
        icon="i-heroicons-plus" 
        label="Adicionar o primeiro projeto" 
        to="/dashboard/projetos/novo" 
      />
      <UButton 
        v-else
        color="gray" 
        variant="ghost" 
        label="Limpar pesquisa" 
        @click="search = ''" 
      />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <UCard 
        v-for="project in filteredProjects" 
        :key="project.id" 
        class="surface-panel flex flex-col overflow-hidden transition-all hover:shadow-xl hover:border-primary-500/50 group"
        :ui="{ body: { padding: 'p-0 sm:p-0' }, footer: { padding: 'p-4' } }"
      >
        <div class="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <img 
            :src="project.image" 
            :alt="project.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-3 left-3">
            <UBadge 
              :color="project.status === 'published' ? 'success' : 'warning'" 
              variant="solid"
              size="sm"
            >
              {{ project.status === 'published' ? 'Publicado' : 'Rascunho' }}
            </UBadge>
          </div>
          <div class="absolute top-3 right-3">
            <UDropdown :items="getProjectActions(project)" :popper="{ placement: 'bottom-end' }">
              <UButton color="white" variant="solid" icon="i-heroicons-ellipsis-horizontal" class="shadow-sm" />
            </UDropdown>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{{ project.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
            {{ project.description }}
          </p>
          
          <div class="flex flex-wrap gap-2 mt-auto">
            <UBadge 
              v-for="tag in project.tags" 
              :key="tag" 
              color="gray" 
              variant="soft" 
              size="xs"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </UCard>

    </div>

  </div>
</template>
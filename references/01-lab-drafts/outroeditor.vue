<script setup lang="ts">
// pages/dashboard/editor.vue
import { ref } from 'vue'

// Desativa o layout padrão para que o editor ocupe 100% da tela
definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Editor de Layout - Meu SaaS'
})

const toast = useToast()
const router = useRouter()

// Controle da visualização (mockup)
const viewMode = ref<'mobile' | 'desktop'>('mobile')

// Itens do menu sanfona (Sidebar)
const editorSections = [
  {
    label: 'Identidade Visual',
    icon: 'i-heroicons-paint-brush',
    content: 'Configurações de logotipo, paleta de cores e favicon.'
  },
  {
    label: 'Tipografia',
    icon: 'i-heroicons-language',
    content: 'Escolha as fontes para os títulos e para os textos do corpo.'
  },
  {
    label: 'Seções da Página',
    icon: 'i-heroicons-view-columns',
    content: 'Reorganize, adicione ou remova blocos como "Sobre mim", "Projetos" e "Contato".'
  }
]

// Ação de publicar
function publishChanges() {
  toast.add({
    title: 'Alterações publicadas!',
    description: 'Seu portfólio foi atualizado com sucesso.',
    color: 'success'
  })
}

// Voltar para o Dashboard
function goBack() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
    
    <header class="h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shrink-0 z-10">
      
      <div class="flex items-center gap-4 w-1/3">
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="goBack" aria-label="Fechar editor" />
        <div class="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4">
          <h1 class="font-semibold text-gray-900 dark:text-white">Editar layout</h1>
          <UBadge color="success" variant="subtle" size="sm">Salvo</UBadge>
        </div>
      </div>

      <div class="flex items-center justify-center w-1/3">
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center gap-1">
          <UButton 
            :color="viewMode === 'mobile' ? 'primary' : 'gray'" 
            :variant="viewMode === 'mobile' ? 'solid' : 'ghost'"
            icon="i-heroicons-device-phone-mobile" 
            size="sm" 
            @click="viewMode = 'mobile'"
          >
            Celular
          </UButton>
          <UButton 
            :color="viewMode === 'desktop' ? 'primary' : 'gray'" 
            :variant="viewMode === 'desktop' ? 'solid' : 'ghost'"
            icon="i-heroicons-computer-desktop" 
            size="sm" 
            @click="viewMode = 'desktop'"
          >
            Computador
          </UButton>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 w-1/3">
        <UButton color="gray" variant="ghost" icon="i-heroicons-question-mark-circle">Ajuda</UButton>
        <UButton color="gray" variant="outline" icon="i-heroicons-arrow-top-right-on-square">Ver site</UButton>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      
      <aside class="w-[320px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Configurações Globais</p>
          
          <UAccordion :items="editorSections">
            <template #item="{ item }">
              <p class="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                {{ item.content }}
                </p>
            </template>
          </UAccordion>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <UButton block color="primary" size="lg" @click="publishChanges">
            Publicar Alterações
          </UButton>
        </div>
      </aside>

      <main class="flex-1 bg-[#f0f0f0] dark:bg-gray-900 flex items-center justify-center p-8 overflow-y-auto relative">
        
        <div 
          class="bg-white dark:bg-gray-950 shadow-2xl rounded-2xl overflow-hidden border-8 border-gray-800 dark:border-gray-700 transition-all duration-500 ease-in-out relative flex flex-col"
          :class="[
            viewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-[1024px] h-[700px]'
          ]"
        >
          <div class="h-6 bg-gray-100 dark:bg-gray-900 w-full flex items-center justify-center shrink-0 border-b border-gray-200 dark:border-gray-800">
            <div class="w-24 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
             <div class="text-center text-gray-400">
               <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 mx-auto mb-2 opacity-50" />
               <p class="text-sm">Preview do seu portfólio aparecerá aqui.</p>
               <p class="text-xs mt-1">(Usaremos um iframe ou um componente renderizado)</p>
             </div>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>
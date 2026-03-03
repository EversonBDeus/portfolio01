<script setup lang="ts">
import { ref } from 'vue'

// O Nuxt permite criar layouts específicos para páginas.
// Como o editor ocupa o ecrã todo, não queremos o Header e Footer normais.
definePageMeta({
  layout: false // Desativa o default.vue para usar a página inteira
})

// 1. Controlo de Visualização (Toggle Celular/Computador)
const viewMode = ref<'mobile' | 'desktop'>('mobile')

// 2. Opções da Sidebar usando o UAccordion do Nuxt UI
const ferramentas = [
  {
    label: 'Identidade Visual',
    icon: 'i-heroicons-swatch',
    defaultOpen: true,
    slot: 'identidade' // Nome do slot para personalizar o conteúdo interno
  },
  {
    label: 'Tipografia',
    icon: 'i-heroicons-language',
    slot: 'tipografia'
  },
  {
    label: 'Seções da Página',
    icon: 'i-heroicons-view-columns',
    slot: 'secoes'
  }
]

// 3. Função de Ação Principal
function publicarAlteracoes() {
  console.log('A guardar e publicar o layout...')
  // Aqui entraria a chamada à tua API/Pinia para guardar os dados
}
</script>

<template>
  <div class="h-screen w-full flex flex-col overflow-hidden bg-white text-slate-800 dark:bg-neutral-950 dark:text-slate-200">
    
    <header class="h-16 flex-shrink-0 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-white dark:bg-neutral-900">
      
      <div class="flex items-center gap-4">
        <UButton to="/dashboard/layouts" icon="i-heroicons-x-mark" variant="ghost" color="gray" aria-label="Fechar editor" />
        <h1 class="font-semibold text-lg hidden sm:block">Editar layout</h1>
        <UBadge color="success" variant="subtle" class="ml-2">Salvo</UBadge>
      </div>

      <div class="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <UButton 
          icon="i-heroicons-device-phone-mobile" 
          :variant="viewMode === 'mobile' ? 'solid' : 'ghost'" 
          :color="viewMode === 'mobile' ? 'primary' : 'gray'"
          @click="viewMode = 'mobile'"
        />
        <UButton 
          icon="i-heroicons-computer-desktop" 
          :variant="viewMode === 'desktop' ? 'solid' : 'ghost'" 
          :color="viewMode === 'desktop' ? 'primary' : 'gray'"
          @click="viewMode = 'desktop'"
        />
      </div>

      <div class="flex items-center gap-4">
        <ULink to="#" class="text-sm font-medium text-gray-500 hover:text-primary hidden md:block">Ajuda</ULink>
        <UButton variant="outline" label="Ver site ao vivo" icon="i-heroicons-arrow-top-right-on-square" />
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      
      <aside class="w-[300px] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-neutral-900">
        
        <div class="flex-1 overflow-y-auto p-4">
          <UAccordion :items="ferramentas" multiple>
            
            <template #identidade>
              <div class="text-sm text-gray-500 dark:text-gray-400 p-2 space-y-4">
                <div class="space-y-2">
                  <label class="font-medium text-slate-700 dark:text-slate-300">Cor Principal</label>
                  <div class="flex gap-2">
                    <div class="w-8 h-8 rounded-full bg-indigo-500 cursor-pointer ring-2 ring-offset-1 ring-indigo-500"></div>
                    <div class="w-8 h-8 rounded-full bg-rose-500 cursor-pointer"></div>
                    <div class="w-8 h-8 rounded-full bg-emerald-500 cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </template>
            
            <template #tipografia>
              <div class="text-sm text-gray-500 p-2">Configurações de fontes aqui...</div>
            </template>

            <template #secoes>
              <div class="text-sm text-gray-500 p-2">Arraste e solte seções aqui...</div>
            </template>

          </UAccordion>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
          <UButton block color="primary" label="Publicar Alterações" size="lg" @click="publicarAlteracoes" />
        </div>
      </aside>

      <main class="flex-1 bg-[#f0f0f0] dark:bg-neutral-800 overflow-y-auto flex items-center justify-center p-8">
        
        <div 
          class="bg-white dark:bg-black rounded-[2.5rem] shadow-xl border-[8px] border-slate-900 dark:border-neutral-700 overflow-hidden relative transition-all duration-500 ease-in-out"
          :class="viewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full max-w-5xl h-full rounded-lg border-4'"
        >
          <div v-if="viewMode === 'mobile'" class="absolute top-0 inset-x-0 h-6 flex justify-center z-10">
            <div class="w-32 h-6 bg-slate-900 rounded-b-xl"></div>
          </div>

          <div class="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 pt-8 px-4 text-center text-gray-400 flex flex-col items-center justify-center">
             <UIcon name="i-heroicons-photo" class="text-4xl mb-4" />
             <p>O portfólio será renderizado aqui.</p>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>
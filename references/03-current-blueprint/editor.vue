<script setup lang="ts">
import { ref, reactive } from 'vue'

// Este ecrã não usa o layout padrão (ocupa a tela toda)
definePageMeta({ layout: false })
useSeoMeta({ title: 'Editor — MeuSaaS' })

const toast = useToast()
const previewMode = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const activeSection = ref('sobre')
const isSaving = ref(false)
const isDirty = ref(false)

const portfolio = reactive({
  name: 'Portfólio Principal',
  template: 'moderno',
  primaryColor: '#3b82f6',
  sobre: { nome: 'João Silva', titulo: 'Designer UX', bio: 'Apaixonado por criar experiências...', location: 'Lisboa', email: '', github: '' },
  projetos: [{ id: 1, titulo: 'App de Finanças', desc: 'UX Design para app iOS', tags: ['UX', 'Mobile'], img: 'from-blue-400 to-blue-600' }],
  habilidades: ['UX Design', 'Figma', 'React']
})

const sections = [
  { id: 'sobre', label: 'Sobre mim', icon: 'i-heroicons-user' },
  { id: 'projetos', label: 'Projetos', icon: 'i-heroicons-squares-2x2' },
  { id: 'habilidades', label: 'Habilidades', icon: 'i-heroicons-wrench-screwdriver' },
  { id: 'aparencia', label: 'Aparência', icon: 'i-heroicons-paint-brush' }
]

const previewWidths = { desktop: 'w-full', tablet: 'max-w-[768px] mx-auto', mobile: 'max-w-[375px] mx-auto rounded-3xl border-8 border-slate-900' }

async function save() {
  isSaving.value = true
  await new Promise(r => setTimeout(r, 1200))
  isSaving.value = false; isDirty.value = false
  toast.add({ title: 'Guardado!', color: 'success' })
}
function markDirty() { isDirty.value = true }
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-100 dark:bg-neutral-950 overflow-hidden">

    <header class="flex items-center justify-between px-4 h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0 z-20">
      <div class="flex items-center gap-3">
        <UButton to="/dashboard/layouts" variant="ghost" color="gray" icon="i-heroicons-arrow-left" size="sm" />
        <div class="w-px h-5 bg-gray-200 dark:bg-neutral-700" />
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-sparkles" class="text-primary-500" />
          <span class="font-semibold text-gray-900 dark:text-white">{{ portfolio.name }}</span>
          <UBadge v-if="isDirty" color="warning" variant="subtle" size="xs">Não guardado</UBadge>
        </div>
      </div>

      <div class="flex items-center bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
        <UButton icon="i-heroicons-computer-desktop" :variant="previewMode === 'desktop' ? 'solid' : 'ghost'" color="gray" @click="previewMode = 'desktop'" />
        <UButton icon="i-heroicons-tablet-smartphone" :variant="previewMode === 'tablet' ? 'solid' : 'ghost'" color="gray" @click="previewMode = 'tablet'" />
        <UButton icon="i-heroicons-device-phone-mobile" :variant="previewMode === 'mobile' ? 'solid' : 'ghost'" color="gray" @click="previewMode = 'mobile'" />
      </div>

      <div class="flex items-center gap-2">
        <UButton variant="outline" color="gray" icon="i-heroicons-arrow-top-right-on-square" label="Ver site" />
        <UButton :loading="isSaving" :label="isSaving ? 'A guardar...' : 'Guardar'" leading-icon="i-heroicons-cloud-arrow-up" :color="isDirty ? 'primary' : 'gray'" :variant="isDirty ? 'solid' : 'outline'" @click="save" />
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      
      <aside class="w-52 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col p-2 space-y-1">
        <UButton 
          v-for="s in sections" :key="s.id" 
          :icon="s.icon" 
          :label="s.label" 
          :variant="activeSection === s.id ? 'soft' : 'ghost'" 
          :color="activeSection === s.id ? 'primary' : 'gray'"
          class="justify-start w-full"
          @click="activeSection = s.id" 
        />
      </aside>

      <div class="w-80 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 overflow-y-auto p-5">
        
        <div v-if="activeSection === 'sobre'" class="space-y-4">
          <h3 class="font-bold text-gray-900 dark:text-white">Sobre mim</h3>
          <UFormField label="Nome completo"><UInput v-model="portfolio.sobre.nome" @input="markDirty" /></UFormField>
          <UFormField label="Título profissional"><UInput v-model="portfolio.sobre.titulo" @input="markDirty" /></UFormField>
          <UFormField label="Biografia"><UTextarea v-model="portfolio.sobre.bio" :rows="4" autoresize @input="markDirty" /></UFormField>
        </div>

        <div v-else-if="activeSection === 'aparencia'" class="space-y-4">
           <h3 class="font-bold text-gray-900 dark:text-white">Aparência</h3>
           <UFormField label="Cor Principal">
             <div class="flex gap-2">
               <input type="color" v-model="portfolio.primaryColor" class="w-10 h-10 rounded cursor-pointer border-0 p-0" @input="markDirty" />
               <UInput v-model="portfolio.primaryColor" class="flex-1" @input="markDirty" />
             </div>
           </UFormField>
        </div>
      </div>

      <main class="flex-1 bg-gray-100 dark:bg-neutral-950 overflow-auto p-8 flex justify-center items-start">
        <div :class="['transition-all duration-500 ease-in-out bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden', previewWidths[previewMode]]" style="min-h: 800px;">
          
          <div class="bg-primary-600 px-8 py-16 text-white text-center" :style="{ backgroundColor: portfolio.primaryColor }">
            <h1 class="text-3xl font-extrabold mb-2">{{ portfolio.sobre.nome }}</h1>
            <p class="text-white/80">{{ portfolio.sobre.titulo }}</p>
          </div>
          <div class="p-8">
            <h2 class="font-bold mb-2">Sobre mim</h2>
            <p class="text-gray-500">{{ portfolio.sobre.bio }}</p>
          </div>

        </div>
      </main>

    </div>
  </div>
</template>